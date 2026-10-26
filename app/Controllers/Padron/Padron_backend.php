<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Padron\PadronController;

$PadronController = new PadronController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "provincias":
        $response = $PadronController->provincias(); 
        break;
    case "localidades":
        $response = $PadronController->localidades($datos['patente']); 
        break;
    case "condiciones_iva":
        $response = $PadronController->condiciones_iva(); 
        break;
    case "extraer_bancos":
        $response = $PadronController->extraer_bancos(); 
        break;
}

echo json_encode($response);
