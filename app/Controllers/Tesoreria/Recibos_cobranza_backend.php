<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Tesoreria\RecibosCobranzaController;

$ReciboCobranzaController = new RecibosCobranzaController();
$datos = $_REQUEST;
// print_r($datos);exit;
switch ($datos['backend']) {
	case 'nuevo_recibo_cobranza':
		$response = $ReciboCobranzaController->nuevo_recibo_cobranza($datos['datos']);
		break;
	case 'extraer_recibos':
		$response = $ReciboCobranzaController->extraer_recibos();
		break;
	case 'extraer_recibo':
		$response = $ReciboCobranzaController->extraer_recibo($datos['id_recibo']);
		break;
	case 'eliminar_recibo':
		$response = $ReciboCobranzaController->eliminar_recibo($datos['id_recibo']);
		break;
}

echo json_encode($response);
