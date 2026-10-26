<?php
namespace App\Controllers\Tesoreria;

//CONTROLADORES
use App\Controllers\Contabilidad\AsientosContablesController;

//MODELOS
use App\Models\Tesoreria\RecibosCobranzaModel;
use App\Models\Bancos\BancosModel;
use App\Models\Presentaciones\PresentacionesModel;
use App\Models\Tesoreria\CuentasBancariasModel;

use App\Models\Clientes\ClientesModel;

//HELPERS
use App\Helper\ResponseHelper;
use App\Helper\LoggerHelper;

class RecibosCobranzaController{
    protected $dbc;
    private $reciboCobranzaModel;
    private $directorio = "tesoreria";

    function __construct(){
        $this->dbc = $GLOBALS['dbc'];
        $this->reciboCobranzaModel = new RecibosCobranzaModel($this->dbc);
    }

    /**
     * EXTRAER TODOS LOS RECIBOS
     */
    public function extraer_recibos(){
        $recibos = $this->reciboCobranzaModel->extraer_recibos();
        return ResponseHelper::sendResponse(true, 200, "Lista de recibos", $recibos);
    }

    /**
     * NUEVO RECIBO
     */
    public function nuevo_recibo_cobranza($datos){
        try {
            $this->dbc->beginTransaction();
            // print_r($datos);exit;
            $consulta['cabecera'] = $this->reciboCobranzaModel->insertar_recibo_cobranza($datos['cabecera']);
            $consulta['detalle'] = $this->reciboCobranzaModel->insertar_recibo_cobranza_detalle($datos['detalle'], $consulta['cabecera']);
            $consulta['pagos'] = $this->insertar_recibo_cobranza_pagos($datos['cabecera'], $datos['pagos'], $consulta['cabecera']);
            $consulta['presentaciones'] = $this->insertar_recibo_cobranza_presentaciones($datos['presentaciones'], $consulta['cabecera']);
            $consulta['asiento'] = $this->insertar_asiento_contable($datos, $consulta['cabecera']);
            // print_r($consulta);exit;
            if ($consulta['cabecera'] && $consulta['detalle'] && $consulta['pagos'] && $consulta['presentaciones'] && $consulta['asiento']) {
                $this->dbc->commit();
                return ResponseHelper::sendResponse(true, 200, "El recibo se cargo correctamente. Nro. ".$consulta['cabecera']);
            }else{
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.");
            }
        } catch (\Exception $e) {
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.");
        }
    }

    public function insertar_recibo_cobranza_pagos($datos_cabecera, $pagos, $id_recibo){
        $bancosModel = new BancosModel($this->dbc);
        foreach ($pagos as $p) {
            $estado = "PE";

            if ($p['tipo_pago'] == 'TRA') {
                $estado = "AC";

                $datos_movimiento = array('id_cuenta' => $p['id_cuenta'], 
                    'tipo' => 'INGRESO',
                    'origen' => 'Recibo Cobranza',
                    'id_origen' => $id_recibo,
                    'fecha' => $datos_cabecera['fecha_comprobante'],
                    'importe' => $p['importe'],
                    'descripcion' => $p['observaciones']
                );
                
                if ($bancosModel->registrar_movimiento_financiero($datos_movimiento) == false) {
                    return false;
                }
            }

            $consulta['pago'] = $this->reciboCobranzaModel->insertar_recibo_cobranza_pago($id_recibo, $p, $estado);

            if ($consulta['pago'] == false) {
                return false;
            }
        }

        return true;
    }

    private function insertar_recibo_cobranza_presentaciones($presentaciones, $id_recibo){
        if (!empty($presentaciones)) {
            $presentacionesModel = new PresentacionesModel($this->dbc);

            foreach ($presentaciones as $p) {
                $respuesta['insert_rel'] = $this->reciboCobranzaModel->insertar_recibo_cobranza_presentaciones($id_recibo, $p);
                $respuesta['upd_pres'] = $presentacionesModel->actualizar_estado($p['id_presentacion'], 'PL');
                if (!$respuesta['insert_rel'] || !$respuesta['upd_pres']) {
                    return false;
                }
            }
            return true;
        }else{
            return true;
        }
    }

