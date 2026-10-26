<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Contabilidad\AsientosContablesController;

$AsientosContablesController = new AsientosContablesController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "insertar_asiento_contable":
        $response = $AsientosContablesController->insertar_asiento_contable($datos['datos']);
        break;
    case "modificar_asiento_contable":
        $response = $AsientosContablesController->modificar_asiento_contable($datos['datos']);
        break;
    case "extraer_asientos_contables":
        $response = $AsientosContablesController->extraer_asientos_contables();
        break;
    case "extraer_asiento_contable":
        $response = $AsientosContablesController->extraer_asiento_contable($datos['id_asiento']);
        break;
    case "revertir_asiento_contable":
        $response = $AsientosContablesController->revertir_asiento_contable($datos['id_asiento']);
        break;
}

echo json_encode($response);
