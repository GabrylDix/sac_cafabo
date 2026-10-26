<?php
require __DIR__ . '/../../../autoload.php';

use App\Controllers\Tesoreria\CuentasBancariasController;

$CuentasBancariasController = new CuentasBancariasController();
$datos = $_REQUEST;

switch ($datos['backend']) {
    case 'nueva_cuenta_bancaria':
        $response = $CuentasBancariasController->nueva_cuenta_bancaria($datos['datos']); 
        break;
    case 'modificar_cuenta_bancaria':
        $response = $CuentasBancariasController->modificar_cuenta_bancaria($datos['datos']); 
        break;
    case 'extraer_cuentas_bancarias':
        $response = $CuentasBancariasController->extraer_cuentas_bancarias(); 
        break;
    case 'extraer_cuenta_bancaria':
        $response = $CuentasBancariasController->extraer_cuenta_bancaria($datos['id_cuenta_bancaria']); 
        break;
    case 'actualizar_estado':
        $response = $CuentasBancariasController->actualizar_estado($datos['datos']); 
        break;
    case 'extraer_movimientos':
        $response = $CuentasBancariasController->extraer_movimientos($datos['datos']); 
        break;
}

echo json_encode($response);
