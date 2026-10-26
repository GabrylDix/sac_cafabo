<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Usuarios\UsuariosController;

$UsuariosController = new UsuariosController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "nuevo_usuario":
        $response = $UsuariosController->nuevo_usuario($datos['datos']); 
        break;
    case "modificar_usuario":
        $response = $UsuariosController->modificar_usuario($datos['datos']); 
        break;
    case "extraer_usuarios":
        $response = $UsuariosController->extraer_usuarios(); 
        break;
    case "extraer_usuario":
        $response = $UsuariosController->extraer_usuario($datos['id_usuario']); 
        break;
    case "actualizar_estado":
        $response = $UsuariosController->actualizar_estado($datos['datos']); 
        break;
    case "extraer_roles":
        $response = $UsuariosController->extraer_roles(); 
        break;
}

echo json_encode($response);
