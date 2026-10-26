<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Conceptos\ConceptosController;

$ConceptosController = new ConceptosController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case 'nuevo_concepto':
        $response = $ConceptosController->nuevo_concepto($datos['datos']);
        break;
    case 'modificar_concepto':
        $response = $ConceptosController->modificar_concepto($datos['datos']);
        break;
    case 'extraer_conceptos':
        $response = $ConceptosController->extraer_conceptos();
        break;
    case 'extraer_concepto':
        $response = $ConceptosController->extraer_concepto($datos['id_concepto']);
        break;
    case 'actualizar_estado':
        $response = $ConceptosController->actualizar_estado($datos['datos']);
        break;
    case 'sugerencias_conceptos':
        $response = $ConceptosController->sugerencias_conceptos($datos['termino']);
        break;
}

echo json_encode($response);
