<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Bancos\BancosController;

$BancosController = new BancosController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    // case "funcion":
    //     $response = $BancosController->funcion();
    //     break;
}

echo json_encode($response);
