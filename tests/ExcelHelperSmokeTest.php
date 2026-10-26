<?php

require_once __DIR__ . '/../app/Helper/Excel/ExcelHelper.php';

use App\Helper\Excel\ExcelHelper;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xls;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$directory = sys_get_temp_dir() . '/sac-excel-' . bin2hex(random_bytes(8));
if (!mkdir($directory)) {
    throw new RuntimeException('No se pudo crear el directorio temporal.');
}

try {
    foreach (['xls' => Xls::class, 'xlsx' => Xlsx::class] as $extension => $writerClass) {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->fromArray([
            ['id_farmacia', 'nombre_farmacia', 'id_plan', 'cantidad_recetas', 'importe_100_camara', 'importe_os_camara', 'importe_100', 'importe_os', 'bonificacion_os', 'bonificacion_farmacia', 'notas_credito', 'debitos_os', 'creditos_os'],
            ['00042', 'Farmacia Ñ; Centro', 3, 2, 123.45, 23.45, 123.45, 23.45, 0, 0, 0, 0, 0],
            array_fill(0, 13, null),
            ['00043', 'Farmacia Sur', 4, 1, 200, 100, 200, 100, 0, 0, 0, 0, 0],
        ], null, 'A1', true);

        $archivoExcel = $directory . '/presentacion.' . $extension;
        (new $writerClass($spreadsheet))->save($archivoExcel);
        $spreadsheet->disconnectWorksheets();

        $archivoCsv = ExcelHelper::convertir_excel_csv($archivoExcel, $directory . '/salida-' . $extension);
        $handle = fopen($archivoCsv, 'rb');
        $rows = [];
        while (($row = fgetcsv($handle, 0, ';', '"', '')) !== false) {
            $rows[] = $row;
        }
        fclose($handle);

        if (count($rows) !== 3 || count($rows[0]) !== 13 || count($rows[1]) !== 13 || count($rows[2]) !== 13
            || $rows[0][0] !== 'id_farmacia' || $rows[1][0] !== '00042'
            || $rows[1][1] !== 'Farmacia Ñ; Centro' || $rows[1][4] !== '123.45'
            || $rows[1][8] !== '0'
            || $rows[2][0] !== '00043') {
            throw new RuntimeException("Conversión incorrecta para .$extension: " . json_encode($rows));
        }

        echo "OK: .$extension a CSV (13 columnas, encabezado, filas vacías y caracteres especiales)\n";
    }
} finally {
    foreach (glob($directory . '/*') as $file) {
        unlink($file);
    }
    rmdir($directory);
}
