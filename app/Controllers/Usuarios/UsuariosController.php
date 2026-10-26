<?php
namespace App\Controllers\Usuarios;

//MODELOS
use App\Models\Usuarios\UsuariosModel;

//HELPERS
use App\Helper\ResponseHelper;


class UsuariosController{
    protected $dbc;
    private $usuariosModel;

    function __construct(){
        $this->dbc = $GLOBALS['dbc'];
        $this->usuariosModel = new UsuariosModel($this->dbc);
    }

    /**
     * FUNCION PARA GENERAR UN NUEVO USUARIO
     */
    public function nuevo_usuario($datos){
        if ($this->usuariosModel->verificar_username($datos['username'])) {
            if ($this->usuariosModel->nuevo_usuario($datos)) {
                $response = ResponseHelper::sendResponse(true, 200, "El usuario se genero correctamente", null, [], "Éxito", "success");
            }else{
                $response = ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, [], "Error", "error");
            }
        }else{
            $response = ResponseHelper::sendResponse(false, 200, "El nombre de usuario ya esta en uso.", null, [], "Error", "error");
        }

        return $response;
    }

    /**
     * FUNCION PARA EXTRAER USUARIOS
     */
    public function extraer_usuarios(){
        $usuarios =  $this->usuariosModel->extraer_usuarios();

        $response = ResponseHelper::sendResponse(true, 200, "Lista de usuarios.", $usuarios, [], "Éxito", "success");

        return $response;
    }

    /**
     * FUNCION PARA EXTRAER LOS DATOS DE UN USUARIO
     */
    public function extraer_usuario($id_usuario){
        $usuario =  $this->usuariosModel->extraer_usuario($id_usuario);

        $response = ResponseHelper::sendResponse(true, 200, "Datos del usuario.", $usuario, [], "Éxito", "success");

        return $response;
    }

    /**
     * FUNCION PARA MODIFICAR UN USUARIO
     */
    public function modificar_usuario($datos){
        if ($this->usuariosModel->modificar_usuario($datos)) {
            $response = ResponseHelper::sendResponse(true, 200, "El usuario se genero correctamente", null, [], "Éxito", "success");
        }else{
            $response = ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, [], "Error", "error");
        }

        return $response;
    }

    /**
     * FUNCION PARA EXTRAER LOS ROLES
     */
    public function extraer_roles(){
        $roles = $this->usuariosModel->extraer_roles();

        $response = ResponseHelper::sendResponse(true, 200, "Listado Roles", $roles, [], "Éxito", "success");

        return $response;
    }

    /**
     * FUNCION PARA ACTUALIZAR EL ESTADO DE UN USUARIO
     */
    public function actualizar_estado($datos){
        if ($this->usuariosModel->actualizar_estado($datos["id_usuario"], $datos['estado'])) {
            $response = ResponseHelper::sendResponse(true, 200, "El estado del usuario se actualizo correctamente.", null, [], "Éxito", "success");
        }else{
            $response = ResponseHelper::sendResponse(true, 200, "Ocurrio un error durante el proceso.", null, [], "Éxito", "success");
        }

        return $response;
    }

}
