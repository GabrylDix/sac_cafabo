<?php

namespace App\Models\Usuarios;

use App\Helper\ResponseHelper;

use PDO;

class UsuariosModel{
    private $dbc;

    function __construct($db){
        $this->dbc = $db;
    }

    /**
     * FUNCION PARA GENERAR UN NUEVO USUARIO
     */
    public function nuevo_usuario($datos){
        $sql = "INSERT INTO padron_usuarios
                SET username = :username,
                    password = :password,
                    rol_id = :rol_id,
                    nombre = :nombre,
                    apellido = :apellido,
                    email = :email,
                    telefono = :telefono,
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':username', $datos['username'], PDO::PARAM_STR);
        $query->bindValue(':password', md5($datos['password']), PDO::PARAM_STR);
        $query->bindValue(':rol_id', $datos['rol_id'], PDO::PARAM_STR);
        $query->bindValue(':nombre', $datos['nombre'], PDO::PARAM_STR);
        $query->bindValue(':apellido', $datos['apellido'], PDO::PARAM_STR);

        $email = !empty($datos['email']) ? $datos['email'] : null;
        $telefono = !empty($datos['telefono']) ? $datos['telefono'] : null;

        $query->bindValue(':email', $email, $email === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $query->bindValue(':telefono', $telefono, $telefono === null ? PDO::PARAM_NULL : PDO::PARAM_STR);

        $query->bindValue(':usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * FUNCION PARA EXTRAER TOODS LOS USUARIOS
     */
    public function extraer_usuarios(){
        $sql = "SELECT usr.*, rol.nombre AS nombre_rol FROM padron_usuarios AS usr
                INNER JOIN roles AS rol
                    ON usr.rol_id = rol.id_rol";

        $query = $this->dbc->prepare($sql);
        $query->execute();

        $usuarios = $query->fetchAll(PDO::FETCH_ASSOC);

        return $usuarios;
    }

    /**
     * FUNCION PARA  TRAER LOS DATOS DE UN USUARIO
     */

    public function extraer_usuario($id_usuario){
        $sql = "SELECT usr.*, rol.nombre AS nombre_rol
                FROM padron_usuarios AS usr
                INNER JOIN roles AS rol
                    ON usr.rol_id = rol.id_rol
                WHERE usr.id_usuario = :id_usuario";
        $query = $this->dbc->prepare($sql);
        
        $query->bindValue(':id_usuario', $id_usuario, PDO::PARAM_STR);

        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * FUNCION PARA MODIFICAR UN USUARIO
     */
    public function modificar_usuario($datos){
        $fecha = date("Y-m-d H:i:s");

        $sql = "UPDATE padron_usuarios
                SET rol_id = :rol_id,
                    nombre = :nombre,
                    apellido = :apellido,
                    email = :email,
                    telefono = :telefono,
                    fecha_modificacion = :fecha_modificacion,
                    usuario_modificacion = :usuario_modificacion
                where id_usuario = :id_usuario";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':rol_id', $datos['rol_id'], PDO::PARAM_STR);
        $query->bindValue(':nombre', $datos['nombre'], PDO::PARAM_STR);
        $query->bindValue(':apellido', $datos['apellido'], PDO::PARAM_STR);

        $email = !empty($datos['email']) ? $datos['email'] : null;
        $telefono = !empty($datos['telefono']) ? $datos['telefono'] : null;

        $query->bindValue(':email', $email, $email === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $query->bindValue(':telefono', $telefono, $telefono === null ? PDO::PARAM_NULL : PDO::PARAM_STR);

        $query->bindValue(':fecha_modificacion', $fecha, PDO::PARAM_STR);
        $query->bindValue(':usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        $query->bindValue(':id_usuario', $datos['id_usuario'], PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * FUNCION PARA ACTUALIZAR EL ESTADO DE UN USUARIO
     */
    public function actualizar_estado($id_usuario, $estado){
        $sql = "UPDATE padron_usuarios 
                SET activo = :estado
                WHERE id_usuario = :id_usuario";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':id_usuario', $id_usuario, PDO::PARAM_STR);
        $query->bindValue(':estado', $estado, PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * FUNCION PARA VERIFICAR SI EL USERNAME ESTA EN USO
     */
    public function verificar_username($username){
        $sql = "SELECT * FROM padron_usuarios
                WHERE username = :username";

        $query = $this->dbc->prepare($sql);
        $query->bindValue(':username', $username, PDO::PARAM_STR);
        $query->execute();

        $usuario = $query->fetch(PDO::FETCH_ASSOC);

        if (!empty($usuario)) {
            return false;
        } else {
            return true;;
        }
    }

    /**
     * FUNCION PARA EXTRAER ROLES DE USUARIO
     */
    public function extraer_roles(){
        $sql = "SELECT * FROM roles";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }


}
