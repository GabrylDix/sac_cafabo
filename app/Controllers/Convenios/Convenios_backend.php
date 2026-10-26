<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Convenios\ConveniosController;

$ConveniosController = new ConveniosController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "nuevo_convenio":
        $response = $ConveniosController->nuevo_convenio($datos['datos'], $datos['planes']);
        break;
    case "extraer_convenios":
        $response = $ConveniosController->extraer_convenios();
        break;
    case "extraer_convenio":
        $response = $ConveniosController->extraer_convenio($datos['id_convenio']);
        break;
    case "modificar_convenio":
        $response = $ConveniosController->modificar_convenio($datos['datos']);
        break;
    case "cambiar_estado_convenio":
        $response = $ConveniosController->cambiar_estado_convenio($datos['datos']['id_convenio'], $datos['datos']['estado']);
        break;
    case "nuevo_plan":
        $response = $ConveniosController->nuevo_plan($datos['datos']);
        break;
    case "modificar_plan":
        $response = $ConveniosController->modificar_plan($datos['datos']);
        break;
    case "extraer_planes":
        $response = $ConveniosController->extraer_planes($datos['id_convenio']);
        break;
    case "sugerencias_convenios":
        $response = $ConveniosController->sugerencias_convenios($datos['termino']);
        break;
}

echo json_encode($response);
