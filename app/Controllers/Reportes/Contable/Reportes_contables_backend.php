<?php
require __DIR__ . '/../../../../autoload.php';

use App\Controllers\Reportes\Contable\ReportesContablesController;

$ReportesContablesController = new ReportesContablesController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "extraer_libro_mayor":
        $response = $ReportesContablesController->extraer_libro_mayor($datos['datos']);
        break;
}

echo json_encode($response);
