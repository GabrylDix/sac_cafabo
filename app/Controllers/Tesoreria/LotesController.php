<?php
namespace App\Controllers\Tesoreria;

//CONTROLADORES
use App\Controllers\Contabilidad\AsientosContablesController;

//MODELOS
use App\Models\Tesoreria\LotesModel;
use App\Models\Liquidaciones\LiquidacionesModel;
use App\Models\Tesoreria\FacturasCompraModel;
use App\Models\Tesoreria\CuentasBancariasModel;

//HELPERS
use App\Helper\ResponseHelper;
use Exception;

class LotesController{
    protected $dbc;
    private $lotesModel;

    function __construct(){
        $this->dbc = $GLOBALS['dbc'];
        $this->lotesModel = new LotesModel($this->dbc);
    }

    public function extraer_lotes(){
        $lotes = $this->lotesModel->extraer_lotes();
        return ResponseHelper::sendResponse(true, 200, "Listado de lotes", $lotes);
    }

    public function extraer_lote($id_lote){
        $lote['cabecera'] = $this->lotesModel->extraer_lote($id_lote);
        $lote['detalle'] = $this->lotesModel->extraer_ordenes_pago($id_lote);
        return ResponseHelper::sendResponse(true, 200, "Informacion de Lote", $lote);
    }

    public function generar_lote($datos){
        try {
            $this->dbc->beginTransaction();

            switch($datos['tipo_lote']){
                case 1:
                    $detalle = $this->extraer_liquidaciones($datos['selecciones']);
                    $consulta['upd_det'] = $this->actualizar_liquidaciones($datos['selecciones']);
                    break;
                case 2:
                    $detalle = $this->extraer_facturas($datos['selecciones']);
                    $consulta['upd_det'] = $this->actualizar_facturas($datos['selecciones']);
                    break;
            }
            $consultas['lote'] = $this->insertar_lote($datos, $detalle);
            $consultas['detalle'] = $this->insertar_ordenes_pago($consultas['lote'], $detalle);
            // print_r($consultas);exit;
            if ($consultas['lote'] && $consultas['detalle'] && $consulta['upd_det']) {
                $this->dbc->commit();
                return ResponseHelper::sendResponse(true, 200, "Se genero el lote Nro: {$consultas['lote']}");
            }else{
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
            }
        } catch (Exception $e) {
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
        }
    }

    private function extraer_liquidaciones($ids){
        $liquidacionesModel = new LiquidacionesModel($this->dbc);
        return $liquidacionesModel->extraer_para_lote($ids);
    }

    private function actualizar_liquidaciones($ids){
        $liquidacionesModel = new LiquidacionesModel($this->dbc);
        return $liquidacionesModel->actualizar_estado_liquidaciones($ids, 'PA');
    }

    private function extraer_facturas($ids){
        $facturasCompraModel = new FacturasCompraModel($this->dbc);
        return $facturasCompraModel->extraer_para_lote($ids);
    }

    private function actualizar_facturas($ids){
        $facturasCompraModel = new FacturasCompraModel($this->dbc);
        return $facturasCompraModel->actualizar_estado_facturas($ids, 'PA');
    }

    private function insertar_lote($datos, $detalle){
        $importe = 0;

        foreach ($detalle as $d) {
            $importe += $d['importe'];  
        }

        $payload = [
            'tipo_id' => $datos['tipo_lote'],
            'banco_id' => $datos['banco_id'],
            'importe' => $importe,
            'usuario_creacion' => $_SESSION['auth_data']['username']
        ];

        return $this->lotesModel->insertar_lote($payload);
    }

    private function insertar_ordenes_pago($id_lote, $detalle){
        foreach ($detalle as $d) {
            $d['usuario_creacion'] = $_SESSION['auth_data']['username']; 
            $d['lote_id'] = $id_lote; 
            if (!$this->lotesModel->insertar_orden_pago($d)) {
                return false;
            }
        }

        return true;
    }

    public function autorizar_lote($id_lote){
        try {
            $this->dbc->beginTransaction(); 
            $consultas['upd'] = $this->lotesModel->autorizar_lote($id_lote);
            $consultas['asiento'] = $this->insertar_asiento_contable($id_lote);
            
            if ($consultas['upd'] && $consultas['asiento']) {
                $this->dbc->commit();
                return ResponseHelper::sendResponse(true, 200, "El lote Nro. {$id_lote} se autorizó correctamente");
            }else{
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
            }
        } catch (Exception $e) {
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
        }
    }

    private function insertar_asiento_contable($id_lote){
        $cuentasBancarias = new CuentasBancariasModel($this->dbc);

        $lote = $this->extraer_lote($id_lote);
        $lote = $lote['data'];

        $cuenta_bancaria = $cuentasBancarias->extraer_cuenta_bancaria($lote['cabecera']['banco_id']);

        switch($lote['cabecera']['tipo_id']){
            case 1:
                $cuenta_debe = 24;
                $descripcion = "Orden de Pago - Pagado a farmacia ";
                break;
            case 2:
                $cuenta_debe = 25;
                $descripcion = "Orden de Pago - Pagado ";
                break;
        }

        $asientoContablesController = new AsientosContablesController($this->dbc);

        foreach ($lote['detalle'] as $op) {
            $payload['detalle'] = [];
            
            $payload['cabecera'] = array('ejercicio' => date("Y"),
                'fecha_aplicacion' => date("Y-m-d"),
                'tipo_origen' => 'ORP',
                'id_origen' => $op['id_orden_pago'],
                'descripcion' => $descripcion . " " . $op['descripcion'],
                'nota' => $descripcion . " " . $op['descripcion']
            );

            $payload['detalle'][] = array('id_cuenta' => $cuenta_debe, 
                'debe' => $op['importe'],
                'haber' => 0
            );

            $payload['detalle'][] = array('id_cuenta' => $cuenta_bancaria['cuenta_contable'], 
                'debe' => 0,
                'haber' => $op['importe']
            );

            $respuesta = $asientoContablesController->insertar_asiento_contable($payload);

            if ($respuesta['success'] == false) {
                return false;
            }
        }

        return true;
    }

    public function eliminar_lote($id_lote){
        try {
            $this->dbc->beginTransaction();
            $consultas['upd'] = $this->lotesModel->eliminar_lote($id_lote);
            $lote = $this->extraer_lote($id_lote);
            $lote = $lote['data'];

            $ids = implode(',', array_column($lote['detalle'], 'id_destino'));

            switch($lote['cabecera']['tipo_id']){
                case 1:
                    $liquidacionesModel = new LiquidacionesModel($this->dbc);
                    $consultas['upd_det'] = $liquidacionesModel->actualizar_estado_liquidaciones($ids, 'AP');
                    break;
                case 2:
                    $facturasCompraModel = new FacturasCompraModel($this->dbc);
                    $consultas['upd_det'] = $facturasCompraModel->actualizar_estado_facturas($ids, 'AP');
                    break;
            }

            if ($consultas['upd'] && $consultas['upd_det']) {
                $this->dbc->commit();
                return ResponseHelper::sendResponse(true, 200, "El lote Nro. {$id_lote} se eliminó correctamente");
            }else{
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.");
            }
        } catch (Exception $e) {
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso. Exception");
        }        
    }

}