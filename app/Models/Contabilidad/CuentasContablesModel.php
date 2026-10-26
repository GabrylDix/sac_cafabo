<?php

namespace App\Models\Contabilidad;

use PDO;

class CuentasContablesModel
{
    private $dbc;

    function __construct($db)
    {
        $this->dbc = $db;
    }

    public function verificar_codigo_cuenta($codigo_cuenta)
    {
        $sql = "SELECT COUNT(*) FROM cuentas_contables WHERE codigo_cuenta = :codigo_cuenta";

        $query = $this->dbc->prepare($sql);
        $query->bindValue(':codigo_cuenta', $codigo_cuenta, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchColumn();
    }

    public function nueva_cuenta_contable($datos)
    {
        $sql = "INSERT INTO cuentas_contables
                    (codigo_cuenta, nombre_cuenta, descripcion, tipo_cuenta , usuario_creacion)
                VALUES
                    (:codigo_cuenta, :nombre_cuenta, :descripcion, :tipo_cuenta, :usuario_creacion)";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':codigo_cuenta', $datos['codigo_cuenta'], PDO::PARAM_STR);
        $query->bindValue(':nombre_cuenta', $datos['nombre_cuenta'], PDO::PARAM_STR);
        $query->bindValue(':tipo_cuenta', $datos['tipo_cuenta'], PDO::PARAM_STR);
        $query->bindValue(':usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if (!empty($datos['descripcion'])) {
            $query->bindValue(':descripcion', $datos['descripcion'], PDO::PARAM_STR);
        } else {
            $query->bindValue(':descripcion', null, PDO::PARAM_NULL);
        }

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function extraer_cuentas_contables()
    {
        $sql = "SELECT * FROM cuentas_contables";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_cuenta_contable($id_cuenta_contable)
    {
        $sql = "SELECT * FROM cuentas_contables
                WHERE id_cuenta = :id_cuenta_contable";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_cuenta_contable', $id_cuenta_contable, PDO::PARAM_INT);

        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function modificar_cuenta_contable($datos)
    {
        $sql = "UPDATE cuentas_contables 
                SET codigo_cuenta = :codigo_cuenta,
                    nombre_cuenta = :nombre_cuenta,
                    descripcion = :descripcion,
                    tipo_cuenta = :tipo_cuenta,
                    usuario_modificacion = :usuario_modificacion,
                    fecha_modificacion = :fecha_modificacion
                WHERE id_cuenta = :id_cuenta";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':codigo_cuenta', $datos['codigo_cuenta'], PDO::PARAM_STR);
        $query->bindValue(':nombre_cuenta', $datos['nombre_cuenta'], PDO::PARAM_STR);
        $query->bindValue(':tipo_cuenta', $datos['tipo_cuenta'], PDO::PARAM_STR);
        $query->bindValue(':usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_modificacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);
        $query->bindValue(':id_cuenta', $datos['id_cuenta'], PDO::PARAM_INT);

        if (!empty($datos['descripcion'])) {
            $query->bindValue(':descripcion', $datos['descripcion'], PDO::PARAM_STR);
        } else {
            $query->bindValue(':descripcion', null, PDO::PARAM_NULL);
        }

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function cambiar_estado_cuenta_contable($id_cuenta, $estado)
    {
        $sql = "UPDATE cuentas_contables 
                SET estado = :estado,
                    usuario_eliminacion = :usuario_eliminacion,
                    fecha_eliminacion = :fecha_eliminacion
                WHERE id_cuenta = :id_cuenta";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':estado', $estado, PDO::PARAM_STR);
        $query->bindValue(':id_cuenta', $id_cuenta, PDO::PARAM_INT);
        $query->bindValue(':usuario_eliminacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_eliminacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function sugerencias_cuentas_contables($termino)
    {
        return $this->buscar_sugerencias_cuentas_contables($termino);
    }

    public function sugerencias_cuentas_contables_con_minimo($termino, $codigoMinimo)
    {
        return $this->buscar_sugerencias_cuentas_contables($termino, $codigoMinimo);
    }

    private function buscar_sugerencias_cuentas_contables($termino, $codigoMinimo = null)
    {
        $termino = trim((string) $termino);
        $codigoMinimo = trim((string) $codigoMinimo);

        $sql = "SELECT 
                cc.id_cuenta,
                cc.codigo_cuenta,
                cc.nombre_cuenta,
                CONCAT(cc.codigo_cuenta, ' - ', cc.nombre_cuenta) AS label
            FROM cuentas_contables AS cc
            WHERE cc.estado = 'A'";

        $queryParams = [];

        if ($codigoMinimo !== '') {
            $sql .= " AND cc.codigo_cuenta >= :codigo_minimo";
            $queryParams[':codigo_minimo'] = $codigoMinimo;
        }

        if ($termino !== '') {
            if (preg_match('/^[0-9.]+$/', $termino)) {
                $sql .= " AND cc.codigo_cuenta LIKE :codigo_cuenta";
                $queryParams[':codigo_cuenta'] = $termino . '%';
            } else {
                $sql .= " AND (cc.codigo_cuenta LIKE :codigo_cuenta OR UPPER(cc.nombre_cuenta) LIKE UPPER(:nombre_cuenta))";
                $queryParams[':codigo_cuenta'] = $termino . '%';
                $queryParams[':nombre_cuenta'] = '%' . $termino . '%';
            }
        }

        $sql .= " ORDER BY cc.codigo_cuenta ASC
            LIMIT 10";

        $query = $this->dbc->prepare($sql);

        foreach ($queryParams as $param => $value) {
            $query->bindValue($param, $value, PDO::PARAM_STR);
        }

        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}
