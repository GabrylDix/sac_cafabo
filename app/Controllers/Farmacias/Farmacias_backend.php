<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Farmacias\FarmaciasController;

$FarmaciasController = new FarmaciasController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "nueva_farmacia":
        $response = $FarmaciasController->nueva_farmacia($datos['datos']);
        break;
    case "extraer_farmacias":
        $response = $FarmaciasController->extraer_farmacias();
        break;
    case "extraer_farmacia":
        $response = $FarmaciasController->extraer_farmacia($datos['id_farmacia']);
        break;
    case "habilitar_convenio":
        $response = $FarmaciasController->habilitar_convenio($datos['id_farmacia'], $datos['id_convenio']);
        break;
    case "modificar_farmacia":
        $response = $FarmaciasController->modificar_farmacia($datos['datos']);
        break;
    case "cambiar_estado_farmacia":
        $response = $FarmaciasController->cambiar_estado_farmacia($datos['datos']['id_farmacia'], $datos['datos']['estado']);
        break;
    case "sugerencias_farmacias":
        $response = $FarmaciasController->sugerencias_farmacias($datos['termino']);
        break;
}

echo json_encode($response);
