<?php

namespace App\Controllers\Contabilidad;

//MODELOS
use App\Models\Contabilidad\AsientosContablesModel;

//HELPERS
use App\Helper\ResponseHelper;

//OTROS
use Exception;

class AsientosContablesController
{
    protected $dbc;
    private $asientosContablesModel;

    function __construct()
    {
        $this->dbc = $GLOBALS['dbc'];
        $this->asientosContablesModel = new AsientosContablesModel($this->dbc);
    }

    public function insertar_asiento_contable($datos)
    {
        try {
            $transaccionPropia = !$this->dbc->inTransaction();

            if ($transaccionPropia) {
                $this->dbc->beginTransaction();
            }

            $consulta['cabecera'] = $this->asientosContablesModel->insertar_asiento($datos['cabecera']);

            if (!$consulta['cabecera']) {
                throw new Exception("Error al insertar la cabecera del asiento contable.");
            }

            $consulta['detalle'] = $this->insertar_detalle($consulta['cabecera'], $datos['detalle'], $datos['cabecera']['fecha_aplicacion'], $datos['cabecera']['descripcion']);

            if ($transaccionPropia) {
                $this->dbc->commit();
            }
            return ResponseHelper::sendResponse(true, 200, "Se registro el asiento contable.", ['id_asiento' => $consulta['cabecera']]);
        } catch (Exception $e) {
            if ($transaccionPropia) {
                $this->dbc->rollBack();
            }
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => $e->getMessage()]);
        }
    }

    public function insertar_detalle($id_asiento, $detalle, $fecha_aplicacion, $descripcion)
    {
        foreach ($detalle as $det) {
            $det['descripcion'] = $descripcion;
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

    public function revertir_asiento_contable($id_asiento)
    {
        $asiento = $this->extraer_asiento_contable($id_asiento);
        $asiento = $asiento['data'];
        // print_r("asiento: ". $id_asiento);exit;
        $transaccion_activa = $this->dbc->inTransaction();

        if (!$transaccion_activa) {
            $this->dbc->beginTransaction();
        }

        $asiento['cabecera']['descripcion'] = "REVERSO - " . $asiento['cabecera']['descripcion'];

        $consulta['cabecera'] = $this->asientosContablesModel->insertar_asiento($asiento['cabecera']);

        foreach ($asiento['detalle'] as $a) {
            $aux_debe = $a['debe'];
            $a['debe'] = $a['haber'];
            $a['haber'] = $aux_debe;
            $a['descripcion'] = $asiento['cabecera']['descripcion'];

            if ($this->asientosContablesModel->insertar_asiento_detalle($consulta['cabecera'], $a, $asiento['cabecera']['fecha_aplicacion']) == false) {
                if (!$transaccion_activa) {
                    $this->dbc->rollBack();
                }
                return false;
            }
        }

        $consulta['upd_asiento'] = $this->asientosContablesModel->actualizar_id_asiento_original($consulta['cabecera'], $id_asiento);

        if (!$transaccion_activa) {
            $this->dbc->commit();
        }
        // $this->dbc->commit();
        return true;
    }

    public function modificar_asiento_contable($datos)
    {
        $this->dbc->beginTransaction();

        // controlar accion realizada por el usuario
        $cabecera = $datos['cabecera'];
        $detalle = $datos['detalle'];
        $cuentasRecalcular = [];

        //manejar las modificaciones de la cabecera del asiento contable
        $response_cabecera = $this->asientosContablesModel->actualizar_asiento_cabecera($cabecera);

        if ($response_cabecera === false) {
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => "Error al actualizar la cabecera del asiento contable."]);
        }

        foreach ($detalle as $det) {
            $accion = $det['accion_detalle'];

            switch ($accion) {
                case 'modificacion':
                    $det['descripcion'] = $cabecera['descripcion'];
                    $response_detalle = $this->asientosContablesModel->actualizar_asiento_detalle($det, $cabecera['id_asiento']);

                    if ($response_detalle === false) {
                        $this->dbc->rollBack();
                        return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => "Error al actualizar el detalle del asiento contable."]);
                    }
                    $cuentasRecalcular[] = $det['cuenta_origin'];
                    $cuentasRecalcular[] = $det['id_cuenta_new'];
                    break;
                case 'baja':
                case 'eliminacion':
                    $response_detalle = $this->asientosContablesModel->eliminar_asiento_detalle($det['id_detalle'], $cabecera['id_asiento']);
                    if ($response_detalle === false) {
                        $this->dbc->rollBack();
                        return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => "Error al eliminar el detalle del asiento contable."]);
                    }
                    $cuentasRecalcular[] = $det['cuenta_origin'];
                    break;
                case 'alta':
                    $det['descripcion'] = $cabecera['descripcion'];
                    $response_detalle = $this->asientosContablesModel->insertar_asiento_detalle($cabecera['id_asiento'], $det, $cabecera['fecha_aplicacion_new']);
                    if ($response_detalle === false) {
                        $this->dbc->rollBack();
                        return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => "Error al insertar el detalle del asiento contable."]);
                    }
                    $cuentasRecalcular[] = $det['id_cuenta_new'];
                    break;
                case 'sin_cambios':
                    if ($det['fecha_aplicacion_orig_det'] != $cabecera['fecha_aplicacion_new']) {
                        $response_detalle = $this->asientosContablesModel->actualizar_fecha_asiento_detalle($cabecera['id_asiento'], $det['id_detalle'], $cabecera['fecha_aplicacion_new']);
                        if ($response_detalle === false) {
                            $this->dbc->rollBack();
                            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => "Error al actualizar la fecha del detalle del asiento contable."]);
                        }
                        $cuentasRecalcular[] = $det['cuenta_origin'];
                    }
                    break;
                default:
                    $this->dbc->rollBack();
                    return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => "Acción de detalle no válida: {$accion}"]);
            }
        }

        if ($this->asientosContablesModel->actualizar_descripcion_asiento_detalle($cabecera['id_asiento'], $cabecera['descripcion']) === false) {
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => "Error al actualizar la descripción de los detalles del asiento contable."]);
        }

        // CONTROL DE QUE EL ASIENTO ESTE BALANCEADO Y TENGA DETALLES POR LAS DUDAS (no es necesario porque ya se controla en el front, pero por las dudas de que modifiquen la peticion desde otro lado)
        $validacionBalance = $this->validar_balance_asiento($cabecera['id_asiento']);
        if ($validacionBalance !== true) {
            $this->dbc->rollBack();
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => $validacionBalance]);
        }

        // Recalcular desde la fecha mas antigua entre la original y la nueva para todas las cuentas afectadas
        $fechaRecalculo = min($cabecera['fecha_aplicacion'], $cabecera['fecha_aplicacion_new']);
        foreach (array_unique($cuentasRecalcular) as $idCuenta) {
            if ($this->asientosContablesModel->recalcular_saldo($idCuenta, $fechaRecalculo) === false) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", [], ['error' => "Error al recalcular el saldo de la cuenta contable {$idCuenta}."]);
            }
        }

        $this->dbc->commit();
        return ResponseHelper::sendResponse(true, 200, "Se modificó el asiento contable.", ['id_asiento' => $cabecera['id_asiento']]);
    }

    private function validar_balance_asiento($id_asiento)
    {
        $detallesActualizados = $this->asientosContablesModel->extraer_asiento_detalle($id_asiento);
        if (count($detallesActualizados) === 0) {
            return "El asiento debe tener al menos un detalle.";
        }

        $totalDebe = 0;
        $totalHaber = 0;
        foreach ($detallesActualizados as $det) {
            $totalDebe += (float) $det['debe'];
            $totalHaber += (float) $det['haber'];
        }
        if (round($totalDebe - $totalHaber, 2) != 0) {
            return "El asiento contable debe estar balanceado.";
        }

        return true;
    }
}
