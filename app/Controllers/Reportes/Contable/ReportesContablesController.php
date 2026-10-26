<?php

namespace App\Controllers\Reportes\Contable;

//MODELOS
use App\Models\Contabilidad\AsientosContablesModel;
use App\Models\Contabilidad\CuentasContablesModel;

//HELPERS
use App\Helper\ResponseHelper;

//OTROS
use Exception;

class ReportesContablesController
{
    protected $dbc;
    private $asientosContablesModel;

    function __construct()
    {
        $this->dbc = $GLOBALS['dbc'];
        $this->asientosContablesModel = new AsientosContablesModel($this->dbc);
    }

    public function extraer_libro_mayor($datos)
    {
        $libroMayor = $this->asientosContablesModel->extraer_libro_mayor($datos);
        return ResponseHelper::sendResponse(true, 200, "Libro mayor", $libroMayor);
    }

    public function insertar_detalle($id_asiento, $detalle, $fecha_aplicacion)
    {
        $cuentasContablesModel = new CuentasContablesModel($this->dbc);

        foreach ($detalle as $det) {
            $cuenta = $cuentasContablesModel->extraer_cuenta_contable($det['id_cuenta']);
            $det['descripcion'] = $cuenta['nombre_cuenta'];
            $resultado = $this->asientosContablesModel->insertar_asiento_detalle($id_asiento, $det, $fecha_aplicacion);

            if (!$resultado) {
                throw new Exception("Error al insertar el detalle de cuenta: {$det['id_cuenta']}");
            }
        }
    }

    public function extraer_asientos_contables()
    {
        $asientos = $this->asientosContablesModel->extraer_asientos_contables();
        return ResponseHelper::sendResponse(true, 200, "Lista de asientos contables", $asientos);
    }

    public function extraer_asiento_contable($id_asiento)
    {
        $asiento['cabecera'] = $this->asientosContablesModel->extraer_asiento_cabecera($id_asiento);
        $asiento['detalle'] = $this->asientosContablesModel->extraer_asiento_detalle($id_asiento);
        return ResponseHelper::sendResponse(true, 200, "Informacion de asiento", $asiento);
    }
}
