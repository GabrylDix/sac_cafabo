<?php

namespace App\Models\Presentaciones;

use App\Helper\LoggerHelper;

use PDO;

class PresentacionesModel{
    private $dbc;
    private $directorio = "presentaciones";

    function __construct($db){
        $this->dbc = $db;
    }

    public function importar_archivo_csv($archivo_csv){
        $sql = "LOAD DATA LOCAL INFILE '{$archivo_csv}'
                INTO TABLE imp_presentaciones
                FIELDS TERMINATED BY ';'
                OPTIONALLY ENCLOSED BY '\"' 
                LINES TERMINATED BY '\n'
                IGNORE 1 LINES
                (id_farmacia, nombre_farmacia, id_plan, cantidad_recetas, importe_100_camara, importe_os_camara, importe_100, importe_os, bonificacion_os, bonificacion_farmacia, notas_credito, debitos_os, creditos_os)";
        $query = $this->dbc->prepare($sql);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function obtener_registros_con_import_0(){
        $sql = "SELECT * FROM imp_presentaciones 
                WHERE importe_100 = 0
                OR importe_100_camara = 0
                OR importe_os_camara = 0
                OR importe_os = 0";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtener_registros_id_farmacia_invalida(){
        $sql = "SELECT * FROM imp_presentaciones 
                WHERE id_farmacia NOT IN (SELECT id_farmacia FROM padron_farmacias)";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtener_registros_id_plan_invalido($id_convenio){
        $sql = "SELECT * FROM imp_presentaciones 
                WHERE id_plan IS NOT NULL 
                AND CONCAT(id_plan, ',',{$id_convenio}) NOT IN (SELECT CONCAT(id_plan, ',',convenio_id) FROM padron_planes)";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function generar_presentaciones($id_convenio, $periodo){
        $sql = "INSERT INTO presentaciones
                SET convenio_id = :convenio_id,
                    periodo = :periodo,
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':convenio_id', $id_convenio, PDO::PARAM_INT);
        $query->bindValue(':periodo', $periodo, PDO::PARAM_STR);
        $query->bindValue(':usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if ($query->execute()) {
            return $this->dbc->lastInsertId();
        }else{
            return false;
        }
    }

