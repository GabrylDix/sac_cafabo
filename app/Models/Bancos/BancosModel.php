<?php

namespace App\Models\Bancos;

use App\Helper\LoggerHelper;

use PDO;

class BancosModel{
    private $dbc;
    private $directorio = "bancos";

    function __construct($db){
        $this->dbc = $db;
    }

    public function registrar_movimiento_financiero($datos){
        //Aca si sirve el try catch, porque son varias consultas del mismo modelo
        try {
            //Extraigo el saldo del a cuenta
            $saldoAncla = $this->obtener_saldo_inicial($datos['id_cuenta'], $datos['fecha']);
            //Registro el movimiento
            $this->insertar_movimiento($datos);
            //Recalculo los saldos
            $this->recalcular_saldos($datos['id_cuenta'], $datos['fecha'], $saldoAncla);
            //Actualizo el saldo de la cuenta bancaria
            $this->actualizar_saldo_cuenta_bancaria($datos['id_cuenta']);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function obtener_saldo_inicial($idCuenta, $fecha)
    {
        $sql = "SELECT saldo 
                FROM movimientos_bancarios
                WHERE id_cuenta = :id_cuenta 
                  AND fecha < :fecha
                ORDER BY fecha DESC, id_movimiento DESC
                LIMIT 1";

        $query = $this->dbc->prepare($sql);
        $query->execute([
            ':id_cuenta' => $idCuenta,
            ':fecha'     => $fecha
        ]);

        $row = $query->fetch(PDO::FETCH_ASSOC);

        return $row ? (float)$row['saldo'] : 0;
    }

    private function insertar_movimiento($data)
    {
        $sql = "INSERT INTO movimientos_bancarios(id_cuenta, tipo, origen, id_origen, fecha, importe, saldo, descripcion, usuario_creacion, fecha_creacion)
                VALUES(:id_cuenta, :tipo, :origen, :id_origen, :fecha, :importe, 0, :descripcion, :usuario, NOW())";

        $query = $this->dbc->prepare($sql);

        $query->execute([
            ':id_cuenta' => $data['id_cuenta'],
            ':tipo' => $data['tipo'],
            ':origen' => $data['origen'] ?? null,
            ':id_origen' => $data['id_origen'] ?? null,
            ':fecha' => $data['fecha'],
            ':importe' => $data['importe'],
            ':descripcion' => $data['descripcion'] ?? null,
            ':usuario' => $_SESSION['auth_data']['username']
        ]);
    }

    private function recalcular_saldos($idCuenta, $fecha, $saldoAncla)
    {
        $sql = "UPDATE movimientos_bancarios m
            JOIN (
                SELECT 
                    id_movimiento,
                    (:saldo_ancla +
                        SUM(
                            CASE 
                                WHEN tipo = 'INGRESO' THEN importe
                                ELSE -importe
                            END
                        ) OVER (ORDER BY fecha, id_movimiento)
                    ) AS nuevo_saldo
                FROM movimientos_bancarios
                WHERE id_cuenta = :id_cuenta
                  AND fecha >= :fecha
            ) calc ON m.id_movimiento = calc.id_movimiento
            SET m.saldo = calc.nuevo_saldo";

        $query = $this->dbc->prepare($sql);

        $query->execute([
            ':saldo_ancla' => $saldoAncla,
            ':id_cuenta'   => $idCuenta,
            ':fecha'       => $fecha
        ]);
    }

    public function actualizar_saldo_cuenta_bancaria($id_cuenta)
    {
        $sql = "SELECT saldo 
                FROM movimientos_bancarios
                WHERE id_cuenta = :id_cuenta
                ORDER BY fecha DESC, id_movimiento DESC
                LIMIT 1";

        $query = $this->dbc->prepare($sql);
        $query->execute([':id_cuenta' => $id_cuenta]);

        $saldo = $query->fetchColumn() ?: 0;

        $sql_update = "UPDATE cuentas_bancarias
                   SET saldo_actual = :saldo
                   WHERE id_cuenta = :id_cuenta";

        $query_update = $this->dbc->prepare($sql_update);
        $query_update->execute([
            ':saldo' => $saldo,
            ':id_cuenta' => $id_cuenta
        ]);

        return true;
    }

}
