<?php

namespace App\Models\Tesoreria;

use App\Helper\LoggerHelper;

use PDO;

class LotesModel{
    private $dbc;
    private $directorio = "lotes";

    function __construct($db){
        $this->dbc = $db;
    }

    public function extraer_lotes(){
        $sql = "SELECT 
                    l.*,
                    b.nombre_cuenta AS nombre_banco
                FROM lotes AS l
                INNER JOIN cuentas_bancarias AS b
                    ON l.banco_id = b.id_cuenta";
        $query = $this->dbc->prepare($sql);
        $query->execute();
        
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_lote($id_lote){
        $sql = "SELECT 
                    l.*,
                    b.nombre_cuenta AS nombre_banco
                FROM lotes AS l
                INNER JOIN cuentas_bancarias AS b
                    ON l.banco_id = b.id_cuenta
                WHERE l.id_lote = :id_lote";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_lote', $id_lote, PDO::PARAM_INT);
        $query->execute();
        
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function extraer_ordenes_pago($id_lote){
        $sql = "SELECT *
                FROM ordenes_pago
                WHERE lote_id = :lote_id";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':lote_id', $id_lote, PDO::PARAM_INT);
        $query->execute();
        
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertar_lote($datos){
        $sql = "INSERT INTO lotes(tipo_id, banco_id, importe, usuario_creacion)
                VALUES (:tipo_id, :banco_id, :importe, :usuario_creacion)";
        $query = $this->dbc->prepare($sql);

        if ($query->execute($datos)) {
            return $this->dbc->lastInsertId();
        }else{
            return false;
        }
    }

    public function insertar_orden_pago($datos){
        $sql = "INSERT INTO ordenes_pago
                SET lote_id = :lote_id, 
                    tipo_destino = :tipo_destino, 
                    id_destino = :id_destino, 
                    descripcion = :descripcion,
                    importe = :importe, 
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':lote_id', $datos['lote_id'], PDO::PARAM_INT);
        $query->bindValue(':tipo_destino', $datos['tipo_destino'], PDO::PARAM_STR);
        $query->bindValue(':id_destino', $datos['id_destino'], PDO::PARAM_STR);
        $query->bindValue(':descripcion', $datos['descripcion'], PDO::PARAM_STR);
        $query->bindValue(':importe', $datos['importe'], PDO::PARAM_STR);
        $query->bindValue(':usuario_creacion', $datos['usuario_creacion'], PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function autorizar_lote($id_lote){
        $sql = "UPDATE lotes
                SET estado = 'PA',
                    usuario_autorizacion = :usuario_autorizacion,
                    fecha_autorizacion = :fecha_autorizacion
                WHERE id_lote = :id_lote";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':usuario_autorizacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_autorizacion', date("Y-m-d H:i:s"), PDO::PARAM_STR);
        $query->bindValue(':id_lote', $id_lote, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function eliminar_lote($id_lote){
        $sql = "UPDATE lotes
                SET estado = 'EL',
                    usuario_eliminacion = :usuario_eliminacion,
                    fecha_eliminacion = :fecha_eliminacion
                WHERE id_lote = :id_lote";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':usuario_eliminacion', $_SESSION['auth_data']['username']);
        $query->bindValue(':fecha_eliminacion', date("Y-m-d H:i:s"));
        $query->bindValue(':id_lote', $id_lote);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

}
