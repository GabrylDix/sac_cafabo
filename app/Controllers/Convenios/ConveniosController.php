<?php

namespace App\Controllers\Convenios;

//MODELOS
use App\Models\Convenios\ConveniosModel;

//HELPERS
use App\Helper\ResponseHelper;


class ConveniosController
{
    protected $dbc;
    private $conveniosModel;

    function __construct()
    {
        $this->dbc = $GLOBALS['dbc'];
        $this->conveniosModel = new ConveniosModel($this->dbc);
    }

    public function nuevo_convenio($datos, $planes)
    {
        if ($this->conveniosModel->verificar_convenio($datos['id_convenio'])) {
            $this->dbc->beginTransaction();

            $consultas['nuevo_convenio'] = $this->conveniosModel->nuevo_convenio($datos);
            $consultas['plan'] = true;

            foreach ($planes as $p) {
                if ($this->conveniosModel->nuevo_plan($p) == false) {
                    $consultas['plan'] = false;
                }
            }

            if ($consultas['nuevo_convenio'] && $consultas['plan']) {
                $this->dbc->commit();
                $response = ResponseHelper::sendResponse(true, 200, "El convenio se dio de alta correctamente.", null, []);
            } else {
                $this->dbc->rollBack();
                $response = ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, []);
            }
        } else {
            $response = ResponseHelper::sendResponse(false, 200, "El codigo de convenio ya esta en uso.", null, [], "Advertencia", "warning");
        }

        return $response;
    }

    public function extraer_convenios()
    {
        $convenios = $this->conveniosModel->extraer_convenios();

        $response = ResponseHelper::sendResponse(true, 200, "Listado de Convenios.", $convenios, []);
        return $response;
    }

    public function extraer_convenio($id_convenio)
    {
        $data['datos'] = $this->conveniosModel->extraer_convenio($id_convenio);
        $data['planes'] = $this->conveniosModel->extraer_planes($id_convenio);
        $response = ResponseHelper::sendResponse(true, 200, "Datos de Convenio.", $data, []);
        return $response;
    }

    public function modificar_convenio($datos)
    {
        if ($this->conveniosModel->modificar_convenio($datos)) {
            $response = ResponseHelper::sendResponse(true, 200, "El convenio se modificó correctamente.", null, []);
        } else {
            $response = ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, []);
        }

        return $response;
    }

    public function cambiar_estado_convenio($id_convenio, $estado)
    {
        if ($this->conveniosModel->cambiar_estado_convenio($id_convenio, $estado)) {
            $response = ResponseHelper::sendResponse(true, 200, "Actualizacion de estado de convenio.", null, []);
        } else {
            $response = ResponseHelper::sendResponse(false, 200, "Actualizacion de estado de convenio.", null, []);
        }

        return $response;
    }

    /**
     * FUNCION PARA DAR DE ALTA UN NUEVO PLAN
     */
    public function nuevo_plan($datos)
    {

        $plan = $this->conveniosModel->extraer_plan($datos['id_plan'], $datos['convenio_id']);

        if (empty($plan)) {
            if ($this->conveniosModel->nuevo_plan($datos)) {
                $response = ResponseHelper::sendResponse(true, 200, "El plan se registró correctamente.", null, []);
            } else {
                $response = ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, []);
            }
        } else {
            $response = ResponseHelper::sendResponse(false, 200, "El plan ya se encuentra registrado en el sistema.", null, []);
        }

        return $response;
    }

    /**
     * FUNCION PARA MODIFICAR UN PLAN
     */
    public function modificar_plan($datos)
    {
        if ($this->conveniosModel->modificar_plan($datos)) {
            $response = ResponseHelper::sendResponse(true, 200, "El plan se actualizó correctamente.", null, []);
        } else {
            $response = ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, []);
        }

        return $response;
    }

    public function extraer_planes($id_convenio)
    {
        $planes = $this->conveniosModel->extraer_planes($id_convenio);

        $response = ResponseHelper::sendResponse(true, 200, "Lista de planes.", $planes, []);
        return $response;
    }

    public function sugerencias_convenios($termino)
    {
        return $this->conveniosModel->sugerencias_convenios($termino);
    }
}
