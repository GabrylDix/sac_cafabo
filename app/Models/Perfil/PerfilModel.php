<?php

namespace App\Models\Perfil;

use App\Helper\LoggerHelper;

use PDO;

class PerfilModel{
    private $dbc;
    private $directorio = "perfil";

    function __construct($db){
        $this->dbc = $db;
    }

    public function extraer_perfil($id_usuario){
        $sql = "SELECT 
                    pu.username, pu.nombre, pu.apellido, pu.email, pu.telefono, pu.imagen, r.nombre AS nombre_rol
                FROM padron_usuarios AS pu
                INNER JOIN roles AS r
                    ON pu.rol_id = r.id_rol
                WHERE id_usuario = :id_usuario";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function modificar_perfil($datos, $id_usuario){
        $fecha = date("Y-m-d H:i:s");

        $sql = "UPDATE padron_usuarios
                SET nombre = :nombre,
                    apellido = :apellido,
                    email = :email,
                    telefono = :telefono,
                    fecha_modificacion = :fecha_modificacion,
                    usuario_modificacion = :usuario_modificacion
                WHERE id_usuario = :id_usuario";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':nombre', $datos['nombre'], PDO::PARAM_STR);
        $query->bindValue(':apellido', $datos['apellido'], PDO::PARAM_STR);

        $email = !empty($datos['email']) ? $datos['email'] : null;
        $telefono = !empty($datos['telefono']) ? $datos['telefono'] : null;

        $query->bindValue(':email', $email, $email === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $query->bindValue(':telefono', $telefono, $telefono === null ? PDO::PARAM_NULL : PDO::PARAM_STR);

        $query->bindValue(':fecha_modificacion', $fecha, PDO::PARAM_STR);
        $query->bindValue(':usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);


        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function actualizar_contrasenia($contrasenia, $id_usuario){
        $sql = "UPDATE padron_usuarios 
                SET password  = md5(:contrasenia)
                WHERE id_usuario = :id_usuario";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':contrasenia', $contrasenia, PDO::PARAM_STR);
        $query->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);

        return $query->execute();
    }

    public function actualizar_imagen($path_imagen, $id_usuario){
        $sql = "UPDATE padron_usuarios
                SET imagen = :imagen
                WHERE id_usuario = :id_usuario";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':imagen', $path_imagen, PDO::PARAM_STR);
        $query->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);

        return $query->execute();
    }

}
