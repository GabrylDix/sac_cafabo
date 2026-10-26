<?php
namespace App\Helper;

class ArchivoHelper{

    public static function crear_directorio($sub_directorios){
        array_push($sub_directorios, date("Y"), date("m"));

        $dictorio_base = '/import/sac_cafabo';
        $dir = rtrim($dictorio_base, DIRECTORY_SEPARATOR);

        foreach ($sub_directorios as $carpeta) {
            $dir .= DIRECTORY_SEPARATOR . $carpeta;
        }

        // crear recursivamente con permisos razonables
        if (!is_dir($dir)) {
            if (!mkdir($dir, 0755, true)) {
                return false;
            }
        }

        return $dir;
    }

    public static function guardar_archivo($archivo, $destino){
        if (!isset($archivo['tmp_name']) || !is_uploaded_file($archivo['tmp_name'])) {
            return false;
        }

        $nombre_limpio = self::sanitizeFilename($archivo['name']);
        $nombre = date('YmdHis') . '_' . $nombre_limpio;
        $ubicacion_csv = rtrim($destino, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $nombre;

        if (move_uploaded_file($archivo['tmp_name'], $ubicacion_csv)) {
            return $ubicacion_csv;
        }

        return false;
    }

    public static function sanitizeFilename($nombre_archivo){
        // quitar path, dejar solo nombre
        $nombre_archivo = pathinfo($nombre_archivo, PATHINFO_BASENAME);
        // reemplazar espacios y caracteres no permitidos
        $nombre_archivo = preg_replace('/[^A-Za-z0-9\-\._]/', '_', $nombre_archivo);
        return $nombre_archivo;
    }

}
