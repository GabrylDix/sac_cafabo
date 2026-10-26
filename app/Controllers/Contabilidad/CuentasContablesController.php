<?php

namespace App\Controllers\Contabilidad;

//MODELOS
use App\Models\Contabilidad\CuentasContablesModel;

//HELPERS
use App\Helper\ResponseHelper;


class CuentasContablesController
{
    protected $dbc;
    private $cuentasContablesModel;

    function __construct()
    {
        $this->dbc = $GLOBALS['dbc'];
        $this->cuentasContablesModel = new CuentasContablesModel($this->dbc);
    }

    public function nueva_cuenta_contable($datos)
    {
        if (!$this->cuentasContablesModel->verificar_codigo_cuenta($datos['codigo_cuenta'])) {
            if ($this->cuentasContablesModel->nueva_cuenta_contable($datos)) {
                $response = ResponseHelper::sendResponse(true, 200, "La cuenta contable se dio de alta correctamente.", null, [], "Éxito", "success");
            } else {
                $response = ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, [], "Error", "error");
            }
        } else {
            $response = ResponseHelper::sendResponse(false, 200, "El código de cuenta ya se encuentra en uso.", null, [], "Advertencia", "warning");
        }

        return $response;
    }

    public function extraer_cuentas_contables()
    {
        $cuentas_contables = $this->cuentasContablesModel->extraer_cuentas_contables();

        $response = ResponseHelper::sendResponse(true, 200, "Listado de Cuentas Contables.", $cuentas_contables, []);
        return $response;
    }

    public function extraer_cuenta_contable($id_cuenta_contable)
    {
        $data['datos'] = $this->cuentasContablesModel->extraer_cuenta_contable($id_cuenta_contable);
        $response = ResponseHelper::sendResponse(true, 200, "Datos de Cuenta Contable.", $data, []);
        return $response;
    }

    public function modificar_cuenta_contable($datos)
    {
        if ($this->cuentasContablesModel->modificar_cuenta_contable($datos)) {
            $response = ResponseHelper::sendResponse(true, 200, "La cuenta contable se modificó correctamente.", null, []);
        } else {
            $response = ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, []);
        }

        return $response;
    }

    public function cambiar_estado_cuenta_contable($id_cuenta, $estado)
    {
        if ($this->cuentasContablesModel->cambiar_estado_cuenta_contable($id_cuenta, $estado)) {
            $response = ResponseHelper::sendResponse(true, 200, "Actualizacion de estado de cuenta contable.", null, []);
        } else {
            $response = ResponseHelper::sendResponse(false, 200, "Actualizacion de estado de cuenta contable.", null, []);
        }

        return $response;
    }

    public function sugerencias_cuentas_contables($termino)
    {
        return $this->cuentasContablesModel->sugerencias_cuentas_contables($termino);
    }

    public function sugerencias_cuentas_contables_con_minimo($termino, $codigoMinimo)
    {
        return $this->cuentasContablesModel->sugerencias_cuentas_contables_con_minimo($termino, $codigoMinimo);
    }
}
