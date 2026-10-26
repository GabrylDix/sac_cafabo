<?php
namespace App\Controllers\Auth;

//MODELOS
use App\Models\Auth\AuthModel;
use App\Models\Log\LogModel;

//HELPERS
use App\Helper\ResponseHelper;


class AuthController{
    protected $dbc;
    private $authModel;

    function __construct(){
        $this->dbc = $GLOBALS['dbc'];
        $this->authModel = new AuthModel($this->dbc);
    }

    public function iniciar_sesion($username, $password){
        $usuarioDatos = $this->authModel->verificar_usuario($username, $password);
        $logModel = new LogModel($this->dbc);

        if (!empty($usuarioDatos)) {
            $_SESSION['logged'] = true;
            $_SESSION['auth_data'] = $usuarioDatos;

            $success = true;
            $message = "Se inició sesion correctamente.";
            $error = false;
        }else{
            $_SESSION['logged'] = false;
            $success = false;
            $message = "Error.";
            $error = true;
        }

        $logModel->login([
            'id_usuario' => $usuarioDatos['id_usuario'] ?? null,
            'username' => $username,
            'resultado' => !empty($usuarioDatos) ? 'OK' : 'FAIL'
        ]);

        $respuesta = ["success" => $success,
                "message" => $message,
                "data" => $usuarioDatos,
                "errors" => $error,
                "alert" => false];

        return $respuesta;
    }

}
