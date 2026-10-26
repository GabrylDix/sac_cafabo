<?php

namespace App\Models\Proveedores;

use PDO;

class ProveedoresModel
{
    private $dbc;

    function __construct($db)
    {
        $this->dbc = $db;
    }

    public function verificar_proveedor($cuit)
    {
        $sql = "SELECT * FROM padron_proveedores WHERE cuit = :cuit";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('cuit', $cuit, PDO::PARAM_INT);
        $query->execute();
        $proveedor = $query->fetch(PDO::FETCH_ASSOC);

        if (empty($proveedor)) {
            return true;
        } else {
            return false;
        }
    }

    public function nuevo_proveedor($datos)
    {
        $sql = "INSERT INTO padron_proveedores 
                SET razon_social = :razon_social,
                    nombre_fantasia = :nombre_fantasia,
                    cuit = :cuit,
                    condicion_iva = :condicion_iva,
                    cuenta_contable = :cuenta_contable,
                    telefono = :telefono,
                    email = :email,
                    direccion = :direccion,
                    provincia = :provincia,
                    localidad = :localidad,
                    codigo_postal = :codigo_postal,
                    cbu = :cbu,
                    alias_cbu = :alias_cbu,
                    cvu = :cvu,
                    alias_cvu = :alias_cvu,
                    observaciones = :observaciones,
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);

        $datos['usuario_creacion'] = $_SESSION['auth_data']['username'];

        if ($query->execute($datos)) {
            return $this->dbc->lastInsertId();
        } else {
            print_r($query->errorInfo()); // Agrega esta línea para depuración  
            exit; // Detén la ejecución para ver el error
            return false;
        }
    }

    public function modificar_proveedor($datos)
    {
        $sql = "UPDATE padron_proveedores
                SET razon_social = :razon_social,
                    nombre_fantasia = :nombre_fantasia,
                    cuit = :cuit,
                    condicion_iva = :condicion_iva,
                    cuenta_contable = :cuenta_contable,
                    telefono = :telefono,
                    email = :email,
                    direccion = :direccion,
                    provincia = :provincia,
                    localidad = :localidad,
                    codigo_postal = :codigo_postal,
                    cbu = :cbu,
                    alias_cbu = :alias_cbu,
                    cvu = :cvu,
                    alias_cvu = :alias_cvu,
                    observaciones = :observaciones,
                    usuario_modificacion = :usuario_modificacion,
                    fecha_modificacion = :fecha_modificacion
                WHERE id_proveedor = :id_proveedor";
        $query = $this->dbc->prepare($sql);

        $datos['usuario_modificacion'] = $_SESSION['auth_data']['username'];
        $datos['fecha_modificacion'] = date("Y-m-d H:i:s");

        if ($query->execute($datos)) {
            return true;
        } else {
            return false;
        }
    }

    public function extraer_proveedores()
    {
        $sql = "SELECT p.*,
                    pr.nombre AS nombre_provincia,
                    l.nombre AS nombre_localidad,
                    i.descripcion AS nombre_categoria_iva,
                    CASE
                        WHEN cc.id_cuenta IS NULL THEN NULL
                        ELSE CONCAT(cc.codigo_cuenta, ' - ', cc.nombre_cuenta)
                    END AS cuenta_contable_label
                FROM padron_proveedores AS p
                LEFT JOIN padron_provincias pr
                    ON p.provincia = pr.patente
                LEFT JOIN padron_localidades AS l
                    ON p.localidad = l.id_localidad
                LEFT JOIN  categorias_iva AS i
                    ON p.condicion_iva = i.id
                LEFT JOIN cuentas_contables AS cc
                    ON p.cuenta_contable = cc.id_cuenta";
        $query = $this->dbc->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_proveedor($id_proveedor)
    {
        $sql = "SELECT p.*, 
                    pr.nombre AS nombre_provincia,
                    l.nombre AS nombre_localidad,
                    i.descripcion AS nombre_categoria_iva,
                    CASE
                        WHEN cc.id_cuenta IS NULL THEN NULL
                        ELSE CONCAT(cc.codigo_cuenta, ' - ', cc.nombre_cuenta)
                    END AS cuenta_contable_label
                FROM padron_proveedores AS p
                LEFT JOIN padron_provincias pr
                    ON p.provincia = pr.patente
                LEFT JOIN padron_localidades AS l
                    ON p.localidad = l.id_localidad
                LEFT JOIN  categorias_iva AS i
                    ON p.condicion_iva = i.id
                LEFT JOIN cuentas_contables AS cc
                    ON p.cuenta_contable = cc.id_cuenta
                WHERE id_proveedor = :id_proveedor";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('id_proveedor', $id_proveedor, PDO::PARAM_INT);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function actualizar_estado($id_proveedor, $estado)
    {
        $sql = "UPDATE padron_proveedores SET estado = :estado WHERE id_proveedor = :id_proveedor";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('estado', $estado, PDO::PARAM_STR);
        $query->bindValue('id_proveedor', $id_proveedor, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }
}
