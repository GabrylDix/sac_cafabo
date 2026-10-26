<?php
namespace App\Controllers\Perfil;

use App\Models\Perfil\PerfilModel;
use App\Models\Usuarios\UsuariosModel;

//HELPERS
use App\Helper\ResponseHelper;

class PerfilController {
    protected $dbc;
    private $perfilModel;

    public function __construct() {
        $this->dbc = $GLOBALS['dbc'];
        $this->perfilModel = new PerfilModel($this->dbc);
    }

    public function extraer_perfil(){
        $perfil = $this->perfilModel->extraer_perfil($_SESSION['auth_data']['id_usuario']);
        return ResponseHelper::sendResponse(true, 200, "Informacion de perfil", $perfil);
    }

    public function modificar_perfil($datos){
        if ($this->perfilModel->modificar_perfil($datos, $_SESSION['auth_data']['id_usuario'])) {
            $usuariosModel = new UsuariosModel($this->dbc);
            $_SESSION['auth_data'] = $usuariosModel->extraer_usuario($_SESSION['auth_data']['id_usuario']);
            return ResponseHelper::sendResponse(true, 200, "Los datos se actualizaron correctamente.", []);
        }else{
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", []);
        }
    }

    public function actualizar_contrasenia($datos){
        if ($this->perfilModel->actualizar_contrasenia($datos['nueva_contrasenia'], $_SESSION['auth_data']['id_usuario'])) {
            return ResponseHelper::sendResponse(true, 200, "La contraseña se actualizó correctamente.", []);
        }else{
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", []);
        }
    }

    public function actualizar_imagen(){
        $id_usuario = $_SESSION['id_usuario'];

        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] != 0) {
            return ResponseHelper::sendResponse(false, 200, "Error al intentar procesar la imagen");
        }

        $archivo = $_FILES['foto'];
        $extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
        $nombre_archivo = 'perfil_' . $id_usuario . '_' . date("Y_m_d_H_i_s") . '.' . $extension;
        $ruta_destino = __DIR__ . '/../../../public/uploads/perfiles/' . $nombre_archivo;
        // $ruta_destino = __DIR__ . '/../../public/uploads/perfiles/' . $nombre_archivo;

        if (!move_uploaded_file($archivo['tmp_name'], $ruta_destino)) {
            return ResponseHelper::sendResponse(false, 200, "Error al intentar guardar la imagen");
        }

        if ($this->perfilModel->actualizar_imagen($nombre_archivo, $_SESSION['auth_data']['id_usuario'])) {
            return ResponseHelper::sendResponse(true, 200, "La foto de perfil se actualizó correctamente");
        }else{
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
        }

    }

}