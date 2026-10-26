<?php

namespace App\Models\Conceptos;

use App\Helper\LoggerHelper;

use PDO;

class ConceptosModel
{
    private $dbc;
    private $directorio = "conceptos";

    function __construct($db)
    {
        $this->dbc = $db;
    }

    public function nuevo_concepto($datos)
    {
        $sql = "INSERT INTO conceptos
                SET descripcion = :descripcion,
                    cuenta_contable = :cuenta_contable,
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('descripcion', $datos['descripcion'], PDO::PARAM_STR);
        $query->bindValue('cuenta_contable', $datos['cuenta_contable'], PDO::PARAM_INT);
        $query->bindValue('usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if ($query->execute()) {
            return $this->dbc->lastInsertID();
        } else {
            return false;
        }
    }

    public function modificar_concepto($datos)
    {
        $sql = "UPDATE conceptos
                SET descripcion = :descripcion,
                    cuenta_contable = :cuenta_contable,
                    usuario_modificacion = :usuario_modificacion,
                    fecha_modificacion = :fecha_modificacion
                WHERE id_concepto = :id_concepto";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('descripcion', $datos['descripcion'], PDO::PARAM_STR);
        $query->bindValue('cuenta_contable', $datos['cuenta_contable'], PDO::PARAM_INT);
        $query->bindValue('usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue('fecha_modificacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);
        $query->bindValue('id_concepto', $datos['id_concepto'], PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function extraer_conceptos()
    {
        $sql = "SELECT c.*, 
                    cc.codigo_cuenta,
                    cc.nombre_cuenta
                FROM conceptos AS c
                LEFT JOIN cuentas_contables AS cc
                    ON c.cuenta_contable = cc.id_cuenta";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_concepto($id_concepto)
    {
        $sql = "SELECT c.*, 
                    cc.codigo_cuenta,
                    cc.nombre_cuenta
                FROM conceptos AS c
                LEFT JOIN cuentas_contables AS cc
                    ON c.cuenta_contable = cc.id_cuenta
                WHERE c.id_concepto = :id_concepto";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('id_concepto', $id_concepto, PDO::PARAM_INT);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function actualizar_estado($id_concepto, $estado)
    {
        if ($estado == 'I') {
            $sql = "UPDATE conceptos
                    SET estado = :estado,
                        usuario_eliminacion = :usuario_eliminacion,
                        fecha_eliminacion = :fecha_eliminacion
                    WHERE id_concepto = :id_concepto";
            $query = $this->dbc->prepare($sql);
            $query->bindValue('estado', $estado, PDO::PARAM_STR);
            $query->bindValue('usuario_eliminacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
            $query->bindValue('fecha_eliminacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);
            $query->bindValue('id_concepto', $id_concepto, PDO::PARAM_INT);
        } else {
            $sql = "UPDATE conceptos
                    SET estado = :estado,
                        usuario_eliminacion = NULL,
                        fecha_eliminacion = NULL,
                        usuario_modificacion = :usuario_modificacion,
                        fecha_modificacion = :fecha_modificacion
                    WHERE id_concepto = :id_concepto";
            $query = $this->dbc->prepare($sql);
            $query->bindValue('estado', $estado, PDO::PARAM_STR);
            $query->bindValue('usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
            $query->bindValue('fecha_modificacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);
            $query->bindValue('id_concepto', $id_concepto, PDO::PARAM_INT);
        }

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function sugerencias_conceptos($termino){
        $sql = "SELECT 
                c.id_concepto,
                c.descripcion,
                c.cuenta_contable,
                CONCAT(c.id_concepto, ' - ', c.descripcion) AS label
            FROM conceptos AS c
            WHERE (c.id_concepto LIKE :termino
                    OR UPPER(c.descripcion) LIKE UPPER(:termino))
                AND c.estado = 'A'
            ORDER BY c.descripcion ASC
            LIMIT 10";
        $query = $this->dbc->prepare($sql);
        $termino = "%$termino%";
        $query->bindValue(':termino', $termino, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}
