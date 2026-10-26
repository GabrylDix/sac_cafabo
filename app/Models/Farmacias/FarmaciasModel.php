<?php

namespace App\Models\Farmacias;

use App\Helper\LoggerHelper;

use PDO;

class FarmaciasModel{
    private $dbc;
    private $directorio = "farmacias";

    function __construct($db){
        $this->dbc = $db;
    }

    public function nueva_farmacia($datos){
        $datos = array_filter($datos, function($v) {
            return $v !== '';
        });

        $columnas = array_keys($datos);
        $placeholders = array_map(function($col) {
            return ':' . $col;
        }, $columnas);

        $sql = "INSERT INTO padron_farmacias (" . implode(', ', $columnas) . ")
                VALUES (" . implode(', ', $placeholders) . ")";
        $query = $this->dbc->prepare($sql);

        foreach ($datos as $col => $valor) {
            if ($valor === '' || $valor === null) {
                $query->bindValue(':' . $col, null, PDO::PARAM_NULL);
            } else {
                $query->bindValue(':' . $col, $valor, PDO::PARAM_STR);
            }
        }

        if ($query->execute()) {
            return $datos['id_farmacia'];
        } else {
            return false;
        }
    }

    public function verificar_farmacia($id_farmacia){
        $sql = "SELECT * FROM padron_farmacias
                WHERE id_farmacia = :id_farmacia";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_farmacia', $id_farmacia, PDO::PARAM_STR);

        $query->execute();
        $farmacia = $query->fetch(PDO::FETCH_ASSOC);

        if (empty($farmacia)) {
            return true;
        }else{
            return false;
        }
    }

    public function extraer_farmacias(){
        $sql = "SELECT far.*,
                    prov.nombre AS provincia_nombre,
                    loc.nombre AS localidad_nombre
                FROM padron_farmacias AS far
                INNER JOIN padron_provincias AS prov
                    ON far.patente = prov.patente
                INNER JOIN padron_localidades AS loc
                    ON far.localidad_id = loc.id_localidad";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_farmacia($id_farmacia){
        $sql = "SELECT far.*,
                    prov.nombre AS provincia_nombre,
                    loc.nombre AS localidad_nombre
                FROM padron_farmacias AS far
                INNER JOIN padron_provincias AS prov
                    ON far.patente = prov.patente
                INNER JOIN padron_localidades AS loc
                    ON far.localidad_id = loc.id_localidad
                WHERE id_farmacia = :id_farmacia";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_farmacia', $id_farmacia, PDO::PARAM_INT);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function extraer_convenios_habilitados($id_farmacia){
        $sql = "SELECT 
                    fc.*,
                    pc.nombre AS convenio_nombre
                FROM farmacias_convenios fc
                INNER JOIN padron_convenios AS pc
                    ON fc.convenio_id = pc.id_convenio
                WHERE fc.farmacia_id = :id_farmacia";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_farmacia', $id_farmacia, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function verificar_convenio_habilitado($id_farmacia, $id_convenio){
        $sql = "SELECT * FROM farmacias_convenios
                WHERE farmacia_id = :id_farmacia 
                    AND convenio_id = :id_convenio";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_farmacia', $id_farmacia, PDO::PARAM_INT);
        $query->bindValue(':id_convenio', $id_convenio, PDO::PARAM_INT);
        $query->execute();
        $rel = $query->fetch(PDO::FETCH_ASSOC);

        if (empty($rel)) {
            return true;
        }else{
            return false;
        }
    }

    public function habilitar_convenio($id_farmacia, $id_convenio){
        $sql = "INSERT INTO farmacias_convenios(farmacia_id, convenio_id, usuario_creacion)
                VALUES (:farmacia_id, :convenio_id, :usuario_creacion)";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':farmacia_id', $id_farmacia, PDO::PARAM_INT);
        $query->bindValue(':convenio_id', $id_convenio, PDO::PARAM_INT);
        $query->bindValue(':usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function modificar_farmacia($datos){
        $columnas = array_keys($datos);
        
        $placeholders = array_filter(array_map(function($col) {
            if ($col != "id_farmacia") {
                return $col.' = :' . $col;
            }
        }, $columnas));

        $sql = "UPDATE padron_farmacias
                SET ".implode(",", $placeholders)." WHERE id_farmacia = :id_farmacia";
        $query = $this->dbc->prepare($sql);

        foreach ($datos as $col => $valor) {
            if ($valor === null) {
                $query->bindValue(':' . $col, null, PDO::PARAM_NULL);
            } else {
                $query->bindValue(':' . $col, $valor);
            }
        }

        if ($query->execute()) {
            return true;
        }else{
            LoggerHelper::registrar_log("[ERROR SQL] - Al modificar una farmacia.", $this->directorio, $query->errorInfo()[2]);
            return false;
        }
    }

    public function cambiar_estado_farmacia($id_farmacia, $estado){
        $sql = "UPDATE padron_farmacias 
                SET activo = :estado
                WHERE id_farmacia = :id_farmacia";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':estado', $estado, PDO::PARAM_INT);
        $query->bindValue(':id_farmacia', $id_farmacia, PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function sugerencias_farmacias($termino){
        $sql = "SELECT 
                pf.id_farmacia,
                pf.cuf, pf.cuit, pf.codigo_pami, pf.codigo_farmalink, pf.razon_social,
                pf.nombre,
                CONCAT(pf.id_farmacia, ' - ', pf.razon_social, ' - ', pf.nombre) AS label
            FROM padron_farmacias AS pf
            WHERE (pf.id_farmacia LIKE :termino
                    OR pf.cuf LIKE :termino
                    OR pf.cuit LIKE :termino
                    OR pf.codigo_pami LIKE :termino
                    OR UPPER(pf.razon_social) LIKE UPPER(:termino)
                    OR UPPER(pf.nombre) LIKE UPPER(:termino))
                AND pf.activo = 1
            ORDER BY pf.nombre ASC
            LIMIT 10";
        $query = $this->dbc->prepare($sql);
        $termino = "%$termino%";
        $query->bindValue(':termino', $termino, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }


}
