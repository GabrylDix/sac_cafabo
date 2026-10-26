<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Liquidaciones\LiquidacionesController;

$LiquidacionesController = new LiquidacionesController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case "extraer_liquidaciones":
        $response = $LiquidacionesController->extraer_liquidaciones($datos['estado']);    
        break;
    case "extraer_liquidacion":
        $response = $LiquidacionesController->extraer_liquidacion($datos['id_liquidacion']);
        break;
    case "liquidar_presentaciones":
        $response = $LiquidacionesController->liquidar_presentaciones($datos); 
        break;
    case "eliminar_liquidacion":
        $response = $LiquidacionesController->eliminar_liquidacion($datos['id_liquidacion']); 
        break;
    case "confirmar_liquidacion":
        $response = $LiquidacionesController->confirmar_liquidacion($datos['id_liquidacion']); 
        break;
}

echo json_encode($response);
