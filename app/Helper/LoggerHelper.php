<?php
namespace App\Helper;

class LoggerHelper{

    function __construct(){

    }

    public static function registrar_log($mensaje, $directorio, $sql_error = null){
        // Obtén la fecha para crear los directorios
        $anio = date('Y');
        $mes = date('m');
        $dia = date('d');
        $ruta_directorio = "/import/sac/log/{$directorio}/{$anio}/{$mes}/";

        // Crea el directorio si no existe, con permisos 0777 para permitir escritura
        if (!file_exists($ruta_directorio)) {
            if (!mkdir($ruta_directorio, 0777, true)) {
                die("Error: No se pudo crear el directorio {$ruta_directorio}");
            }
        }
        chmod($ruta_directorio, 0777);

        $archivo = "{$dia}_{$mes}_{$anio}.log";
        $ruta_directorio .= $archivo;

        $msj = date('[Y-m-d H:i:s]') . " - [USUARIO]: ".$_SESSION['auth_data']['username'] . " - " .$mensaje. " - ".$sql_error . "\n";

        error_log($msj, 3, $ruta_directorio);
    }

}
