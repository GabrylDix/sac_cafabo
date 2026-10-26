<?php
namespace App\Controllers\Liquidaciones;

//MODELOS
use App\Models\Liquidaciones\LiquidacionesModel;
use App\Models\Presentaciones\PresentacionesModel;

//HELPERS
use App\Helper\ResponseHelper;
use Exception;

class LiquidacionesController{
    protected $dbc;
    private $liquidacionesModel;

    function __construct(){
        $this->dbc = $GLOBALS['dbc'];
        $this->liquidacionesModel = new LiquidacionesModel($this->dbc);
    }

    public function extraer_liquidaciones($estado = null){
        $liquidaciones = $this->liquidacionesModel->extraer_liquidaciones($estado);
        return ResponseHelper::sendResponse(true, 200, "Lista de liquidaciones", $liquidaciones);
    }

    public function extraer_liquidacion($id_liquidacion){
        $liquidacion['cabecera'] = $this->liquidacionesModel->extraer_liquidacion($id_liquidacion);
        $liquidacion['detalle'] = $this->liquidacionesModel->extraer_liquidacion_detalle($id_liquidacion);
        $liquidacion['presentaciones'] = $this->liquidacionesModel->extraer_presentaciones($id_liquidacion);
        $liquidacion['recibos'] = $this->liquidacionesModel->extraer_recibos($id_liquidacion);

        return ResponseHelper::sendResponse(true, 200, "Informacion de liquidacion", $liquidacion);
    }

    public function liquidar_presentaciones($datos){
        try {
            $this->dbc->beginTransaction();
            //INSERTO LA CABECERA
            $consultas['id_liquidacion'] = $this->liquidacionesModel->insertar_liquidacion($datos['cabecera']);
            // INSERTO EL DETALLE A NIVEL PLAN
            $consultas['detalle_farmacia'] = $this->insertar_liquidacion_detalle_farmacias($datos['cabecera'], $datos['presentaciones'], $consultas['id_liquidacion']);
            //INSERTO LOS REGISTROS A NIVEL FARMACIA
            $consultas['detalle'] = $this->liquidacionesModel->insertar_liquidacion_detalle($consultas['id_liquidacion']);
            // ACTUALIZO LOS TOTALES DE LA CABECERA
            $consultas['upd_cabecera'] = $this->liquidacionesModel->actualizar_totales_liquidacion($consultas['id_liquidacion']);
            //ACTUALIZO LAS PRESENTACIONES
            $consultas['upd_pres'] = $this->actualizar_presentaciones($datos['cabecera'], $datos['presentaciones']);
            //INSERTO LOS REGISTROS DE LOS RECIBOS USADOS
            $consultas['liq_rec'] = $this->insertar_recibos($datos['recibos'], $datos['presentaciones']);

            if ($consultas['id_liquidacion'] && $consultas['detalle_farmacia'] && $consultas['detalle'] && $consultas['upd_cabecera'] && $consultas['upd_pres'] && $consultas['liq_rec']) {
                $this->dbc->commit();
                return ResponseHelper::sendResponse(true, 200, 'Las presentaciones se liquidaron correctamente.');
            }else{
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, 'Ocurrio un error durante el proceso');
            }
         } catch (Exception $e) {
            if ($this->dbc->inTransaction()) {
                $this->dbc->rollBack();
            }

            return ResponseHelper::sendResponse(false, 500, 'Ocurrio un error durante el proceso');
        }
    }

    public function insertar_liquidacion_detalle_farmacias($cabecera, $presentaciones, $id_liquidacion){
        $presentacionesModel = new PresentacionesModel($this->dbc);

        foreach ($presentaciones as $p) {
            $presentacion = $presentacionesModel->extraer_presentacion_planes($p);    

            $this->liquidacionesModel->insertar_liquidacion_presentaciones($id_liquidacion, $p);

            foreach ($presentacion as $far) {
                if (!$this->liquidacionesModel->insertar_liquidaciones_detalle_farmacias($id_liquidacion, $cabecera['porcentaje'], $far)) {
                    return false;
                }
            }
        }
        return true;
    }

    public function actualizar_presentaciones($cabecera, $presentaciones){
        $presentacionesModel = new PresentacionesModel($this->dbc);

        foreach($presentaciones AS $p){
            $consultas['upd_pres'] = $presentacionesModel->actualizar_saldos($p, $cabecera['porcentaje']);

            $pres = $presentacionesModel->extraer_presentacion($p);

            if ($pres['cabecera']['porcentaje_liquidado'] == 100) {
                $estado = "LT";
            }else{
                $estado = "LP";
            }

            $consultas['upd_estado'] = $presentacionesModel->actualizar_estado($p, $estado);
            if (!$consultas['upd_pres'] || !$consultas['upd_estado']) {
                return false;
            }
        }

        return true;
    }

    public function insertar_recibos($id_liquidacion, $recibos){
        foreach ($recibos as $re) {
            $this->liquidacionesModel->insertar_liquidacion_recibo($id_liquidacion, $re);
        }
        return true;
    }

    public function eliminar_liquidacion($id_liquidacion){
        try {
            $this->dbc->beginTransaction();
            //ACTUALIZO A ELIMINADO LA LIQUIDACION
            $consultas['eliminar'] = $this->liquidacionesModel->eliminar_liquidacion($id_liquidacion);
            //ACTUALIZO EL ESTADO DE LAS PRESENTACIONES
            $consultas['upd_pres'] = $this->actualizar_estado_presentaciones($id_liquidacion, 'PL');

            if ($consultas['eliminar'] && $consultas['upd_pres']) {
                $this->dbc->commit();
                return ResponseHelper::sendResponse(true, 200, "La liquidación N°. {$id_liquidacion} se eliminó correctamente");
            }else{
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
            }
        } catch (Exception $e) {
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
        }
    }

    public function actualizar_estado_presentaciones($id_liquidacion, $estado){
        $presentaciones = $this->liquidacionesModel->extraer_presentaciones($id_liquidacion);
        $presentacionesModel = new PresentacionesModel($this->dbc);

        foreach ($presentaciones as $p) {
            $presentacionesModel->actualizar_estado($p['id_presentacion'], $estado);
        }

        return true;
    }

    public function confirmar_liquidacion($id_liquidacion){
        try {
            $this->dbc->beginTransaction();
            //ACTUALIZO LA LIQUIDACION
            $consultas['upd'] = $this->liquidacionesModel->confirmar_liquidacion($id_liquidacion);
            //QUEDARIA PENDIENTE LOS ASIENTOS CONTABLES

            if ($consultas['upd']) {
                $this->dbc->commit();
                return ResponseHelper::sendResponse(true, 200, "La liquidación nro. {$id_liquidacion} se confirmó correctamente");
            }else{
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al intentar confirmar la liquidación");
            }   
        } catch (Exception $e) {
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
        }
    }


}   
