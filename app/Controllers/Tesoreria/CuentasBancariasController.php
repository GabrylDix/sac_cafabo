<?php
namespace App\Controllers\Tesoreria;

//MODELOS
use App\Models\Tesoreria\CuentasBancariasModel;

//HELPERS
use App\Helper\ResponseHelper;


class CuentasBancariasController{
    protected $dbc;
    private $cuentasBancariasModel;

    function __construct(){
        $this->dbc = $GLOBALS['dbc'];
        $this->cuentasBancariasModel = new CuentasBancariasModel($this->dbc);
    }

    public function nueva_cuenta_bancaria($datos){
        if ($this->cuentasBancariasModel->verificar_cuenta_bancaria($datos['cbu'], $datos['alias'])) {
            $id_proveedor = $this->cuentasBancariasModel->nueva_cuenta_bancaria($datos);

            if ($id_proveedor) {
                $response = ResponseHelper::sendResponse(true, 200, "Se dio de alta la cuenta bancaria", null, []);
            }else{
                $response = ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, []);
            }
        }else{
            $response = ResponseHelper::sendResponse(false, 200, "Ya existe una cuenta bancaria registrada con el cbu o alias cargado.", null, []);
        }

        return $response;
    }

    public function modificar_cuenta_bancaria($datos){
        if ($this->cuentasBancariasModel->modificar_cuenta_bancaria($datos)) {
            return ResponseHelper::sendResponse(true, 200, "Los datos de actualizaron correctamente", null, []);
        }else{
            return ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, []);
        }
    }

    public function extraer_cuentas_bancarias(){
        $proveedores =  $this->cuentasBancariasModel->extraer_cuentas_bancarias();
        return ResponseHelper::sendResponse(true, 200, "Lista de cuentas bancarias.", $proveedores, []);
    }
   
    public function extraer_cuenta_bancaria($id_cuenta_bancaria){
        $proveedor =  $this->cuentasBancariasModel->extraer_cuenta_bancaria($id_cuenta_bancaria);
        return ResponseHelper::sendResponse(true, 200, "Datos de la cuenta bancaria.", $proveedor, []);
    }

    public function actualizar_estado($datos){
        $estado = ($datos['estado'] == 'A') ? 'I' : 'A';

        if ($this->cuentasBancariasModel->actualizar_estado($datos['id_cuenta_bancaria'], $estado)) {
            return ResponseHelper::sendResponse(true, 200, "Los datos se actualizaron correctamente.", null, []);
        }else{
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, []);
        }
    }

    public function extraer_movimientos($datos){
        $movimientos = $this->cuentasBancariasModel->extraer_movimientos($datos);
        return ResponseHelper::sendResponse(true, 200, "Movimientos", $movimientos);
    }
}
