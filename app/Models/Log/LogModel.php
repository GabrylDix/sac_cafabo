<?php

namespace App\Models\Log;

use PDO;

class LogModel{
    private $dbc;

    function __construct($db){
        $this->dbc = $db;
    }

    public function login($datos){
        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
        $username = $datos['username'] ?? null;
        $id_usuario = $datos['id_usuario'] ?? null;


        $sql = "INSERT INTO accesos (usuario_id, username, ip, user_agent, resultado)
                VALUES (:usuario_id, :username, :ip, :user_agent, :resultado)";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':usuario_id', $id_usuario, PDO::PARAM_INT);
        $query->bindValue(':username', $username, PDO::PARAM_STR);
        $query->bindValue(':ip', $ip, PDO::PARAM_STR);
        $query->bindValue(':user_agent', $user_agent, PDO::PARAM_STR);
        $query->bindValue(':resultado', $datos['resultado'], PDO::PARAM_STR);

        $query->execute();
    }

}
