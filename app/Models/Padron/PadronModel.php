<?php
namespace App\Models\Padron;

use PDO;

class PadronModel {
    private $dbc;

    public function __construct($db) {
        $this->dbc = $db;
    }

    public function obtener_provincias() {
        $sql = "SELECT patente, nombre FROM padron_provincias ORDER BY nombre";
        $query = $this->dbc->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtener_localidades($patente = null) {
        $sql = "SELECT id_localidad, patente, nombre FROM padron_localidades";

        if ($patente) {
            $sql .= " WHERE patente = :patente";
        }
        $sql .= " ORDER BY nombre";

        $query = $this->dbc->prepare($sql);

        if ($patente) {
            $query->bindValue(':patente', $patente, PDO::PARAM_STR);
        }

        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function condiciones_iva(){
        $sql = "SELECT * FROM categorias_iva;";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_bancos(){
        $sql = "SELECT * FROM padron_bancos";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}