    public function insertar_presentacion_planes($id_presentacion){
        $sql = "INSERT INTO presentaciones_plan (presentacion_id, id_farmacia, plan_id, cantidad_recetas, importe_100_presentado, importe_100, a_cargo_os_presentado,a_cargo_os, bonificacion_os, bonificacion_farmacia, notas_credito, debitos_os, creditos_os, total_a_pagar)
                SELECT 
                    :id_presentacion,
                    imp.id_farmacia,
                    imp.id_plan,
                    imp.cantidad_recetas,
                    imp.importe_100_camara,
                    imp.importe_100,
                    imp.importe_os_camara,
                    imp.importe_os,
                    imp.bonificacion_os,
                    imp.bonificacion_farmacia,
                    imp.notas_credito,
                    imp.debitos_os,
                    imp.creditos_os,
                    (imp.importe_os - imp.bonificacion_os - imp.bonificacion_farmacia - imp.notas_credito - imp.debitos_os + imp.creditos_os)
                FROM imp_presentaciones AS imp";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':id_presentacion', $id_presentacion, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function insertar_presentacion_farmacias($id_presentacion){
        $sql = "INSERT INTO presentaciones_farmacias (presentacion_id, id_farmacia, nombre, cantidad_recetas, importe_100_presentado, importe_100, a_cargo_os_presentado,a_cargo_os, bonificacion_os, bonificacion_farmacia, notas_credito, debitos_os, creditos_os, total_a_pagar, saldo_pendiente)
                SELECT 
                    p.presentacion_id,
                    p.id_farmacia,
                    pfar.nombre,
                    sum(p.cantidad_recetas),
                    sum(p.importe_100_presentado),
                    sum(p.importe_100),
                    sum(p.a_cargo_os_presentado),
                    sum(p.a_cargo_os),
                    sum(p.bonificacion_os),
                    sum(p.bonificacion_farmacia),
                    sum(p.notas_credito),
                    sum(p.debitos_os),
                    sum(p.creditos_os),
                    sum(p.total_a_pagar),
                    sum(p.total_a_pagar)
                FROM presentaciones_plan AS p
                INNER JOIN padron_farmacias AS pfar
                    ON p.id_farmacia = pfar.id_farmacia
                WHERE p.presentacion_id = :id_presentacion
                GROUP BY p.id_farmacia";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':id_presentacion', $id_presentacion, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function actualizar_presentacion($id_presentacion){
        $sql = "SELECT 
                    sum(det.cantidad_recetas) AS cantidad_recetas,
                    sum(det.importe_100_presentado) AS importe_100_presentado,
                    sum(det.importe_100) AS importe_100,
                    sum(det.a_cargo_os_presentado) AS a_cargo_os_presentado,
                    sum(det.a_cargo_os) AS a_cargo_os,
                    sum(det.bonificacion_os) AS bonificacion_os,
                    sum(det.bonificacion_farmacia) AS bonificacion_farmacia,
                    sum(det.notas_credito) AS notas_credito,
                    sum(det.debitos_os) AS debitos_os,
                    sum(det.creditos_os) AS creditos_os,
                    sum(det.total_a_pagar) AS total_a_pagar
                FROM presentaciones_farmacias AS det
                WHERE presentacion_id = :id_presentacion
                GROUP BY det.presentacion_id";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_presentacion', $id_presentacion, PDO::PARAM_INT);
        $query->execute();

        $totales = $query->fetch(PDO::FETCH_ASSOC);

        if (!empty($totales)) {
            $sql_upd = "UPDATE presentaciones
                        SET importe_100_presentado = :importe_100_presentado,
                            importe_100 = :importe_100,
                            a_cargo_os_presentado = :a_cargo_os_presentado,
                            a_cargo_os = :a_cargo_os,
                            bonificacion_os = :bonificacion_os,
                            bonificacion_farmacia = :bonificacion_farmacia,
                            notas_credito = :notas_credito,
                            debitos_os = :debitos_os,
                            creditos_os = :creditos_os,
                            total_a_pagar = :total_a_pagar,
                            saldo_pendiente = :total_a_pagar
                        WHERE id_presentacion = :id_presentacion";
            $query_upd = $this->dbc->prepare($sql_upd);
            $query_upd->bindValue(':importe_100_presentado', $totales['importe_100_presentado'], PDO::PARAM_STR);
            $query_upd->bindValue(':importe_100', $totales['importe_100'], PDO::PARAM_STR);
            $query_upd->bindValue(':a_cargo_os_presentado', $totales['a_cargo_os_presentado'], PDO::PARAM_STR);
            $query_upd->bindValue(':a_cargo_os', $totales['a_cargo_os'], PDO::PARAM_STR);
            $query_upd->bindValue(':bonificacion_os', $totales['bonificacion_os'], PDO::PARAM_STR);
            $query_upd->bindValue(':bonificacion_farmacia', $totales['bonificacion_farmacia'], PDO::PARAM_STR);
            $query_upd->bindValue(':notas_credito', $totales['notas_credito'], PDO::PARAM_STR);
            $query_upd->bindValue(':debitos_os', $totales['debitos_os'], PDO::PARAM_STR);
            $query_upd->bindValue(':creditos_os', $totales['creditos_os'], PDO::PARAM_STR);
            $query_upd->bindValue(':total_a_pagar', $totales['total_a_pagar'], PDO::PARAM_STR);

            $query_upd->bindValue(':id_presentacion', $id_presentacion, PDO::PARAM_INT);

            if ($query_upd->execute()) {
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    public function extraer_presentaciones($filtros = null){
        $where = '';

        if (!empty($filtros)) {
            foreach ($filtros as $key => $value) {
                $where .= " AND pres.{$key} = :{$key}";
            }
        }

        $sql = "SELECT 
                    pres.*, 
                    cnv.nombre AS convenio_nombre
                FROM presentaciones AS pres
                INNER JOIN padron_convenios AS cnv
                    ON pres.convenio_id = cnv.id_convenio
                WHERE 1=1
                    {$where}
                ORDER BY pres.id_presentacion DESC";
        $query = $this->dbc->prepare($sql);

        if (!empty($filtros)) {
            foreach ($filtros as $key => $value) {
                $query->bindValue(":{$key}", $value);
            }
        }

        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_recibos($id_presentacion){
        $sql = "SELECT
                    rec_pres.id_recibo,
                    r.numero_comprobante,
                    r.fecha_comprobante,
                    rec_pres.importe,
                    r.estado
                FROM recibo_cobranza_presentaciones AS rec_pres
                INNER JOIN recibos_cobranza AS r
                    ON rec_pres.id_recibo = r.id_recibo
                WHERE rec_pres.id_presentacion = :id_presentacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_presentacion', $id_presentacion, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_presentaciones_liquidar($id_convenio){
        $sql = "SELECT 
                    pres.*, 
                    cnv.nombre AS convenio_nombre
                FROM presentaciones AS pres
                INNER JOIN padron_convenios AS cnv
                    ON pres.convenio_id = cnv.id_convenio
                WHERE pres.convenio_id = :id_convenio
                    AND pres.estado in ('PL', 'LP')
                ORDER BY pres.id_presentacion DESC";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_convenio', $id_convenio, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_presentacion($id_presentacion){
        $sql_cab = "SELECT 
                        pres.*, 
                        cnv.nombre AS convenio_nombre
                    FROM presentaciones AS pres
                    INNER JOIN padron_convenios AS cnv
                        ON pres.convenio_id = cnv.id_convenio
                    WHERE pres.id_presentacion = :id_presentacion";
        $query_cab = $this->dbc->prepare($sql_cab);
        $query_cab->bindValue(':id_presentacion', $id_presentacion, PDO::PARAM_INT);
        $query_cab->execute();

        $sql_det = "SELECT 
                        det.*
                    FROM presentaciones_farmacias AS det
                    WHERE det.presentacion_id = :presentacion_id";
        $query_det = $this->dbc->prepare($sql_det);
        $query_det->bindValue(':presentacion_id', $id_presentacion, PDO::PARAM_INT);
        $query_det->execute();

        $presentacion['cabecera'] = $query_cab->fetch(PDO::FETCH_ASSOC);
        $presentacion['detalle'] = $query_det->fetchAll(PDO::FETCH_ASSOC);

        return $presentacion;
    }

    public function extraer_presentacion_farmacia($id_presentacion, $id_farmacia){
        $sql = "SELECT det.* FROM presentaciones_farmacias AS det
                WHERE det.presentacion_id = :id_presentacion
                    AND id_farmacia = :id_farmacia";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('id_presentacion', $id_presentacion, PDO::PARAM_INT);
        $query->bindValue('id_farmacia', $id_farmacia, PDO::PARAM_INT);
        $query->execute();
        
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_presentacion_planes($id_presentacion){
        $sql = "SELECT pp.*, p.nombre AS nombre_plan 
                FROM presentaciones_plan AS pp
                INNER JOIN presentaciones AS pres
                    ON pp.presentacion_id = pres.id_presentacion
                INNER JOIN padron_planes AS p
                    ON pp.plan_id = p.id_plan
                    AND pres.convenio_id = p.convenio_id
                WHERE pp.presentacion_id = :id_presentacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('id_presentacion', $id_presentacion, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_presentacion_planes_farmacia($id_presentacion, $id_farmacia){
        $sql = "SELECT pp.*, p.nombre AS nombre_plan FROM presentaciones_plan AS pp
                INNER JOIN presentaciones AS pres
                    ON pp.presentacion_id = pres.id_presentacion
                INNER JOIN padron_planes AS p
                    ON pp.plan_id = p.id_plan
                    AND pres.convenio_id = p.convenio_id
                WHERE pp.presentacion_id = :id_presentacion
                    AND pp.id_farmacia = :id_farmacia";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('id_presentacion', $id_presentacion, PDO::PARAM_INT);
        $query->bindValue('id_farmacia', $id_farmacia, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminar_presentacion($id_presentacion){
        $sql = "UPDATE presentaciones
                SET estado = 'E',
                    fecha_eliminacion = :fecha_eliminacion,
                    usuario_eliminacion = :usuario_eliminacion
                WHERE id_presentacion = :id_presentacion";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':fecha_eliminacion', date("Y-m-d H:i:s"), PDO::PARAM_STR);
        $query->bindValue(':usuario_eliminacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':id_presentacion', $id_presentacion, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function actualizar_estado($id_presentacion, $estado){
        $sql = "UPDATE presentaciones
                SET estado = :estado
                WHERE id_presentacion = :id_presentacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':estado', $estado, PDO::PARAM_STR);
        $query->bindValue(':id_presentacion', $id_presentacion, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * PARA LIQUIDACIONES
     **/

    public function actualizar_saldos($id_presentacion, $porcentaje){
        $sql = "UPDATE presentaciones 
                SET 
                    saldo_pendiente = saldo_pendiente - ((total_a_pagar * :porcentaje) / 100),
                    porcentaje_pendiente = porcentaje_pendiente - :porcentaje,
                    saldo_liquidado = saldo_liquidado + ((total_a_pagar * :porcentaje) / 100),
                    porcentaje_liquidado = porcentaje_liquidado + :porcentaje
                WHERE id_presentacion = :id_presentacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':porcentaje', $porcentaje, PDO::PARAM_STR);
        $query->bindValue(':id_presentacion', $id_presentacion, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }
}
