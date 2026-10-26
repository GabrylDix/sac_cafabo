<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Tesoreria\ClientesController;

$ClientesController = new ClientesController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "nuevo_proveedor":
        $response = $ClientesController->nuevo_proveedor($datos['datos']); 
        break;
    case "modificar_proveedor":
        $response = $ClientesController->modificar_proveedor($datos['datos']); 
        break;
    case "extraer_proveedores":
        $response = $ClientesController->extraer_proveedores(); 
        break;
    case "extraer_proveedor":
        $response = $ClientesController->extraer_proveedor($datos['id_proveedor']); 
        break;
    case "actualizar_estado":
        $response = $ClientesController->actualizar_estado($datos['datos']); 
        break;
}

echo json_encode($response);
