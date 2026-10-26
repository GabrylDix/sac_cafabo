<?php

namespace App\Models\Liquidaciones;

use App\Helper\ResponseHelper;

use PDO;

class LiquidacionesModel{
    private $dbc;

    function __construct($db){
        $this->dbc = $db;
    }

    public function extraer_liquidaciones($estado){
        $where = '';

        if (!empty($estado) && !is_null($estado)) {
            $where = ' AND estado = :estado'; 
        }

        $sql = "SELECT 
                    l.*,
                    p.nombre AS nombre_convenio
                FROM liquidaciones AS l
                INNER JOIN padron_convenios AS p
                    ON l.convenio_id = p.id_convenio
                WHERE 1 = 1
                    {$where}
                ORDER BY l.id DESC";
        $query = $this->dbc->prepare($sql);

        if (!empty($estado) && !is_null($estado)) {
            $query->bindValue(':estado', $estado, PDO::PARAM_STR);
        }

        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_liquidacion($id_liquidacion){
        $sql = "SELECT 
                    l.*,
                    p.nombre AS nombre_convenio
                FROM liquidaciones AS l
                INNER JOIN padron_convenios AS p
                    ON l.convenio_id = p.id_convenio
                WHERE l.id = :id_liquidacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_liquidacion', $id_liquidacion, PDO::PARAM_INT);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function extraer_liquidacion_detalle($id_liquidacion){
        $sql = "SELECT * FROM liquidaciones_detalle
                WHERE id_liquidacion = :id_liquidacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_liquidacion', $id_liquidacion, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_presentaciones($id_liquidacion){
        $sql = "SELECT 
                    liq_pres.id_liquidacion,
                    p.*,
                    c.nombre AS nombre_convenio
                FROM liquidaciones_presentaciones AS liq_pres
                INNER JOIN presentaciones AS p
                    ON liq_pres.id_presentacion = p.id_presentacion
                INNER JOIN padron_convenios AS c
                    ON p.convenio_id = c.id_convenio
                WHERE liq_pres.id_liquidacion = :id_liquidacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_liquidacion', $id_liquidacion, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_recibos($id_liquidacion){
        $sql = "SELECT 
                    liq_rec.*, 
                    rec.numero_comprobante,
                    rec.fecha_comprobante,
                    rec.cliente,
                    rec.total
                FROM liquidaciones_recibos AS liq_rec
                INNER JOIN recibos_cobranza AS rec
                    ON liq_rec.id_recibo = rec.id_recibo
                WHERE liq_rec.id_liquidacion = :id_liquidacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_liquidacion', $id_liquidacion, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertar_liquidacion($datos){
        $sql = "INSERT INTO liquidaciones
                SET convenio_id = :convenio_id,
                    porcentaje = :porcentaje,
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('convenio_id', $datos['id_convenio'], PDO::PARAM_INT);
        $query->bindValue('porcentaje', $datos['porcentaje'], PDO::PARAM_INT);
        $query->bindValue('usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if ($query->execute()) {
            return $this->dbc->lastInsertID();
        }else{
            return false;
        }
    }

    public function insertar_liquidaciones_detalle_farmacias($id_liquidacion, $porcentaje, $datos){
        $sql = "INSERT INTO liquidaciones_detalle_farmacias(id_liquidacion, id_farmacia, id_presentacion, id_plan, cantidad_recetas, presentado, recupero_gastos, debitos, debitos_os, creditos, creditos_os, total)
                VALUES(:id_liquidacion, :id_farmacia, :id_presentacion, :id_plan, :cantidad_recetas, :presentado, :recupero_gastos, :debitos, :debitos_os, :creditos, :creditos_os, :total)";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_liquidacion', $id_liquidacion, PDO::PARAM_INT);
        $query->bindValue(':id_farmacia', $datos['id_farmacia'], PDO::PARAM_STR);
        $query->bindValue(':id_presentacion', $datos['presentacion_id'], PDO::PARAM_INT);
        $query->bindValue(':id_plan', $datos['plan_id'], PDO::PARAM_INT);
        $query->bindValue(':cantidad_recetas', $datos['cantidad_recetas'], PDO::PARAM_INT);
        $query->bindValue(':presentado', $datos['importe_100'], PDO::PARAM_STR);
        $query->bindValue(':recupero_gastos', ($datos['recupero_gastos'] * $porcentaje) / 100, PDO::PARAM_STR);
        $query->bindValue(':debitos', ($datos['debitos'] * $porcentaje) / 100, PDO::PARAM_STR);
        $query->bindValue(':debitos_os', ($datos['debitos_os'] * $porcentaje) / 100, PDO::PARAM_STR);
        $query->bindValue(':creditos', ($datos['creditos'] * $porcentaje) / 100, PDO::PARAM_STR);
        $query->bindValue(':creditos_os', ($datos['creditos_os'] * $porcentaje) / 100, PDO::PARAM_STR);
        $query->bindValue(':total', ($datos['total_a_pagar'] * $porcentaje) / 100, PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            // print_r($query->errorInfo()[2]);exit;
            return false;
        }
    }

    public function insertar_liquidacion_presentaciones($id_liquidacion, $id_presentacion){
        $sql = "INSERT INTO liquidaciones_presentaciones(id_liquidacion, id_presentacion)
                VALUES (:id_liquidacion, :id_presentacion)";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('id_liquidacion', $id_liquidacion, PDO::PARAM_INT);
        $query->bindValue('id_presentacion', $id_presentacion, PDO::PARAM_INT);

        $query->execute();
    }

    public function insertar_liquidacion_recibo($id_liquidacion, $id_recibo){
        $sql = "INSERT INTO liquidaciones_recibos(id_liquidacion, id_recibo)
                VALUES (:id_liquidacion, :id_recibo)";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_liquidacion', $id_liquidacion, PDO::PARAM_INT);
        $query->bindValue(':id_recibo', $id_recibo, PDO::PARAM_INT);
        $query->execute();
    }

    public function insertar_liquidacion_detalle($id_liquidacion){
        $sql = "INSERT INTO liquidaciones_detalle(id_liquidacion, id_farmacia, nombre, cantidad_recetas, presentado, recupero_gastos, debitos, debitos_os, creditos, creditos_os, total)
            SELECT
                :id_liquidacion,
                ldf.id_farmacia,
                far.nombre,
                sum(ldf.cantidad_recetas),
                sum(ldf.presentado),
                sum(ldf.recupero_gastos),
                sum(ldf.debitos),
                sum(ldf.debitos_os),
                sum(ldf.creditos),
                sum(ldf.creditos_os),
                sum(ldf.total)
            FROM liquidaciones_detalle_farmacias AS ldf
            LEFT JOIN padron_farmacias AS far
                ON ldf.id_farmacia = far.id_farmacia
            WHERE ldf.id_liquidacion = :id_liquidacion
            GROUP BY ldf.id_farmacia";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_liquidacion', $id_liquidacion, PDO::PARAM_INT);

        return $query->execute();
    }

    public function actualizar_totales_liquidacion($id_liquidacion){
        $sql = "SELECT 
                    sum(cantidad_recetas) AS cantidad_recetas,
                    sum(presentado) AS presentado,
                    sum(recupero_gastos) AS recupero_gastos,
                    sum(debitos) AS debitos,
                    sum(debitos_os) AS debitos_os,
                    sum(creditos) AS creditos,
                    sum(creditos_os) AS creditos_os,
                    sum(total)AS total 
                FROM liquidaciones_detalle
                WHERE id_liquidacion = :id_liquidacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_liquidacion', $id_liquidacion, PDO::PARAM_INT);
        $query->execute();
        $totales = $query->fetch(PDO::FETCH_ASSOC);

        $sql_upd = "UPDATE liquidaciones
                    SET 
                        cantidad_recetas = :cantidad_recetas, 
                        presentado = :presentado, 
                        recupero_gastos = :recupero_gastos, 
                        debitos = :debitos, 
                        debitos_os = :debitos_os, 
                        creditos = :creditos, 
                        creditos_os = :creditos_os, 
                        total = :total  
                    WHERE id = :id_liquidacion";
        $query_upd = $this->dbc->prepare($sql_upd);
        $query_upd->bindValue(':cantidad_recetas', $totales['cantidad_recetas'], PDO::PARAM_INT);
        $query_upd->bindValue(':presentado', $totales['presentado'], PDO::PARAM_STR);
        $query_upd->bindValue(':recupero_gastos', $totales['recupero_gastos'], PDO::PARAM_STR);
        $query_upd->bindValue(':debitos', $totales['debitos'], PDO::PARAM_STR);
        $query_upd->bindValue(':debitos_os', $totales['debitos_os'], PDO::PARAM_STR);
        $query_upd->bindValue(':creditos', $totales['creditos'], PDO::PARAM_STR);
        $query_upd->bindValue(':creditos_os', $totales['creditos_os'], PDO::PARAM_STR);
        $query_upd->bindValue(':total', $totales['total'], PDO::PARAM_STR);
        $query_upd->bindValue(':id_liquidacion', $id_liquidacion, PDO::PARAM_INT);

        return $query_upd->execute();
    }

    public function eliminar_liquidacion($id_liquidacion){
        $sql = "UPDATE liquidaciones
                SET estado = 'EL',
                    usuario_eliminacion = :usuario_eliminacion,
                    fecha_eliminacion = :fecha_eliminacion
                WHERE id = :id_liquidacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('usuario_eliminacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue('fecha_eliminacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);
        $query->bindValue('id_liquidacion', $id_liquidacion, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function confirmar_liquidacion($id_liquidacion){
        $sql = "UPDATE liquidaciones 
                SET estado = 'AP',
                    usuario_confirmacion = :usuario_confirmacion,
                    fecha_confirmacion = :fecha_confirmacion
                WHERE id = :id_liquidacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('usuario_confirmacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue('fecha_confirmacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);
        $query->bindValue('id_liquidacion', $id_liquidacion, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    //LOTES ORDENES DE PAGO
    public function extraer_para_lote($ids){
        $ids_liquidaciones = implode(',', $ids);

        $sql = "SELECT 
                    'FAR' AS tipo_destino,
                    det.id_farmacia AS id_destino, 
                    nombre AS descripcion,
                    sum(total) AS importe
                FROM liquidaciones_detalle AS det
                WHERE id_liquidacion in ({$ids_liquidaciones})
                GROUP BY id_farmacia";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizar_estado_liquidaciones($ids, $estado){
        $ids_liquidaciones = implode(',', $ids);
        $sql = "UPDATE liquidaciones
                SET estado = :estado
                WHERE id in ({$ids_liquidaciones});";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':estado', $estado);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

}
