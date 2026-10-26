<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Tesoreria\FacturasCompraController;

$FacturasCompraController = new FacturasCompraController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "extraer_facturas_compras":
        $response = $FacturasCompraController->extraer_facturas_compras($datos['estado'] ?? null);
        break;
    case "nueva_factura_compra":
        $response = $FacturasCompraController->nueva_factura_compra($datos['datos']);
        break;
    case "validar_disponibilidad_factura_compra":
        $response = $FacturasCompraController->validar_disponibilidad_factura_compra($datos['datos']);
        break;
    case "modificar_factura_compra":
        $response = $FacturasCompraController->modificar_factura_compra($datos['datos']);
        break;
    case "agregar_detalle_factura_compra":
        $response = $FacturasCompraController->agregar_detalle_factura_compra($datos['datos']);
        break;
    case "modificar_detalle_factura_compra":
        $response = $FacturasCompraController->modificar_detalle_factura_compra($datos['datos']);
        break;
    case "eliminar_detalle_factura_compra":
        $response = $FacturasCompraController->eliminar_detalle_factura_compra($datos['datos']);
        break;
    case "extraer_factura_compra":
        $response = $FacturasCompraController->extraer_factura_compra($datos['id_factura_compra']);
        break;
    case "confirmar_factura_compra":
        $response = $FacturasCompraController->confirmar_factura_compra($datos['id_factura_compra']);
        break;
    case "eliminar_factura_compra":
        $response = $FacturasCompraController->eliminar_factura_compra($datos['id_factura_compra'], $datos['estado']);
        break;
        // case "modificar_factura_compra":
        //     $response = $FacturasCompraController->modificar_factura_compra($datos['datos']);
        //     break;
        // case "cambiar_estado_factura_compra":
        //     $response = $FacturasCompraController->cambiar_estado_factura_compra($datos['datos']['id_cuenta'], $datos['datos']['estado']);
        //     break;
}

echo json_encode($response);
