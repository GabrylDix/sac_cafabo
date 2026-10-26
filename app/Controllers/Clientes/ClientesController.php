<?php

namespace App\Controllers\Clientes;

//MODELOS
use App\Models\Clientes\ClientesModel;

//HELPERS
use App\Helper\ResponseHelper;
use Reflection;

class ClientesController
{
    protected $dbc;
    private $clientesModel;

    function __construct()
    {
        $this->dbc = $GLOBALS['dbc'];
        $this->clientesModel = new ClientesModel($this->dbc);
    }

    public function nuevo_cliente($datos){
        $datos = $this->normalizarDatosCliente($datos);

        if ($this->clientesModel->verificar_cliente($datos['cuit'])) {
            $id_cliente = $this->clientesModel->nuevo_cliente($datos);

            if ($id_cliente) {
                $response = ResponseHelper::sendResponse(true, 200, 'Se dio de alta correctamente el cliente. Nro Asignado: '.$id_cliente);
            }else{
                $response = ResponseHelper::sendResponse(false, 200, 'Ocurrió un error durante el proceso');
            }
        }else{
            $response =  ResponseHelper::sendResponse(false, 200, 'Ya existe un cliente con el cuit ingresado');
        }

        return $response;
    }

    public function modificar_cliente($datos){
        $datos = $this->normalizarDatosCliente($datos);

        if ($this->clientesModel->modificar_cliente($datos)) {
            return ResponseHelper::sendResponse(true, 200, 'El cliente se modificó correctamente');
        }else{
            return ResponseHelper::sendResponse(false, 200, 'Ocurrió un error durante el proceso');
        }
    }

    public function extraer_clientes(){
        $clientes = $this->clientesModel->extraer_clientes();
        return ResponseHelper::sendResponse(true, 200, "Lista de clientes", $clientes);
    }

    public function extraer_cliente($id_cliente){
        $cliente = $this->clientesModel->extraer_cliente($id_cliente);
        return ResponseHelper::sendResponse(true, 200, "Informacion del cliente", $cliente);
    }

    public function actualizar_estado($datos){

    }

    private function normalizarDatosCliente($datos)
    {
        $datos['cuenta_contable'] = empty($datos['cuenta_contable']) ? null : (int) $datos['cuenta_contable'];

        return $datos;
    }

}
