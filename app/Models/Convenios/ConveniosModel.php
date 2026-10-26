<?php

namespace App\Models\Convenios;

use App\Helper\LoggerHelper;

use PDO;

class ConveniosModel
{
    private $dbc;
    private $directorio = "convenios";

    function __construct($db)
    {
        $this->dbc = $db;
    }

    public function nuevo_convenio($datos)
    {
        $datos = array_filter($datos, function ($v) {
            return $v !== '';
        });

        $columnas = array_keys($datos);
        $placeholders = array_map(function ($col) {
            return ':' . $col;
        }, $columnas);

        $sql = "INSERT INTO padron_convenios (" . implode(', ', $columnas) . ")
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
            return $datos['id_convenio'];
        } else {
            return false;
        }
    }

    public function verificar_convenio($id_convenio)
    {
        $sql = "SELECT * FROM padron_convenios
                WHERE id_convenio = :id_convenio";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_convenio', $id_convenio, PDO::PARAM_STR);

        $query->execute();
        $convenio = $query->fetch(PDO::FETCH_ASSOC);

        if (empty($convenio)) {
            return true;
        } else {
            return false;
        }
    }

    public function extraer_convenios()
    {
        $sql = "SELECT * FROM padron_convenios ORDER BY nombre ASC";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_convenio($id_convenio)
    {
        $sql = "SELECT 
                    cnv.*,
                    prov.nombre AS provincia_nombre,
                    loc.nombre AS localidad_nombre,
                    CONCAT(cca.codigo_cuenta, ' - ', cca.nombre_cuenta) AS cuenta_contable_activo_label,
                    CONCAT(ccp.codigo_cuenta, ' - ', ccp.nombre_cuenta) AS cuenta_contable_pasivo_label
                FROM padron_convenios AS cnv
                INNER JOIN padron_provincias AS prov
                    ON cnv.patente = prov.patente
                INNER JOIN padron_localidades AS loc
                    ON cnv.localidad_id = loc.id_localidad
                LEFT JOIN cuentas_contables AS cca
                    ON cnv.cuenta_contable_activo = cca.id_cuenta
                LEFT JOIN cuentas_contables AS ccp
                    ON cnv.cuenta_contable_pasivo = ccp.id_cuenta
                WHERE id_convenio = :id_convenio";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_convenio', $id_convenio, PDO::PARAM_INT);

        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function modificar_convenio($datos)
    {
        $columnas = array_keys($datos);

        $placeholders = array_filter(array_map(function ($col) {
            if ($col != "id_convenio") {
                return $col . ' = :' . $col;
            }
        }, $columnas));

        $sql = "UPDATE padron_convenios
                SET " . implode(",", $placeholders) . " WHERE id_convenio = :id_convenio";
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
        } else {
            LoggerHelper::registrar_log("[ERROR SQL] - Al modificar un convenio.", $this->directorio, $query->errorInfo()[2]);
            return false;
        }
    }

    /**
     * FUNCION PARA CAMBIAR EL ESTADO DE UN CONVENIO
     */
    public function cambiar_estado_convenio($id_convenio, $estado)
    {
        $sql = "UPDATE padron_convenios 
                SET activo = :estado
                WHERE id_convenio = :id_convenio";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':estado', $estado, PDO::PARAM_STR);
        $query->bindValue(':id_convenio', $id_convenio, PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * FUNCION PARA NUEVO PLAN
     */
    public function nuevo_plan($datos)
    {
        $sql = "INSERT INTO padron_planes
                SET id_plan = :id_plan,
                    convenio_id = :convenio_id,
                    nombre = :nombre,
                    cobertura = :cobertura,
                    bonificacion_os = :bonificacion_os,
                    bonificacion_farmacia = :bonificacion_farmacia,
                    fecha_creacion = :fecha_creacion,
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':id_plan', $datos['id_plan'], PDO::PARAM_STR);
        $query->bindValue(':convenio_id', $datos['convenio_id'], PDO::PARAM_STR);
        $query->bindValue(':nombre', $datos['nombre'], PDO::PARAM_STR);
        $query->bindValue(':cobertura', $datos['cobertura'], PDO::PARAM_STR);
        $query->bindValue(':bonificacion_os', $datos['bonificacion_os'], PDO::PARAM_STR);
        $query->bindValue(':bonificacion_farmacia', $datos['bonificacion_farmacia'], PDO::PARAM_STR);
        $query->bindValue(':fecha_creacion', date("Y-m-d H:i:s"), PDO::PARAM_STR);
        $query->bindValue(':usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        } else {
            print_r($query->errorInfo());
            exit;
            return false;
        }
    }

    /**
     * FUNCION PARA EXTRAER UN PLAN
     */
    public function extraer_plan($id_plan, $convenio_id)
    {
        $sql = "SELECT * FROM padron_planes
                WHERE id_plan = :id_plan AND convenio_id = :convenio_id";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':id_plan', $id_plan, PDO::PARAM_STR);
        $query->bindValue(':convenio_id', $convenio_id, PDO::PARAM_STR);

        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * FUNCION PARA EXTRAR LOS PLANES
     */
    public function extraer_planes($id_convenio)
    {
        $sql = "SELECT * FROM padron_planes
                WHERE convenio_id = :id_convenio";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':id_convenio', $id_convenio, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * FUNCION PARA MODIFICAR UN PLAN
     */
    public function modificar_plan($datos)
    {
        $sql = "UPDATE padron_planes 
                SET nombre = :nombre,
                    cobertura = :cobertura,
                    bonificacion_os = :bonificacion_os,
                    bonificacion_farmacia = :bonificacion_farmacia,
                    fecha_modificacion = :fecha_modificacion,
                    usuario_modificacion = :usuario_modificacion
                WHERE id_plan = :id_plan
                    AND convenio_id = :convenio_id";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':nombre', $datos['nombre'], PDO::PARAM_STR);
        $query->bindValue(':cobertura', $datos['cobertura'], PDO::PARAM_STR);
        $query->bindValue(':bonificacion_os', $datos['bonificacion_os'], PDO::PARAM_STR);
        $query->bindValue(':bonificacion_farmacia', $datos['bonificacion_farmacia'], PDO::PARAM_STR);
        $query->bindValue(':fecha_modificacion', date("Y-m-d H:i:s"), PDO::PARAM_STR);
        $query->bindValue(':usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        $query->bindValue(':id_plan', $datos['id_plan'], PDO::PARAM_STR);
        $query->bindValue(':convenio_id', $datos['convenio_id'], PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function sugerencias_convenios($termino)
    {
        $sql = "SELECT 
                pc.id_convenio,
                pc.razon_social,
                pc.nombre,
                CONCAT(pc.id_convenio, ' - ', pc.nombre) AS label
            FROM padron_convenios AS pc
            WHERE (pc.id_convenio LIKE :termino
                    OR UPPER(pc.razon_social) LIKE UPPER(:termino)
                    OR UPPER(pc.nombre) LIKE UPPER(:termino))
                AND pc.activo = 1
            ORDER BY pc.nombre ASC
            LIMIT 10";
        $query = $this->dbc->prepare($sql);
        $termino = "%$termino%";
        $query->bindValue(':termino', $termino, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}
