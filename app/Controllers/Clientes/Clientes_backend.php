<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Clientes\ClientesController;

$ClientesController = new ClientesController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case 'nuevo_cliente':
        $response = $ClientesController->nuevo_cliente($datos['datos']);
        break;
    case 'modificar_cliente':
        $response = $ClientesController->modificar_cliente($datos['datos']);
        break;
    case 'extraer_clientes':
        $response = $ClientesController->extraer_clientes();
        break;
    case 'extraer_cliente':
        $response = $ClientesController->extraer_cliente($datos['id_cliente']);
        break;
    case 'actualizar_estado':
        $response = $ClientesController->actualizar_estado($datos['datos']);
        break;
}

echo json_encode($response);
