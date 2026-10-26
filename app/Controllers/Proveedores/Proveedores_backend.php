<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Proveedores\ProveedoresController;

$ProveedoresController = new ProveedoresController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "nuevo_proveedor":
        $response = $ProveedoresController->nuevo_proveedor($datos['datos']); 
        break;
    case "modificar_proveedor":
        $response = $ProveedoresController->modificar_proveedor($datos['datos']); 
        break;
    case "extraer_proveedores":
        $response = $ProveedoresController->extraer_proveedores(); 
        break;
    case "extraer_proveedor":
        $response = $ProveedoresController->extraer_proveedor($datos['id_proveedor']); 
        break;
    case "actualizar_estado":
        $response = $ProveedoresController->actualizar_estado($datos['datos']); 
        break;
}

echo json_encode($response);
