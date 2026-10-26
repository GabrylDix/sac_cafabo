<?php
namespace App\Controllers\Tesoreria;

//MODELOS
use App\Models\Tesoreria\ClientesModel;

//HELPERS
use App\Helper\ResponseHelper;


class ClientesController{
    protected $dbc;
    private $clientesModel;

    function __construct(){
        $this->dbc = $GLOBALS['dbc'];
        $this->clientesModel = new ClientesModel($this->dbc);
    }

    public function nuevo_proveedor($datos){
        if ($this->proveedoresModel->verificar_proveedor($datos['cuit'])) {
            $id_proveedor = $this->proveedoresModel->nuevo_proveedor($datos);

            if ($id_proveedor) {
                $response = ResponseHelper::sendResponse(true, 200, "Se dio de alta el proveedor {$id_proveedor}", null, []);
            }else{
                $response = ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, []);
            }
        }else{
            $response = ResponseHelper::sendResponse(false, 200, "Ya existe un proveedor regitrado con el cuit N°: {$datos['cuit']}.", null, []);
        }

        return $response;
    }

    public function extraer_proveedores(){
        $proveedores =  $this->proveedoresModel->extraer_proveedores();
        return ResponseHelper::sendResponse(true, 200, "Lista de proveedores.", $proveedores, []);
    }
   
    public function extraer_proveedor($id_proveedor){
        $proveedor =  $this->proveedoresModel->extraer_proveedor($id_proveedor);
        return ResponseHelper::sendResponse(true, 200, "Datos del proveedor.", $proveedor, []);
    }

    public function modificar_proveedor($datos){
        if ($this->proveedoresModel->modificar_proveedor($datos)) {
            return ResponseHelper::sendResponse(true, 200, "El proveedor se modificó correctamente", null, []);
        }else{
            return ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, []);
        }
    }
    
    public function actualizar_estado($datos){
        $estado = ($datos['estado'] == "A") ? "I" : "A"; 

        if ($this->proveedoresModel->actualizar_estado($datos["id_proveedor"], $estado)) {
            return ResponseHelper::sendResponse(true, 200, "El estado del proveedor se actualizo correctamente.", null, []);
        }else{
            return ResponseHelper::sendResponse(true, 200, "Ocurrio un error durante el proceso.", null, []);
        }
    }

}
