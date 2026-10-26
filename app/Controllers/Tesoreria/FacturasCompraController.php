<?php

namespace App\Controllers\Tesoreria;

use App\Models\Tesoreria\FacturasCompraModel;

//CONTROLLERS
use App\Controllers\Contabilidad\AsientosContablesController;

//HELPERS
use App\Helper\ResponseHelper;

class FacturasCompraController
{
    protected $dbc;
    private $FacturaCompraModel;

    public function __construct()
    {
        $this->dbc = $GLOBALS['dbc'];
        $this->FacturaCompraModel = new FacturasCompraModel($this->dbc);
    }

    public function extraer_facturas_compras($estado = null)
    {
        $facturas_compras = $this->FacturaCompraModel->extraer_facturas_compras($estado);
        return ResponseHelper::sendResponse(true, 200, "Listado de facturas de compra", $facturas_compras);
    }

    private function resolverMensajeDuplicados(array $duplicados)
    {
        if (!empty($duplicados['numero_factura']) && !empty($duplicados['cai'])) {
            return "Ya existe una factura de compra para ese proveedor con el mismo número y CAI.";
        }

        if (!empty($duplicados['numero_factura'])) {
            return "Ya existe una factura de compra para ese proveedor con el mismo número.";
        }

        return "Ya existe una factura de compra para ese proveedor con el mismo CAI.";
    }

    public function nueva_factura_compra($datos)
    {
        try {
            $this->dbc->beginTransaction();

            $cabecera = $datos['cabecera'];
            if (!empty($datos['datos_proveedor']) && is_array($datos['datos_proveedor'])) {
                $cabecera = array_merge($cabecera, $datos['datos_proveedor']);
            }

            $duplicados = $this->FacturaCompraModel->validar_disponibilidad_factura_compra($cabecera);

            if (!empty($duplicados)) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, $this->resolverMensajeDuplicados($duplicados), null, $duplicados);
            }

            $idFacturaCompra = $this->FacturaCompraModel->nueva_factura_compra_cab($cabecera);

