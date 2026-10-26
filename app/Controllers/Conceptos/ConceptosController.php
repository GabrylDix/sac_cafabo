<?php

namespace App\Controllers\Conceptos;

//MODELOS
use App\Models\Conceptos\ConceptosModel;

//HELPERS
use App\Helper\ResponseHelper;

class ConceptosController
{
    protected $dbc;
    private $conceptosModel;

    function __construct()
    {
        $this->dbc = $GLOBALS['dbc'];
        $this->conceptosModel = new ConceptosModel($this->dbc);
    }

    public function nuevo_concepto($datos)
    {
        $id_concepto = $this->conceptosModel->nuevo_concepto($datos);

        if ($id_concepto) {
            $response = ResponseHelper::sendResponse(true, 200, 'Se dio de alta correctamente el concepto. Nro Asignado: ' . $id_concepto);
        } else {
            $response = ResponseHelper::sendResponse(false, 200, 'Ocurrió un error durante el proceso');
        }
        return $response;
    }

    public function modificar_concepto($datos)
    {
        if ($this->conceptosModel->modificar_concepto($datos)) {
            return ResponseHelper::sendResponse(true, 200, 'El concepto se modificó correctamente');
        } else {
            return ResponseHelper::sendResponse(false, 200, 'Ocurrió un error durante el proceso');
        }
    }

    public function extraer_conceptos()
    {
        $conceptos = $this->conceptosModel->extraer_conceptos();
        return ResponseHelper::sendResponse(true, 200, 'Lista de conceptos', $conceptos);
    }

    public function extraer_concepto($id_concepto)
    {
        $concepto = $this->conceptosModel->extraer_concepto($id_concepto);
        return ResponseHelper::sendResponse(true, 200, 'Informacion del concepto', $concepto);
    }

    public function actualizar_estado($datos)
    {
        $estado = ($datos['estado'] == 'A') ? 'I' : 'A';

        if ($this->conceptosModel->actualizar_estado($datos['id_concepto'], $estado)) {
            return ResponseHelper::sendResponse(true, 200, 'El estado del concepto se actualizó correctamente');
        } else {
            return ResponseHelper::sendResponse(false, 200, 'Ocurrió un error durante el proceso');
        }
    }

    public function sugerencias_conceptos($termino){
        return $this->conceptosModel->sugerencias_conceptos($termino);
    }
}
