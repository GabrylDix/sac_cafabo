<?php
namespace App\Helper\Excel;

require_once __DIR__ . '/../../../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

class ExcelHelper {

    public static function convertir_excel_csv($archivo_excel, $outfile){
        //Devuelve que tipo de version de excel es.
        $extension = IOFactory::identify($archivo_excel);
         //Crea un objeto con el tipo de version del excel.
        $objReader = IOFactory::createReader($extension);
        $objReader->setReadDataOnly(false);
        $objPHPExcel = $objReader->load($archivo_excel);
        //Crea un archivo .CSV
        $writer = IOFactory::createWriter($objPHPExcel, 'Csv');
        $writer->setDelimiter(";"); //Asigna el separador.
        $writer->setEnclosure('"'); //
        $archivo_csv = $outfile .".csv";
        $writer->save($archivo_csv);
        
        $cleanLines = [];
        $lines = file($archivo_csv, FILE_IGNORE_NEW_LINES);

        foreach ($lines as $line) {
            // Quitar espacios al inicio/fin
            $trimmed = trim($line);

            // El escritor CSV puede entrecomillar celdas vacías ("";"").
            $columns = str_getcsv($trimmed, ';', '"', '');
            if ($trimmed === '' || !array_filter($columns, static fn($value) => trim($value) !== '')) {
                continue;
            }

            $cleanLines[] = $trimmed;
        }

        file_put_contents($archivo_csv, implode(PHP_EOL, $cleanLines));

        $objPHPExcel->disconnectWorksheets();
        
        return $archivo_csv;
    } 

}
