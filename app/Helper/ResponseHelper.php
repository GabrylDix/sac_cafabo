<?php
namespace App\Helper;

class ResponseHelper
{
    /**
     *
     * @param bool        $success     Indica si la operación fue exitosa.
     * @param int         $status      El código de estado HTTP para la respuesta.
     * @param string      $message     Un mensaje descriptivo del resultado de la operación.
     * @param array       $data        Datos opcionales a incluir en la respuesta. Por defecto, un array vacío.
     * @param array       $errors      Errores opcionales a incluir en la respuesta, se casteará a objeto. Por defecto, un array vacío.
     * @param string|null $alertTitle  Título opcional para la alerta. Si es nulo, se establece a 'Éxito' si $success es true, o 'Error' si es false.
     * @param string|null $alertIcon   Icono opcional para la alerta. Si es nulo, se establece a 'success' si $success es true, o 'error' si es false.
     * @return array Un array estructurado que contiene:
     *               - success (bool): El valor de $success.
     *               - status (int): El valor de $status.
     *               - message (string): El valor de $message.
     *               - data (array): El valor de $data.
     *               - errors (object): El valor de $errors convertido a objeto.
     *               - alert (array): Un array con 'title', 'message' (el mismo que el principal) e 'icon' para la alerta.
     */
    public static function sendResponse($success, $status, $message, $data = [], $errors = [], $alertTitle = null, $alertIcon = null){
        
        if ($alertTitle === null) {
            $alertTitle = $success ? 'Éxito' : 'Error';
        }
        if ($alertIcon === null) {
            $alertIcon = $success ? 'success' : 'error';
        }
        return [
            "success" => $success,
            "status"  => $status,
            "message" => $message,
            "data"    => $data,
            "errors"  => (object)$errors,
            "alert"   => [
                "title"   => $alertTitle,
                "message" => $message,
                "icon"    => $alertIcon
            ]
        ];
    }
}
