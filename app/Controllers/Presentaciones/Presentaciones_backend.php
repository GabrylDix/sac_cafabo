<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Presentaciones\PresentacionesController;

$PresentacionesController = new PresentacionesController();
$datos = $_REQUEST;

// if (empty($_POST['datos'])) {
//     $datos = $_REQUEST;
// } else {
//     $datos = json_decode($_POST['datos'], true);
// }

switch ($datos['backend']) {
    case 'importar_presentacion':
        $response = $PresentacionesController->importar_presentacion($datos);
        break;
    case 'extraer_presentaciones':
        $response = $PresentacionesController->extraer_presentaciones($datos['datos'] ?? []);
        break;
    case 'extraer_presentaciones_liquidar':
        $response = $PresentacionesController->extraer_presentaciones_liquidar($datos['id_convenio']);
        break;
    case 'extraer_presentacion':
        $response = $PresentacionesController->extraer_presentacion($datos['id_presentacion']);
        break;
    case 'extraer_recibos_presentacion':
        $response = $PresentacionesController->extraer_recibos_presentacion($datos['id_presentacion']);
        break;
    case 'extraer_presentacion_farmacia':
        $response = $PresentacionesController->extraer_presentacion_farmacia($datos['id_presentacion'], $datos['id_farmacia']);
        break;
    case 'eliminar_presentacion':
        $response = $PresentacionesController->eliminar_presentacion($datos['id_presentacion']);
        break;
    case 'actualizar_estado':
        $response = $PresentacionesController->actualizar_estado($datos['id_presentacion'], $datos['estado']);
        break;
}

echo json_encode($response);
