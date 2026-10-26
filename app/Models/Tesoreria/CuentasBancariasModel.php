<?php

namespace App\Models\Tesoreria;

use PDO;

class CuentasBancariasModel{
    private $dbc;

    function __construct($db){
        $this->dbc = $db;
    }

    public function nueva_cuenta_bancaria($datos){
        $sql = "INSERT INTO cuentas_bancarias
                SET banco = :banco,
                    numero_cuenta = :numero_cuenta,
                    nombre_cuenta = :nombre_cuenta,
                    cuenta_contable = :cuenta_contable,
                    cbu = :cbu,
                    alias = :alias,
                    usuario_creacion = :usuario_creacion,
                    fecha_creacion = :fecha_creacion";
        $query = $this->dbc->prepare($sql);

        $cuentaContable = $datos['cuenta_contable'] ?? null;

        $query->bindValue('banco', $datos['banco'], PDO::PARAM_INT);
        $query->bindValue('numero_cuenta', $datos['numero_cuenta'], PDO::PARAM_STR);
        $query->bindValue('nombre_cuenta', $datos['nombre_cuenta'], PDO::PARAM_STR);
        $query->bindValue('cuenta_contable', $cuentaContable, $cuentaContable === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $query->bindValue('cbu', $datos['cbu'], PDO::PARAM_STR);
        $query->bindValue('alias', $datos['alias'], PDO::PARAM_STR);
        $query->bindValue('usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue('fecha_creacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            print_r($query->errorInfo()[2]);exit;
            return false;
        }
    }

    public function extraer_cuentas_bancarias(){
        $sql = "SELECT 
                    cb.*,
                    b.nombre AS nombre_banco,
                    CASE
                        WHEN cc.id_cuenta IS NULL THEN NULL
                        ELSE CONCAT(cc.codigo_cuenta, ' - ', cc.nombre_cuenta)
                    END AS cuenta_contable_label
                FROM cuentas_bancarias AS cb
                INNER JOIN padron_bancos AS b
                    ON cb.banco = b.id_banco
                LEFT JOIN cuentas_contables AS cc
                    ON cb.cuenta_contable = cc.id_cuenta";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_cuenta_bancaria($id_cuenta_bancaria){
        $sql = "SELECT 
                    cb.*,
                    b.nombre AS nombre_banco,
                    CASE
                        WHEN cc.id_cuenta IS NULL THEN NULL
                        ELSE CONCAT(cc.codigo_cuenta, ' - ', cc.nombre_cuenta)
                    END AS cuenta_contable_label
                FROM cuentas_bancarias AS cb
                INNER JOIN padron_bancos AS b
                    ON cb.banco = b.id_banco
                LEFT JOIN cuentas_contables AS cc
                    ON cb.cuenta_contable = cc.id_cuenta
                WHERE cb.id_cuenta = :id_cuenta";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('id_cuenta', $id_cuenta_bancaria, PDO::PARAM_INT);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function modificar_cuenta_bancaria($datos){
        $sql = "UPDATE cuentas_bancarias
                SET banco = :banco,
                    numero_cuenta = :numero_cuenta,
                    nombre_cuenta = :nombre_cuenta,
                    cuenta_contable = :cuenta_contable,
                    cbu = :cbu,
                    alias = :alias,
                    usuario_modificacion = :usuario_modificacion,
                    fecha_modificacion = :fecha_modificacion
                WHERE id_cuenta = :id_cuenta";
        $query = $this->dbc->prepare($sql);

        $cuentaContable = $datos['cuenta_contable'] ?? null;

        $query->bindValue('banco', $datos['banco'], PDO::PARAM_INT);
        $query->bindValue('numero_cuenta', $datos['numero_cuenta'], PDO::PARAM_STR);
        $query->bindValue('nombre_cuenta', $datos['nombre_cuenta'], PDO::PARAM_STR);
        $query->bindValue('cuenta_contable', $cuentaContable, $cuentaContable === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $query->bindValue('cbu', $datos['cbu'], PDO::PARAM_STR);
        $query->bindValue('alias', $datos['alias'], PDO::PARAM_STR);
        $query->bindValue('usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue('fecha_modificacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);
        $query->bindValue('id_cuenta', $datos['id_cuenta'], PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function verificar_cuenta_bancaria($cbu, $alias){
        $sql = "SELECT * FROM cuentas_bancarias
                WHERE cbu = :cbu
                    OR alias = :alias";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('cbu', $cbu, PDO::PARAM_INT);
        $query->bindValue('alias', $alias, PDO::PARAM_STR);

        $query->execute();

        $cuenta = $query->fetch(PDO::FETCH_ASSOC);

        if (empty($cuenta)) {
            return true;
        }else{
            return false;
        }
    }

    public function actualizar_estado($id_cuenta_bancaria, $estado){
        $eliminacion = "";

        if ($estado == 'A') {
            $eliminacion = ' , usuario_eliminacion = :usuario_eliminacion, fecha_eliminacion = :fecha_eliminacion';
        }

        $sql = "UPDATE cuentas_bancarias
                SET estado = :estado {$eliminacion}
                WHERE id_cuenta = :id_cuenta_bancaria";
        $query = $this->dbc->prepare($sql);
        
        $query->bindValue('estado', $estado, PDO::PARAM_STR);

        if ($estado == 'A') {
            $query->bindValue('usuario_eliminacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
            $query->bindValue('fecha_eliminacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);
        }

        $query->bindValue('id_cuenta_bancaria', $id_cuenta_bancaria, PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function extraer_movimientos($datos){
        $sql = "SELECT * FROM movimientos_bancarios AS mv
                WHERE id_cuenta = :id_cuenta
                    AND fecha BETWEEN :fecha_desde AND :fecha_hasta
                ORDER BY fecha DESC, id_movimiento DESC";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('id_cuenta', $datos['id_cuenta'], PDO::PARAM_INT);
        $query->bindValue('fecha_desde', $datos['fecha_desde'], PDO::PARAM_STR);
        $query->bindValue('fecha_hasta', $datos['fecha_hasta'], PDO::PARAM_STR);

        $query->execute();
        // print_r($query->errorInfo()[2]);exit;
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

}
