<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Contabilidad\CuentasContablesController;

$CuentasContablesController = new CuentasContablesController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "nueva_cuenta_contable":
        $response = $CuentasContablesController->nueva_cuenta_contable($datos['datos']);
        break;
    case "extraer_cuentas_contables":
        $response = $CuentasContablesController->extraer_cuentas_contables();
        break;
    case "extraer_cuenta_contable":
        $response = $CuentasContablesController->extraer_cuenta_contable($datos['id_cuenta_contable']);
        break;
    case "modificar_cuenta_contable":
        $response = $CuentasContablesController->modificar_cuenta_contable($datos['datos']);
        break;
    case "cambiar_estado_cuenta_contable":
        $response = $CuentasContablesController->cambiar_estado_cuenta_contable($datos['datos']['id_cuenta'], $datos['datos']['estado']);
        break;
    case "sugerencias_cuentas_contables":
        $response = $CuentasContablesController->sugerencias_cuentas_contables($datos['termino']);
        break;
    case "sugerencias_cuentas_contables_con_minimo":
        $response = $CuentasContablesController->sugerencias_cuentas_contables_con_minimo($datos['termino'], $datos['minimo']);
        break;
}

echo json_encode($response);
