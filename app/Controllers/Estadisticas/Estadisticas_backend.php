<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Estadisticas\EstadisticasController;

$EstadisticasController = new EstadisticasController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case 'home':
        $response = $EstadisticasController->home();
        break;
}

echo json_encode($response);
