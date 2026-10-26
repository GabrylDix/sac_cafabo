<?php

namespace App\Controllers\Bancos;

//MODELOS
use App\Models\Bancos\BancosModel;

//HELPERS
use App\Helper\ResponseHelper;


class BancosController
{
    protected $dbc;
    private $bancosModel;

    function __construct()
    {
        $this->dbc = $GLOBALS['dbc'];
        $this->bancosModel = new BancosModel($this->dbc);
    }

    /**
     * EJEMPLO
     */
    // public function funcion()
    // {
    //     $convenios = $this->bancosModel->funcion();

    //     $response = ResponseHelper::sendResponse(true, 200, "Listado de Convenios.", $convenios, []);
    //     return $response;
    // }

}
