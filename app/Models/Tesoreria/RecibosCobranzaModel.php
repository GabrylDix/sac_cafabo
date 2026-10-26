<?php

namespace App\Models\Tesoreria;

use App\Helper\LoggerHelper;

use PDO;

class RecibosCobranzaModel{
    private $dbc;
    private $directorio = "tesoreria";

    function __construct($db){
        $this->dbc = $db;
    }

    public function insertar_recibo_cobranza($datos){
        $sql = "INSERT INTO recibos_cobranza
                SET numero_comprobante = :numero_comprobante,
                    fecha_comprobante = :fecha_comprobante,
                    cliente_id = :cliente_id,
                    cliente = :cliente,
                    total = :total,
                    observaciones = :observaciones,
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':numero_comprobante', $datos['numero_comprobante'], PDO::PARAM_STR);
        $query->bindValue(':fecha_comprobante', $datos['fecha_comprobante'], PDO::PARAM_STR);
        $query->bindValue(':cliente_id', $datos['cliente_id'], PDO::PARAM_STR);
        $query->bindValue(':cliente', $datos['cliente'], PDO::PARAM_STR);
        $query->bindValue(':total', $datos['total'], PDO::PARAM_STR);
        $query->bindValue(':observaciones', $datos['observacion'], PDO::PARAM_STR);
        $query->bindValue(':usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
    
        if ($query->execute()) {
            return $this->dbc->lastInsertID();
        }else{
            return false;
        }
    }

    public function insertar_recibo_cobranza_detalle($detalle, $id_recibo){
        $sql = "INSERT INTO recibo_cobranza_detalle
                SET id_recibo = :id_recibo,
                    observaciones = :observaciones,
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);

        foreach ($detalle as $det) {
            $query->bindValue(':id_recibo', $id_recibo, PDO::PARAM_INT);
            // $query->bindValue(':id_concepto', $det['id_concepto'], PDO::PARAM_STR);
            $query->bindValue(':observaciones', $det['observaciones'], PDO::PARAM_STR);
            $query->bindValue(':usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

            if (!$query->execute()) {
                return false;
            }
        }

        return true;
    }

    public function insertar_recibo_cobranza_pago($id_recibo, $pago, $estado){
        $sql = "INSERT INTO recibo_cobranza_pagos 
                SET id_recibo = :id_recibo,
                    id_tipo_pago = :id_tipo_pago,
                    importe = :importe,
                    id_cuenta = :id_cuenta,
                    numero_cheque = :numero_cheque,
                    fecha_emision = :fecha_emision,
                    fecha_cobro = :fecha_cobro,
                    observaciones = :observaciones,
                    estado = :estado";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_recibo', $id_recibo, PDO::PARAM_INT);
        $query->bindValue(':id_tipo_pago', $pago['tipo_pago'], PDO::PARAM_STR);
        $query->bindValue(':importe', $pago['importe'], PDO::PARAM_STR);
        $this->bindNullable($query, ':id_cuenta', $pago['id_cuenta'], PDO::PARAM_INT);
        $this->bindNullable($query, ':numero_cheque', $pago['numero_cheque']);
        $this->bindNullable($query, ':fecha_emision', $pago['fecha_emision']);
        $this->bindNullable($query, ':fecha_cobro', $pago['fecha_cobro']);
        $this->bindNullable($query, ':observaciones', $pago['observaciones']);
        $query->bindValue(':estado', $estado, PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function insertar_recibo_cobranza_presentaciones($id_recibo, $presentacion){
        $sql = "INSERT INTO recibo_cobranza_presentaciones
                SET id_recibo = :id_recibo,
                    id_presentacion = :id_presentacion,
                    importe = :importe";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':id_recibo', $id_recibo, PDO::PARAM_INT);
        $query->bindValue(':id_presentacion', $presentacion['id_presentacion'], PDO::PARAM_INT);
        $query->bindValue(':importe', $presentacion['importe'], PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function extraer_recibos(){
        $sql = "SELECT * FROM recibos_cobranza
                ORDER BY id_recibo DESC";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_recibos_presentacion($presentaciones){
        
    }

    private function bindNullable($query, $param, $value, $type = PDO::PARAM_STR) {
        if (is_null($value) || $value === '') {
            $query->bindValue($param, null, PDO::PARAM_NULL);
        } else {
            $query->bindValue($param, $value, $type);
        }
    }

    /**
     * FUNCIONES PARA EXTRAER UN RECIBO
     **/

    public function extraer_cabecera($id_recibo){
        $sql = "SELECT * FROM recibos_cobranza WHERE id_recibo = :id_recibo";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_recibo', $id_recibo, PDO::PARAM_INT);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function extraer_detalle($id_recibo){
        $sql = "SELECT * FROM recibo_cobranza_detalle WHERE id_recibo = :id_recibo";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_recibo', $id_recibo, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_pagos($id_recibo){
        $sql = "SELECT rcp.*,
                    cb.numero_cuenta,
                    cb.nombre_cuenta,
                    b.nombre AS nombre_banco
                FROM recibo_cobranza_pagos AS rcp
                LEFT JOIN cuentas_bancarias AS cb
                    ON rcp.id_cuenta = cb.id_cuenta
                LEFT JOIN padron_bancos AS b
                    ON cb.banco = b.id_banco
                WHERE rcp.id_recibo = :id_recibo";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_recibo', $id_recibo, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_presentaciones_recibo($id_recibo){
        $sql = "SELECT rp.*,
                    pc.nombre AS nombre_convenio,
                    p.periodo 
                FROM recibo_cobranza_presentaciones AS rp
                INNER JOIN presentaciones AS p
                    ON rp.id_presentacion = p.id_presentacion
                INNER JOIN padron_convenios AS pc
                    ON p.convenio_id = pc.id_convenio
                WHERE rp.id_recibo = :id_recibo";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_recibo', $id_recibo, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizar_id_asiento_contable($id_recibo, $id_asiento){
        $sql = "UPDATE recibos_cobranza
                SET id_asiento = :id_asiento
                WHERE id_recibo = :id_recibo";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(":id_asiento", $id_asiento);
        $query->bindValue(":id_recibo", $id_recibo);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * ACTUALIZAR EL ESTADO DE UN RECIBO
     */
    public function actualizar_estado($id_recibo, $estado){
        $sql = "UPDATE recibos_cobranza
                SET estado = :estado
                WHERE id_recibo = :id_recibo";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(":estado", $estado);
        $query->bindValue(":id_recibo", $id_recibo);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }
}