    private function insertar_asiento_contable($datos, $id_recibo){
        $cuentasBancarias = new CuentasBancariasModel($this->dbc);
        $clientes = new ClientesModel($this->dbc);

        $cliente = $clientes->extraer_cliente($datos['cabecera']['cliente_id']);

        $payload['cabecera'] = array('ejercicio' => date("Y"),
            'fecha_aplicacion' => date("Y-m-d"),
            'tipo_origen' => 'REC',
            'id_origen' => $id_recibo,
            'descripcion' => "Recibo de Cobranza Nro. {$id_recibo}",
            'nota' => "Recibo de Cobranza Nro. {$id_recibo}"
        );
        $payload['detalle'] = [];
        $payload['detalle'][] = array('id_cuenta' => $cliente['cuenta_contable'], 
            'debe' => 0,
            'haber' => $datos['cabecera']['total']
        );

        foreach ($datos['pagos'] as $p) {
            $cuenta_bancaria = $cuentasBancarias->extraer_cuenta_bancaria($p['id_cuenta']);
            // $cuenta_contable = $cuentasContables->extraer_cuenta_contable($cuenta_bancaria['cuenta_contable']);
            $payload['detalle'][] = array('id_cuenta' => $cuenta_bancaria['cuenta_contable'], 
                'debe' => $p['importe'],
                'haber' => 0
            );
        }
        // print_r($payload);exit;
        $asientoContablesController = new AsientosContablesController($this->dbc);

        $respuesta = $asientoContablesController->insertar_asiento_contable($payload);
        // print_r($respuesta);exit;
        if ($respuesta['success']) {
            if ($this->reciboCobranzaModel->actualizar_id_asiento_contable($id_recibo, $respuesta['data']['id_asiento'])) {
                return true;
            }else{
                return false;
            }
        }

        // return $respuesta['success'];
    }

    /**
     * EXTRAER UN RECIBO EN PARTICULAR
     */
    public function extraer_recibo($id_recibo){
        $recibo['cabecera'] = $this->reciboCobranzaModel->extraer_cabecera($id_recibo);
        $recibo['detalle'] = $this->reciboCobranzaModel->extraer_detalle($id_recibo);
        $recibo['pagos'] = $this->reciboCobranzaModel->extraer_pagos($id_recibo);
        $recibo['presentaciones'] = $this->reciboCobranzaModel->extraer_presentaciones_recibo($id_recibo); 

        return ResponseHelper::sendResponse(true, 200, "Informacion de recibo", $recibo);
    }

    public function eliminar_recibo($id_recibo){
        $recibo = $this->extraer_recibo($id_recibo);
        $recibo = $recibo['data'];
        // print_r($recibo);exit;

        $this->dbc->beginTransaction();

        $consulta['upd_recibo'] = $this->reciboCobranzaModel->actualizar_estado($id_recibo, "E");

        if(!empty($recibo['presentaciones'])){
            $presentacionesModel = new PresentacionesModel($this->dbc);
            foreach ($recibo['presentaciones'] as $p) {
                if ($presentacionesModel->actualizar_estado($p['id_presentacion'], "PL") == false) {
                    return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al actualizar el estado de las presentaciones asociadas al recibo.");
                }
            }
        }

        $asientosContables = new AsientosContablesController($this->dbc);

        $consulta['reverso_asiento'] = $asientosContables->revertir_asiento_contable($recibo['cabecera']['id_asiento']);

        if ($consulta['upd_recibo'] && $consulta['reverso_asiento']) {
            $this->dbc->commit();
            return ResponseHelper::sendResponse(true, 200, "El recibo n° {$recibo['id_recibo']} se eliminó correctamente.");
        }else{
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.");
        }
    }

}
