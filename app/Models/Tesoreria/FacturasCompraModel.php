<?php

namespace App\Models\Tesoreria;

// use App\Helper\LoggerHelper;
use PDO;

class FacturasCompraModel
{
    private $dbc;
    private $directorio = "tesoreria";

    function __construct($db)
    {
        $this->dbc = $db;
    }

    public function extraer_facturas_compras($estado)
    {
        $where = "";

        if (!empty($estado) && !is_null($estado)) {
            $where = " AND estado = :estado";
        }

        $sql = "SELECT fc.*, pp.cuit AS cuit_proveedor FROM facturas_compra AS fc
                LEFT JOIN padron_proveedores AS pp 
                    ON fc.id_proveedor = pp.id_proveedor
                WHERE 1=1
                    {$where}
                ORDER BY id_factura DESC";
        $query = $this->dbc->prepare($sql);

        if (!empty($estado) && !is_null($estado)) {
            $query->bindValue(':estado', $estado, PDO::PARAM_STR);
        }

        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function nueva_factura_compra_cab($cabecera)
    {
        $sql = "INSERT INTO facturas_compra
                SET tipo_factura = :tipo_factura,
                    id_proveedor = :id_proveedor,
                    proveedor = :proveedor,
                    numero_factura = :numero_factura,
                    fecha = :fecha,
                    fecha_vencimiento = :fecha_vencimiento,
                    cai = :cai,
                    fecha_vencimiento_cai = :fecha_vencimiento_cai,
                    total = :total,
                    observaciones = :observaciones,
                    usuario_creacion = :usuario_creacion,
                    fecha_creacion = :fecha_creacion";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':tipo_factura', $cabecera['tipo_factura'] ?? '', PDO::PARAM_STR);
        $query->bindValue(':id_proveedor', (int) ($cabecera['id_proveedor'] ?? 0), PDO::PARAM_INT);
        $query->bindValue(':proveedor', $cabecera['razon_social_proveedor'] ?? '', PDO::PARAM_STR);
        $this->bindNullableString($query, ':numero_factura', $cabecera['nro_comprobante'] ?? null);
        $query->bindValue(':fecha', $cabecera['fecha_comprobante'] ?? null, PDO::PARAM_STR);
        $this->bindNullableString($query, ':fecha_vencimiento', $cabecera['fecha_vencimiento'] ?? null);
        $this->bindNullableString($query, ':cai', $cabecera['cai'] ?? null);
        $this->bindNullableString($query, ':fecha_vencimiento_cai', $cabecera['fecha_vencimiento_cai'] ?? null);
        $query->bindValue(':total', (float) ($cabecera['total_factura'] ?? 0));

        $observaciones = $cabecera['descripcion'] ?? null;
        if ($observaciones === '' || $observaciones === null) {
            $query->bindValue(':observaciones', null, PDO::PARAM_NULL);
        } else {
            $query->bindValue(':observaciones', $observaciones, PDO::PARAM_STR);
        }
        $query->bindValue(':usuario_creacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_creacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);

        if ($query->execute()) {
            return (int) $this->dbc->lastInsertId();
        } else {
            return false;
        }
    }

    public function nueva_factura_compra_detalle($idFacturaCompra, $detalles)
    {
        $sql = "INSERT INTO facturas_compra_detalle
                SET id_factura = :id_factura,
                    concepto_id = :concepto_id,
                    descripcion = :descripcion,
                    cantidad = :cantidad,
                    precio_unitario = :precio_unitario,
                    subtotal = :subtotal,
                    Id_alicuota = :id_alicuota,
                    porcentaje_bonificacion = :porcentaje_bonificacion,
                    importe_bonificacion = :importe_bonificacion,
                    importe_iva = :importe_iva,
                    total_iva = :total_iva,
                    usuario_creacion = :usuario_creacion,
                    fecha_creacion = :fecha_creacion";

        $query = $this->dbc->prepare($sql);
        $usuario = $_SESSION['auth_data']['username'];
        $fechaCreacion = date('Y-m-d H:i:s');

        foreach ($detalles as $detalle) {
            $descripcion = $detalle['descripcion'] ?? null;

            $query->bindValue(':id_factura', $idFacturaCompra, PDO::PARAM_INT);
            $this->bindNullableInt($query, ':concepto_id', $detalle['concepto_id'] ?? null);

            if ($descripcion === '' || $descripcion === null) {
                $query->bindValue(':descripcion', null, PDO::PARAM_NULL);
            } else {
                $query->bindValue(':descripcion', $descripcion, PDO::PARAM_STR);
            }

            $query->bindValue(':cantidad', (int) ($detalle['cantidad'] ?? 0), PDO::PARAM_INT);
            $query->bindValue(':precio_unitario', (float) ($detalle['precio_unitario'] ?? 0));
            $query->bindValue(':subtotal', (float) ($detalle['subtotal'] ?? 0));
            $this->bindNullableInt($query, ':id_alicuota', $detalle['id_alicuota'] ?? null);
            $query->bindValue(':porcentaje_bonificacion', (float) ($detalle['porcentaje_bonificacion'] ?? 0));
            $query->bindValue(':importe_bonificacion', (float) ($detalle['importe_bonificacion'] ?? 0));
            $query->bindValue(':importe_iva', (float) ($detalle['importe_iva'] ?? 0));
            $query->bindValue(':total_iva', (float) ($detalle['total_iva'] ?? 0));
            $query->bindValue(':usuario_creacion', $usuario, PDO::PARAM_STR);
            $query->bindValue(':fecha_creacion', $fechaCreacion, PDO::PARAM_STR);

            if (!$query->execute()) {
                return false;
            }
        }

        return true;
    }

    public function validar_disponibilidad_factura_compra($cabecera, $idFacturaExcluir = null)
    {
        $duplicados = [];
        $idProveedor = (int) ($cabecera['id_proveedor'] ?? 0);
        $numeroFactura = trim((string) ($cabecera['nro_comprobante'] ?? ''));
        $cai = trim((string) ($cabecera['cai'] ?? ''));

        if ($idProveedor <= 0) {
            return $duplicados;
        }

        if ($numeroFactura !== '') {
            $sqlNumero = "SELECT id_factura
                          FROM facturas_compra
                          WHERE id_proveedor = :id_proveedor
                            AND numero_factura = :numero_factura";

            if ($idFacturaExcluir !== null) {
                $sqlNumero .= " AND id_factura <> :id_factura";
            }

            $queryNumero = $this->dbc->prepare($sqlNumero);
            $queryNumero->bindValue(':id_proveedor', $idProveedor, PDO::PARAM_INT);
            $queryNumero->bindValue(':numero_factura', $numeroFactura, PDO::PARAM_STR);

            if ($idFacturaExcluir !== null) {
                $queryNumero->bindValue(':id_factura', (int) $idFacturaExcluir, PDO::PARAM_INT);
            }

            $queryNumero->execute();

            if ($queryNumero->fetchColumn()) {
                $duplicados['numero_factura'] = true;
            }
        }

        if ($cai !== '') {
            $sqlCai = "SELECT id_factura
                       FROM facturas_compra
                       WHERE id_proveedor = :id_proveedor
                         AND cai = :cai";

            if ($idFacturaExcluir !== null) {
                $sqlCai .= " AND id_factura <> :id_factura";
            }

            $queryCai = $this->dbc->prepare($sqlCai);
            $queryCai->bindValue(':id_proveedor', $idProveedor, PDO::PARAM_INT);
            $queryCai->bindValue(':cai', $cai, PDO::PARAM_STR);

            if ($idFacturaExcluir !== null) {
                $queryCai->bindValue(':id_factura', (int) $idFacturaExcluir, PDO::PARAM_INT);
            }

            $queryCai->execute();

            if ($queryCai->fetchColumn()) {
                $duplicados['cai'] = true;
            }
        }

        return $duplicados;
    }

    public function modificar_factura_compra_cab($idFacturaCompra, $cabecera)
    {
        $sql = "UPDATE facturas_compra
                SET tipo_factura = :tipo_factura,
                    id_proveedor = :id_proveedor,
                    proveedor = :proveedor,
                    numero_factura = :numero_factura,
                    fecha = :fecha,
                    fecha_vencimiento = :fecha_vencimiento,
                    cai = :cai,
                    fecha_vencimiento_cai = :fecha_vencimiento_cai,
                    observaciones = :observaciones,
                    usuario_modificacion = :usuario_modificacion,
                    fecha_modificacion = :fecha_modificacion
                WHERE id_factura = :id_factura";
        $query = $this->dbc->prepare($sql);

        $query->bindValue(':id_factura', (int) $idFacturaCompra, PDO::PARAM_INT);
        $query->bindValue(':tipo_factura', $cabecera['tipo_factura'] ?? '', PDO::PARAM_STR);
        $query->bindValue(':id_proveedor', (int) ($cabecera['id_proveedor'] ?? 0), PDO::PARAM_INT);
        $query->bindValue(':proveedor', $cabecera['razon_social_proveedor'] ?? '', PDO::PARAM_STR);
        $this->bindNullableString($query, ':numero_factura', $cabecera['nro_comprobante'] ?? null);
        $query->bindValue(':fecha', $cabecera['fecha_comprobante'] ?? null, PDO::PARAM_STR);
        $this->bindNullableString($query, ':fecha_vencimiento', $cabecera['fecha_vencimiento'] ?? null);
        $this->bindNullableString($query, ':cai', $cabecera['cai'] ?? null);
        $this->bindNullableString($query, ':fecha_vencimiento_cai', $cabecera['fecha_vencimiento_cai'] ?? null);

        $observaciones = $cabecera['descripcion'] ?? null;
        if ($observaciones === '' || $observaciones === null) {
            $query->bindValue(':observaciones', null, PDO::PARAM_NULL);
        } else {
            $query->bindValue(':observaciones', $observaciones, PDO::PARAM_STR);
        }

        $query->bindValue(':usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_modificacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function agregar_detalle_factura_compra($idFacturaCompra, $detalle)
    {
        return $this->nueva_factura_compra_detalle($idFacturaCompra, [$detalle]);
    }

    public function modificar_detalle_factura_compra($idFacturaCompra, $detalle)
    {
        $sql = "UPDATE facturas_compra_detalle
                SET concepto_id = :concepto_id,
                    descripcion = :descripcion,
                    cantidad = :cantidad,
                    precio_unitario = :precio_unitario,
                    subtotal = :subtotal,
                    Id_alicuota = :id_alicuota,
                    porcentaje_bonificacion = :porcentaje_bonificacion,
                    importe_bonificacion = :importe_bonificacion,
                    importe_iva = :importe_iva,
                    total_iva = :total_iva,
                    usuario_modificacion = :usuario_modificacion,
                    fecha_modificacion = :fecha_modificacion
                WHERE id_factura = :id_factura
                  AND id_detalle = :id_detalle";
        $query = $this->dbc->prepare($sql);

        $descripcion = $detalle['descripcion'] ?? null;

        $query->bindValue(':id_factura', (int) $idFacturaCompra, PDO::PARAM_INT);
        $query->bindValue(':id_detalle', (int) ($detalle['id_detalle'] ?? 0), PDO::PARAM_INT);
        $this->bindNullableInt($query, ':concepto_id', $detalle['concepto_id'] ?? null);

        if ($descripcion === '' || $descripcion === null) {
            $query->bindValue(':descripcion', null, PDO::PARAM_NULL);
        } else {
            $query->bindValue(':descripcion', $descripcion, PDO::PARAM_STR);
        }

        $query->bindValue(':cantidad', (int) ($detalle['cantidad'] ?? 0), PDO::PARAM_INT);
        $query->bindValue(':precio_unitario', (float) ($detalle['precio_unitario'] ?? 0));
        $query->bindValue(':subtotal', (float) ($detalle['subtotal'] ?? 0));
        $this->bindNullableInt($query, ':id_alicuota', $detalle['id_alicuota'] ?? null);
        $query->bindValue(':porcentaje_bonificacion', (float) ($detalle['porcentaje_bonificacion'] ?? 0));
        $query->bindValue(':importe_bonificacion', (float) ($detalle['importe_bonificacion'] ?? 0));
        $query->bindValue(':importe_iva', (float) ($detalle['importe_iva'] ?? 0));
        $query->bindValue(':total_iva', (float) ($detalle['total_iva'] ?? 0));
        $query->bindValue(':usuario_modificacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_modificacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function eliminar_detalle_factura_compra($idFacturaCompra, $idDetalle)
    {
        $sql = "DELETE FROM facturas_compra_detalle
                WHERE id_factura = :id_factura
                  AND id_detalle = :id_detalle";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_factura', (int) $idFacturaCompra, PDO::PARAM_INT);
        $query->bindValue(':id_detalle', (int) $idDetalle, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function recalcular_total_factura($idFacturaCompra)
    {
        $sql = "UPDATE facturas_compra
                SET total = (
                    SELECT COALESCE(SUM(total_iva), 0)
                    FROM facturas_compra_detalle
                    WHERE id_factura = :id_factura_detalle
                )
                WHERE id_factura = :id_factura";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_factura', (int) $idFacturaCompra, PDO::PARAM_INT);
        $query->bindValue(':id_factura_detalle', (int) $idFacturaCompra, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function extraer_factura_compra($idFacturaCompra)
    {
        $sqlCabecera = "SELECT fc.*, pp.cuit AS cuit_proveedor, 
                        pp.cuenta_contable AS cuenta_contable_proveedor
                        FROM facturas_compra AS fc
                        LEFT JOIN padron_proveedores AS pp 
                        ON fc.id_proveedor = pp.id_proveedor
                        INNER JOIN cuentas_contables AS cc ON pp.cuenta_contable = cc.id_cuenta
                        WHERE id_factura = :id_factura";
        $queryCabecera = $this->dbc->prepare($sqlCabecera);
        $queryCabecera->bindValue(':id_factura', (int) $idFacturaCompra, PDO::PARAM_INT);

        if (!$queryCabecera->execute()) {
            return false;
        }

        $cabecera = $queryCabecera->fetch(PDO::FETCH_ASSOC);
        if (!$cabecera) {
            return false;
        }

        $sqlDetalle = "SELECT fcd.*, c.descripcion AS concepto_descripcion, c.cuenta_contable, cc.codigo_cuenta, cc.nombre_cuenta
                       FROM facturas_compra_detalle AS fcd
                       LEFT JOIN conceptos AS c
                         ON fcd.concepto_id = c.id_concepto
                       LEFT JOIN cuentas_contables AS cc
                         ON c.cuenta_contable = cc.id_cuenta
                       WHERE fcd.id_factura = :id_factura
                       ORDER BY fcd.id_detalle ASC";
        $queryDetalle = $this->dbc->prepare($sqlDetalle);
        $queryDetalle->bindValue(':id_factura', (int) $idFacturaCompra, PDO::PARAM_INT);

        if (!$queryDetalle->execute()) {
            return false;
        }

        return [
            'cabecera' => $cabecera,
            'detalle' => $queryDetalle->fetchAll(PDO::FETCH_ASSOC),
        ];
    }

    private function bindNullableString($query, $param, $value)
    {
        if ($value === '' || $value === null) {
            $query->bindValue($param, null, PDO::PARAM_NULL);
            return;
        }

        $query->bindValue($param, $value, PDO::PARAM_STR);
    }

    private function bindNullableInt($query, $param, $value)
    {
        if ($value === '' || $value === null) {
            $query->bindValue($param, null, PDO::PARAM_NULL);
            return;
        }

        $query->bindValue($param, (int) $value, PDO::PARAM_INT);
    }

    public function confirmar_factura_compra($idFacturaCompra)
    {
        $sql = "UPDATE facturas_compra
                SET estado = 'AP',
                    usuario_confirmacion = :usuario_confirmacion,
                    fecha_confirmacion = :fecha_confirmacion
                WHERE id_factura = :id_factura";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_factura', (int) $idFacturaCompra, PDO::PARAM_INT);
        $query->bindValue(':usuario_confirmacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_confirmacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function eliminar_factura_compra($idFacturaCompra, $estado)
    {
        $sql = "UPDATE facturas_compra
                SET estado = :estado,
                    usuario_eliminacion = :usuario_eliminacion,
                    fecha_eliminacion = :fecha_eliminacion
                WHERE id_factura = :id_factura";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_factura', (int) $idFacturaCompra, PDO::PARAM_INT);
        $query->bindValue(':estado', $estado, PDO::PARAM_STR);
        $query->bindValue(':usuario_eliminacion', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_eliminacion', date('Y-m-d H:i:s'), PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    //LOTES ORDENES DE PAGO
    public function extraer_para_lote($ids)
    {
        $ids_facturas = implode(',', $ids);

        $sql = "SELECT 
                    'FAC' AS tipo_destino,
                    fac.id_proveedor AS id_destino, 
                    proveedor AS descripcion,
                    sum(total) AS importe
                FROM facturas_compra AS fac
                WHERE id_factura in ({$ids_facturas})
                GROUP BY id_proveedor";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizar_estado_facturas($ids, $estado)
    {
        $ids_facturas = implode(',', $ids);
        $sql = "UPDATE facturas_compra
                SET estado = :estado
                WHERE id in ({$ids_facturas});";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':estado', $estado);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function relacionar_asiento_contable($idFacturaCompra, $idAsiento)
    {
        $sql = "UPDATE facturas_compra
                SET id_asiento = :id_asiento
                WHERE id_factura = :id_factura";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_factura', (int) $idFacturaCompra, PDO::PARAM_INT);
        $query->bindValue(':id_asiento', (int) $idAsiento, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }
}
