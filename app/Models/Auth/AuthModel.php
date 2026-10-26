<?php

namespace App\Models\Auth;

class AuthModel{
    private $dbc;

    function __construct($db){
        $this->dbc = $db;
    }

    /**
     * FUNCION PARA VERIFICAR EL USUARIO Y CONTRASEÑA DEL LOGIN
     */
    public function verificar_usuario($usuario, $contrasenia){
        $contrasenia = md5($contrasenia);
        $sql = "SELECT usr.*,
                    r.nombre AS nombre_rol
                FROM padron_usuarios AS usr
                LEFT JOIN roles AS r
                    ON usr.rol_id = r.id_rol
                WHERE usr.username = :usuario
                    AND usr.password = :contrasenia
                    AND activo = 1";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':usuario', $usuario, \PDO::PARAM_STR);
        $query->bindValue(':contrasenia', $contrasenia, \PDO::PARAM_STR);
        $query->execute();

        $usuarioDatos = $query->fetch(\PDO::FETCH_ASSOC);

        if (!empty($usuarioDatos)) {
            return $usuarioDatos;
        }else{
            return false;
        }
    }

}
