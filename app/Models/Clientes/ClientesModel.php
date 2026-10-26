<?php

namespace App\Models\Clientes;

use App\Helper\LoggerHelper;

use PDO;

class ClientesModel{
    private $dbc;
    private $directorio = "clientes";

    function __construct($db){
        $this->dbc = $db;
    }

    public function nuevo_cliente($datos){
        $sql = "INSERT INTO padron_clientes
                SET razon_social = :razon_social,
                    nombre_fantasia = :nombre_fantasia,
                    cuit = :cuit,
                    cuenta_contable = :cuenta_contable,
                    telefono = :telefono,
                    email = :email,
                    provincia = :provincia,
                    localidad = :localidad,
                    codigo_postal = :codigo_postal,
                    observaciones = :observaciones,
                    usuario_creacion = :usuario_creacion";
        $query = $this->dbc->prepare($sql);
        $cuentaContable = $datos['cuenta_contable'] ?? null;
        $query->bindValue('razon_social', $datos['razon_social'], PDO::PARAM_STR);
        $query->bindValue('nombre_fantasia', $datos['nombre_fantasia'], PDO::PARAM_STR);
        $query->bindValue('cuit', $datos['cuit'], PDO::PARAM_STR);
        $query->bindValue('cuenta_contable', $cuentaContable, $cuentaContable === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $this->bindNullable($query, 'telefono', $datos['telefono']);
        $this->bindNullable($query, 'email', $datos['email']);
        $query->bindValue('provincia', $datos['provincia'], PDO::PARAM_STR);
        $query->bindValue('localidad', $datos['localidad'], PDO::PARAM_INT);
        $query->bindValue('codigo_postal', $datos['codigo_postal'], PDO::PARAM_STR);
        $this->bindNullable($query, 'observaciones', $datos['observaciones']);
        $query->bindValue('usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if ($query->execute()) {
            return $this->dbc->lastInsertID();
        }else{
            return false;
        }
    }

    public function modificar_cliente($datos){
        $sql = "UPDATE padron_clientes
                SET razon_social = :razon_social,
                    nombre_fantasia = :nombre_fantasia,
                    cuit = :cuit,
                    cuenta_contable = :cuenta_contable,
                    telefono = :telefono,
                    email = :email,
                    provincia = :provincia,
                    localidad = :localidad,
                    codigo_postal = :codigo_postal,
                    observaciones = :observaciones,
                    usuario_modificacion = :usuario_modificacion,
                    fecha_modificacion = :fecha_modificacion
                WHERE id_cliente = :id_cliente";
        $query = $this->dbc->prepare($sql);
        $cuentaContable = $datos['cuenta_contable'] ?? null;
        $query->bindValue('razon_social', $datos['razon_social'], PDO::PARAM_STR);
        $query->bindValue('nombre_fantasia', $datos['nombre_fantasia'], PDO::PARAM_STR);
        $query->bindValue('cuit', $datos['cuit'], PDO::PARAM_STR);
        $query->bindValue('cuenta_contable', $cuentaContable, $cuentaContable === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $this->bindNullable($query, ':telefono', $datos['telefono']);
        $this->bindNullable($query, ':email', $datos['email']);
        $query->bindValue('provincia', $datos['provincia'], PDO::PARAM_STR);
        $query->bindValue('localidad', $datos['localidad'], PDO::PARAM_INT);
        $query->bindValue('codigo_postal', $datos['codigo_postal'], PDO::PARAM_STR);
        $this->bindNullable($query, ':observaciones', $datos['observaciones']);
        $query->bindValue('usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue('fecha_modificacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);
        $query->bindValue('id_cliente', $datos['id_cliente'], PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        }else{
            return false;
        }
    }

    public function extraer_clientes(){
        $sql = "SELECT c.*,
                    p.nombre AS nombre_provincia,
                    l.nombre AS nombre_localidad,
                    CASE
                        WHEN cc.id_cuenta IS NULL THEN NULL
                        ELSE CONCAT(cc.codigo_cuenta, ' - ', cc.nombre_cuenta)
                    END AS cuenta_contable_label
                FROM padron_clientes AS c
                INNER JOIN padron_provincias AS p
                    ON c.provincia = p.patente
                INNER JOIN padron_localidades AS l
                    ON c.localidad = l.id_localidad
                LEFT JOIN cuentas_contables AS cc
                    ON c.cuenta_contable = cc.id_cuenta";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_cliente($id_cliente){
        $sql = "SELECT c.*,
                    p.nombre AS nombre_provincia,
                    l.nombre AS nombre_localidad,
                    CASE
                        WHEN cc.id_cuenta IS NULL THEN NULL
                        ELSE CONCAT(cc.codigo_cuenta, ' - ', cc.nombre_cuenta)
                    END AS cuenta_contable_label
                FROM padron_clientes AS c
                INNER JOIN padron_provincias AS p
                    ON c.provincia = p.patente
                INNER JOIN padron_localidades AS l
                    ON c.localidad = l.id_localidad
                LEFT JOIN cuentas_contables AS cc
                    ON c.cuenta_contable = cc.id_cuenta
                WHERE c.id_cliente = :id_cliente";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('id_cliente', $id_cliente, PDO::PARAM_INT);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function verificar_cliente($cuit){
        $sql = "SELECT c.* FROM padron_clientes AS c
                WHERE c.cuit = :cuit";
        $query = $this->dbc->prepare($sql);
        $query->bindValue('cuit', $cuit, PDO::PARAM_INT);
        $query->execute();

        $cliente = $query->fetch(PDO::FETCH_ASSOC);

        if (empty($cliente)) {
            return true;
        }else{
            return false;
        }
    }

    private function bindNullable($query, $param, $value, $type = PDO::PARAM_STR) {
        if (is_null($value) || $value === '') {
            $query->bindValue($param, null, PDO::PARAM_NULL);
        } else {
            $query->bindValue($param, $value, $type);
        }
    }
}
