<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Perfil\PerfilController;

$PerfilController = new PerfilController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "extraer_perfil":
        $response = $PerfilController->extraer_perfil(); 
        break;
    case "modificar_perfil":
        $response = $PerfilController->modificar_perfil($datos['datos']); 
        break;
    case "actualizar_contrasenia":
        $response = $PerfilController->actualizar_contrasenia($datos['datos']); 
        break;
    case "actualizar_imagen":
        $response = $PerfilController->actualizar_imagen(); 
        break;
}

echo json_encode($response);
