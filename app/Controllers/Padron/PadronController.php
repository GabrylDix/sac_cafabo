<?php
namespace App\Controllers\Padron;

use App\Models\Padron\PadronModel;

//HELPERS
use App\Helper\ResponseHelper;

class PadronController {
    protected $dbc;
    private $padronModel;

    public function __construct() {
        $this->dbc = $GLOBALS['dbc'];
        $this->padronModel = new PadronModel($this->dbc);
    }

    public function provincias() {
        $provincias = $this->padronModel->obtener_provincias();
        return ResponseHelper::sendResponse(true, 200, "Listado de provincias",$provincias);
    }

    public function localidades($patente = null) {
        $localidades = $this->padronModel->obtener_localidades($patente);
        return ResponseHelper::sendResponse(true, 200, "Listado de localidades", $localidades);
    }

    public function condiciones_iva(){
        $condiciones_iva = $this->padronModel->condiciones_iva();
        return ResponseHelper::sendResponse(true, 200, "Condiciones de IVA", $condiciones_iva);
    }

    public function extraer_bancos(){
        $bancos = $this->padronModel->extraer_bancos();
        return ResponseHelper::sendResponse(true, 200, "Listado de bancos", $bancos);
    }
}