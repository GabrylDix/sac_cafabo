<?php

require __DIR__ . '/../../../autoload.php';

use App\Controllers\Auth\AuthController;

$AuthController = new AuthController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    //PARA BUSQUEDA LISTADO Y MODIFICACIONES DE EVENTO
    case 'iniciar_sesion':
        $response = $AuthController->iniciar_sesion($datos["username"], $datos['password']);
        break;
}

echo json_encode($response);
