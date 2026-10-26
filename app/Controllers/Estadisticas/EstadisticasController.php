<?php

namespace App\Controllers\Estadisticas;

//MODELOS
use App\Models\Estadisticas\EstadisticasModel;

//HELPERS
use App\Helper\ResponseHelper;

class EstadisticasController
{
    protected $dbc;
    private $estadisticasModel;

    function __construct()
    {
        $this->dbc = $GLOBALS['dbc'];
        $this->estadisticasModel = new EstadisticasModel($this->dbc);
    }

    public function home(){
        $estadisticas['farmacias'] = $this->estadisticasModel->get_farmacias();
        $estadisticas['convenios'] = $this->estadisticasModel->get_convenios();
        $estadisticas['presentaciones'] = $this->estadisticasModel->get_presentaciones();
        $estadisticas['top_convenios_facturados'] = $this->estadisticasModel->get_top_convenios_facturados();
        $estadisticas['top_farmacias_facturadas'] = $this->estadisticasModel->get_top_farmacias_facturadas();
        $estadisticas['presentaciones_convenios'] = $this->estadisticasModel->presentaciones_convenios();
        $estadisticas['facturacion']['ingresos'] = $this->estadisticasModel->get_ingresos();
        return ResponseHelper::sendResponse(true, 200, "Estadisticas Home", $estadisticas);
    }

}
