<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Tesoreria\LotesController;

$LotesController = new LotesController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "extraer_lotes":
        $response = $LotesController->extraer_lotes();    
        break;
    case "extraer_lote":
        $response = $LotesController->extraer_lote($datos['id_lote']);    
        break;
    case "autorizar_lote":
        $response = $LotesController->autorizar_lote($datos['id_lote']);    
        break;
    case "generar_lote":
        $response = $LotesController->generar_lote($datos['datos']);    
        break;
    case "eliminar_lote":
        $response = $LotesController->eliminar_lote($datos['id_lote']);    
        break;
}

echo json_encode($response);