            if (!$idFacturaCompra) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al registrar la cabecera de la factura.", null, []);
            }

            $altaDetalle = $this->FacturaCompraModel->nueva_factura_compra_detalle($idFacturaCompra, $datos['detalle']);

            if (!$altaDetalle) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al registrar el detalle de la factura.", null, []);
            }

            $this->dbc->commit();
            return ResponseHelper::sendResponse(true, 200, "La factura de compra se creó con éxito. Nro asignado: {$idFacturaCompra}", null, []);
        } catch (\Throwable $e) {
            if ($this->dbc->inTransaction()) {
                $this->dbc->rollBack();
            }

            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, []);
        }
    }

    public function extraer_factura_compra($idFacturaCompra)
    {
        $facturaCompra = $this->FacturaCompraModel->extraer_factura_compra($idFacturaCompra);

        if ($facturaCompra) {
            return ResponseHelper::sendResponse(true, 200, "Detalle de factura de compra", $facturaCompra);
        } else {
            return ResponseHelper::sendResponse(false, 200, "No se encontró la factura de compra solicitada.", null, []);
        }
    }

    public function validar_disponibilidad_factura_compra($datos)
    {
        $cabecera = $datos['cabecera'] ?? [];
        $idFacturaExcluir = isset($datos['id_factura']) ? (int) $datos['id_factura'] : null;
        $duplicados = $this->FacturaCompraModel->validar_disponibilidad_factura_compra($cabecera, $idFacturaExcluir);

        if (empty($duplicados)) {
            return ResponseHelper::sendResponse(true, 200, "La factura de compra está disponible para registrarse.", null, []);
        }

        return ResponseHelper::sendResponse(false, 200, $this->resolverMensajeDuplicados($duplicados), null, $duplicados);
    }

    public function modificar_factura_compra($datos)
    {
        try {
            $this->dbc->beginTransaction();

            $idFacturaCompra = (int) ($datos['id_factura'] ?? 0);
            $cabecera = $datos['cabecera'] ?? [];

            if (!empty($datos['datos_proveedor']) && is_array($datos['datos_proveedor'])) {
                $cabecera = array_merge($cabecera, $datos['datos_proveedor']);
            }

            $duplicados = $this->FacturaCompraModel->validar_disponibilidad_factura_compra($cabecera, $idFacturaCompra);

            if (!empty($duplicados)) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, $this->resolverMensajeDuplicados($duplicados), null, $duplicados);
            }

            $modificoCabecera = $this->FacturaCompraModel->modificar_factura_compra_cab($idFacturaCompra, $cabecera);

            if (!$modificoCabecera) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al modificar la cabecera de la factura.", null, []);
            }

            $this->dbc->commit();

            return ResponseHelper::sendResponse(true, 200, "La factura de compra se actualizó correctamente.", null, []);
        } catch (\Throwable $e) {
            if ($this->dbc->inTransaction()) {
                $this->dbc->rollBack();
            }

            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, []);
        }
    }

    public function agregar_detalle_factura_compra($datos)
    {
        try {
            $this->dbc->beginTransaction();
            $idFacturaCompra = (int) ($datos['id_factura'] ?? 0);

            $agregoDetalle = $this->FacturaCompraModel->agregar_detalle_factura_compra($idFacturaCompra, $datos['detalle'] ?? []);

            if (!$agregoDetalle) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al agregar el detalle de la factura.", null, []);
            }

            $recalculoTotal = $this->FacturaCompraModel->recalcular_total_factura($idFacturaCompra);

            if (!$recalculoTotal) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al recalcular el total de la factura.", null, []);
            }

            $this->dbc->commit();
            return ResponseHelper::sendResponse(true, 200, "El detalle se agregó correctamente.", null, []);
        } catch (\Throwable $e) {
            if ($this->dbc->inTransaction()) {
                $this->dbc->rollBack();
            }

            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al agregar el detalle de la factura.", null, []);
        }
    }

    public function modificar_detalle_factura_compra($datos)
    {
        try {
            $this->dbc->beginTransaction();
            $idFacturaCompra = (int) ($datos['id_factura'] ?? 0);

            $modificoDetalle = $this->FacturaCompraModel->modificar_detalle_factura_compra($idFacturaCompra, $datos['detalle'] ?? []);

            if (!$modificoDetalle) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al modificar el detalle de la factura.", null, []);
            }

            $recalculoTotal = $this->FacturaCompraModel->recalcular_total_factura($idFacturaCompra);

            if (!$recalculoTotal) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al recalcular el total de la factura.", null, []);
            }

            $this->dbc->commit();
            return ResponseHelper::sendResponse(true, 200, "El detalle se actualizó correctamente.", null, []);
        } catch (\Throwable $e) {
            if ($this->dbc->inTransaction()) {
                $this->dbc->rollBack();
            }

            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al modificar el detalle de la factura.", null, []);
        }
    }

    public function eliminar_detalle_factura_compra($datos)
    {
        try {
            $this->dbc->beginTransaction();
            $idFacturaCompra = (int) ($datos['id_factura'] ?? 0);
            $idDetalle = (int) ($datos['id_detalle'] ?? 0);

            $eliminoDetalle = $this->FacturaCompraModel->eliminar_detalle_factura_compra($idFacturaCompra, $idDetalle);

            if (!$eliminoDetalle) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al eliminar el detalle de la factura.", null, []);
            }

            $recalculoTotal = $this->FacturaCompraModel->recalcular_total_factura($idFacturaCompra);

            if (!$recalculoTotal) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al recalcular el total de la factura.", null, []);
            }

            $this->dbc->commit();
            return ResponseHelper::sendResponse(true, 200, "El detalle se eliminó correctamente.", null, []);
        } catch (\Throwable $e) {
            if ($this->dbc->inTransaction()) {
                $this->dbc->rollBack();
            }

            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al eliminar el detalle de la factura.", null, []);
        }
    }


    public function confirmar_factura_compra($idFacturaCompra)
    {
        try {
            $asientosController = new AsientosContablesController();

            $this->dbc->beginTransaction();
            $facturaCompra = $this->FacturaCompraModel->confirmar_factura_compra($idFacturaCompra);
            if (!$facturaCompra) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "No se pudo confirmar la factura de compra.", null, []);
            }

            $facturaCompleta = $this->FacturaCompraModel->extraer_factura_compra($idFacturaCompra);
            if (!$facturaCompleta) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "No se pudo obtener la factura de compra confirmada.", null, []);
            }

            $payloadAsiento = $this->generar_payload_asiento_contable($idFacturaCompra, $facturaCompleta);

            $respuesta = $asientosController->insertar_asiento_contable($payloadAsiento);

            if (!$payloadAsiento) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "No se pudo generar el payload del asiento contable para la factura de compra.", null, []);
            }

            $relacionar_asiento = $this->FacturaCompraModel->relacionar_asiento_contable($idFacturaCompra, $respuesta['data']['id_asiento'] ?? null);

            if (!$relacionar_asiento) {
                $this->dbc->rollBack();
                return ResponseHelper::sendResponse(false, 200, "No se pudo relacionar el asiento contable con la factura de compra.", null, []);
            }

            $this->dbc->commit();
            return ResponseHelper::sendResponse(true, 200, "Factura de compra confirmada.", [
                'id_factura' => (int) $idFacturaCompra,
                'payload_asiento' => $payloadAsiento,
            ]);
        } catch (\Throwable $e) {
            if ($this->dbc->inTransaction()) {
                $this->dbc->rollBack();
            }

            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al eliminar el detalle de la factura.", null, []);
        }
    }

    public function eliminar_factura_compra($idFacturaCompra, $estado)
    {
        try {
            $factura = $this->FacturaCompraModel->extraer_factura_compra($idFacturaCompra);

            if (!empty($factura['cabecera']['id_asiento'])) {
                $asientosContablesController = new AsientosContablesController();
                $respuestaRevertirAsiento = $asientosContablesController->revertir_asiento_contable(
                    $factura['cabecera']['id_asiento']
                );

                if (!$respuestaRevertirAsiento) {
                    return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al revertir el asiento contable asociado a la factura de compra.", null, []);
                }

                $this->dbc->beginTransaction();
                $eliminoFactura = $this->FacturaCompraModel->eliminar_factura_compra($idFacturaCompra, 'AN');

                if (!$eliminoFactura) {
                    $this->dbc->rollBack();
                    return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al anular la factura de compra.", null, []);
                }

                $this->dbc->commit();
                return ResponseHelper::sendResponse(true, 200, "La factura de compra se anuló correctamente.", null, []);
            } else {
                $this->dbc->beginTransaction();
                $eliminoFactura = $this->FacturaCompraModel->eliminar_factura_compra($idFacturaCompra, 'E');

                if (!$eliminoFactura) {
                    $this->dbc->rollBack();
                    return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al eliminar la factura de compra.", null, []);
                }

                $this->dbc->commit();
                return ResponseHelper::sendResponse(true, 200, "La factura de compra se eliminó correctamente.", null, []);
            }
        } catch (\Throwable $e) {
            if ($this->dbc->inTransaction()) {
                $this->dbc->rollBack();
            }

            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al eliminar la factura de compra.", null, []);
        }
    }

    private function generar_payload_asiento_contable($idFacturaCompra, array $facturaCompra)
    {
        $cabeceraFactura = $facturaCompra['cabecera'];
        $detalleFactura = $facturaCompra['detalle'];
        $totalFactura = round((float) ($cabeceraFactura['total'] ?? 0), 2);
        $idCuentaProveedor = (int) ($cabeceraFactura['cuenta_contable_proveedor'] ?? 0);

        $descripcion = sprintf(
            'Factura compra %s - %s - %s %s',
            $idFacturaCompra,
            trim((string) ($cabeceraFactura['proveedor'] ?? '')),
            trim((string) ($cabeceraFactura['tipo_factura'] ?? '')),
            trim((string) ($cabeceraFactura['numero_factura'] ?? ''))
        );

        $payload = [
            'cabecera' => [
                'ejercicio' => date('Y', strtotime($cabeceraFactura['fecha'])),
                'fecha_aplicacion' => $cabeceraFactura['fecha'],
                'tipo_origen' => 'FCP',
                'id_origen' => (int) $idFacturaCompra,
                'descripcion' => trim(preg_replace('/\s+/', ' ', $descripcion)),
                'nota' => !empty($cabeceraFactura['observaciones'])
                    ? $cabeceraFactura['observaciones']
                    : trim(preg_replace('/\s+/', ' ', $descripcion)),
            ],
            'detalle' => [],
        ];

        $movimientosAgrupados = [];
        $totalDebe = 0;

        foreach ($detalleFactura as $item) {
            $idCuentaConcepto = (int) ($item['cuenta_contable'] ?? 0);
            $importeLinea = round((float) ($item['total_iva'] ?? 0), 2);

            // Si la cuenta contable del concepto es inválida o el importe es cero, se omite el registro
            if ($idCuentaConcepto <= 0) {
                return false;
            }

            if ($importeLinea <= 0) {
                continue;
            }

            // Agrupar los movimientos por cuenta contable
            if (!isset($movimientosAgrupados[$idCuentaConcepto])) {
                $movimientosAgrupados[$idCuentaConcepto] = [
                    'id_cuenta' => $idCuentaConcepto,
                    'debe' => 0,
                    'haber' => 0,
                    'descripcion' => $descripcion
                ];
            }

            $movimientosAgrupados[$idCuentaConcepto]['debe'] += $importeLinea;
            $totalDebe += $importeLinea;
        }

        $totalDebe = round($totalDebe, 2);

        if ($totalDebe <= 0 || round($totalDebe, 2) !== $totalFactura) {
            return false;
        }

        foreach ($movimientosAgrupados as $movimiento) {
            $payload['detalle'][] = [
                'id_cuenta' => $movimiento['id_cuenta'],
                'debe' => round($movimiento['debe'], 2),
                'haber' => 0,
                'descripcion' => $movimiento['descripcion']
            ];
        }

        $payload['detalle'][] = [
            'id_cuenta' => $idCuentaProveedor,
            'debe' => 0,
            'haber' => $totalFactura,
            'descripcion' => $descripcion
        ];

        return $payload;
    }
}
