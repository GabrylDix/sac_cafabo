<?php

namespace App\Models\Contabilidad;

use App\Helper\LoggerHelper;

use PDO;

class AsientosContablesModel
{
    private $dbc;
    private $directorio = "asientos_contables";

    function __construct($db)
    {
        $this->dbc = $db;
    }

    public function insertar_asiento($data)
    {
        $sql = "INSERT INTO asientos_contables (ejercicio, fecha_aplicacion, tipo_origen, id_origen, descripcion, nota, usuario_creacion)
                VALUES (:ejercicio, :fecha_aplicacion, :tipo_origen, :id_origen, :descripcion, :nota, :usuario)";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':ejercicio', $data['ejercicio'], PDO::PARAM_INT);
        $query->bindValue(':fecha_aplicacion', $data['fecha_aplicacion'], PDO::PARAM_STR);
        $query->bindValue(':tipo_origen', $data['tipo_origen'], PDO::PARAM_STR);
        $query->bindValue(':id_origen', $data['id_origen'], PDO::PARAM_STR);
        $query->bindValue(':descripcion', $data['descripcion'], PDO::PARAM_STR);
        $query->bindValue(':nota', $data['nota'], PDO::PARAM_STR);
        $query->bindValue(':usuario', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if ($query->execute()) {
            return $this->dbc->lastInsertId();
        } else {
            return false;
        }
    }

    public function insertar_asiento_detalle($id_asiento, $datos, $fecha_aplicacion)
    {
        $sql = "INSERT INTO asientos_contables_detalle (id_asiento, id_cuenta, descripcion, debe, haber, fecha_aplicacion, usuario_creacion)
                    VALUES (:id_asiento, :id_cuenta, :descripcion, :debe, :haber, :fecha_aplicacion, :usuario)";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_asiento', $id_asiento, PDO::PARAM_INT);
        $query->bindValue(':id_cuenta', $datos['id_cuenta'], PDO::PARAM_INT);
        $query->bindValue(':descripcion', $datos['descripcion'], PDO::PARAM_STR);
        $query->bindValue(':debe', $datos['debe'], PDO::PARAM_STR);
        $query->bindValue(':haber', $datos['haber'], PDO::PARAM_STR);
        $query->bindValue(':fecha_aplicacion', $fecha_aplicacion, PDO::PARAM_STR);
        $query->bindValue(':usuario', $_SESSION['auth_data']['username'], PDO::PARAM_STR);

        if ($query->execute()) {
            if ($this->recalcular_saldo($datos['id_cuenta'], $fecha_aplicacion)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function recalcular_saldo($id_cuenta, $fecha_aplicacion)
    {
        $sql = "UPDATE asientos_contables_detalle AS detalle
                INNER JOIN (
                    WITH UltimoRegistro AS (
                        SELECT d.id_detalle,
                                d.id_asiento,
                                d.id_cuenta,
                                d.descripcion,
                                d.fecha_aplicacion,
                                d.debe,
                                d.haber,
                                d.saldo,
                                c.estado,
                                c.fecha_creacion,
                                'S' AS sn -- 'S' para Saldo inicial base
                        FROM asientos_contables_detalle AS d
                                INNER JOIN
                            asientos_contables AS c ON d.id_asiento = c.id_asiento
                        WHERE d.id_cuenta = :id_cuenta
                        AND d.fecha_aplicacion < :fecha_aplicacion
                        AND c.estado = 'B'
                        ORDER BY d.fecha_aplicacion DESC, d.id_detalle DESC
                        LIMIT 1
                    ),
                    RegistrosPrincipales AS (
                        SELECT det.id_detalle,
                                det.id_asiento,
                                det.id_cuenta,
                                det.descripcion,
                                det.fecha_aplicacion,
                                det.debe,
                                det.haber,
                                det.saldo AS saldo_original_db,
                                cab.estado,
                                cab.fecha_creacion,
                                'N'       AS sn -- 'N' para todos los registros a recalcular
                        FROM asientos_contables_detalle AS det
                                INNER JOIN
                            asientos_contables AS cab ON det.id_asiento = cab.id_asiento
                        WHERE det.id_cuenta = :id_cuenta
                            AND det.fecha_aplicacion >= :fecha_aplicacion
                            AND cab.estado = 'B'
                        ORDER BY det.fecha_aplicacion
                    ),
                    TodosLosRegistros AS (
                        SELECT id_detalle, id_asiento, id_cuenta, descripcion, fecha_aplicacion, debe, haber, saldo, estado, fecha_creacion, sn FROM UltimoRegistro
                        UNION ALL
                        SELECT id_detalle, id_asiento, id_cuenta, descripcion, fecha_aplicacion, debe, haber, saldo_original_db AS saldo, estado, fecha_creacion, sn FROM RegistrosPrincipales
                    ),
                    Resultado AS (
                        SELECT
                            td.id_detalle,
                            td.id_cuenta,
                            td.fecha_aplicacion, td.debe, td.haber,
                            td.saldo AS saldo_original_en_ventana, -- Alias is for the output column name
                            td.sn,
                            CASE
                                WHEN td.sn = 'S' THEN td.saldo -- Corrected: Use td.saldo
                                ELSE -- td.sn = 'N'
                                    -- Se verifica si el primer registro en la ventana de partici�n es 'S'.
                                    -- Esto indica si existe un UltimoRegistro que provee el saldo base.
                                    IF( -- Note: IF() is MySQL-specific, standard SQL uses CASE
                                        FIRST_VALUE(td.sn) OVER (
                                            PARTITION BY td.id_cuenta
                                            ORDER BY td.fecha_aplicacion, td.id_detalle
                                            ROWS UNBOUNDED PRECEDING
                                        ) = 'S',
                                        -- CASO 1: S� hay un UltimoRegistro (sn='S') como base.
                                        -- Se calcula: SaldoDelUltimoRegistro + SumaMovimientosDesdeUltimoRegistro - MovimientoDelUltimoRegistro
                                        COALESCE(FIRST_VALUE(td.saldo) OVER ( -- Corrected: Use td.saldo
                                            PARTITION BY  td.id_cuenta
                                            ORDER BY td.fecha_aplicacion, td.id_detalle ROWS UNBOUNDED PRECEDING
                                        ), 0.00)
                                        +
                                        SUM(td.debe - td.haber) OVER (
                                            PARTITION BY td.id_cuenta
                                            ORDER BY td.fecha_aplicacion, td.id_detalle ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                                        )
                                        -
                                        COALESCE(FIRST_VALUE(td.debe - td.haber) OVER (
                                            PARTITION BY  td.id_cuenta
                                            ORDER BY td.fecha_aplicacion, td.id_detalle ROWS UNBOUNDED PRECEDING
                                        ), 0.00),
                                        -- CASO 2: NO hay UltimoRegistro. El primer registro es un 'N'.
                                        -- Se calcula la suma acumulada de movimientos desde el inicio (base 0).
                                        SUM(td.debe - td.haber) OVER (
                                            PARTITION BY  td.id_cuenta
                                            ORDER BY td.fecha_aplicacion, td.id_detalle
                                            ROWS UNBOUNDED PRECEDING
                                        )
                                    )
                            END AS saldo_calculado
                        FROM TodosLosRegistros td
                    )
                SELECT *
                FROM Resultado
                WHERE sn != 'S' -- Excluir el saldo inicial
                ORDER BY fecha_aplicacion, id_detalle
            ) AS cs
            ON detalle.id_detalle = cs.id_detalle
            SET detalle.saldo = cs.saldo_calculado;";

        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_cuenta', $id_cuenta, PDO::PARAM_INT);
        $query->bindValue(':fecha_aplicacion', $fecha_aplicacion, PDO::PARAM_STR);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function actualizar_id_asiento_original($id_asiento, $id_asiento_original)
    {
        $sql = "UPDATE asientos_contables
                SET id_asiento_original = :id_asiento_original
                WHERE id_asiento = :id_asiento";

        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_asiento_original', $id_asiento_original);
        $query->bindValue(':id_asiento', $id_asiento);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function extraer_asientos_contables()
    {
        $sql = "SELECT
                    a.*,
                    EXISTS (
                        SELECT 1
                        FROM asientos_contables r
                        WHERE r.id_asiento_original = a.id_asiento
                    ) AS tiene_reverso
                FROM asientos_contables a
                ORDER BY a.id_asiento DESC";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_asiento_cabecera($id_asiento)
    {
        $sql = "SELECT * FROM asientos_contables
                WHERE id_asiento = :id_asiento";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_asiento', $id_asiento, PDO::PARAM_INT);
        $query->execute();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function extraer_asiento_detalle($id_asiento)
    {
        $sql = "SELECT 
                    det.*,
                    cc.codigo_cuenta,
                    cc.nombre_cuenta
                FROM asientos_contables_detalle AS det
                INNER JOIN cuentas_contables AS cc
                    ON det.id_cuenta = cc.id_cuenta
                WHERE id_asiento = :id_asiento";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_asiento', $id_asiento, PDO::PARAM_INT);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function extraer_libro_mayor($datos)
    {
        $idCuentaDesde = (int) ($datos['id_cuenta_desde'] ?? 0);
        $idCuentaHasta = !empty($datos['id_cuenta_hasta']) ? (int) $datos['id_cuenta_hasta'] : null;
        $fechaDesde = trim((string) ($datos['fecha_desde'] ?? ''));
        $fechaHasta = trim((string) ($datos['fecha_hasta'] ?? ''));

        if ($idCuentaDesde <= 0 || $fechaDesde === '' || $fechaHasta === '') {
            return [];
        }

        if ($idCuentaHasta) {
            $sql = "WITH CuentaDesde AS (
                        SELECT id_cuenta, codigo_cuenta
                        FROM cuentas_contables
                        WHERE id_cuenta = :id_cuenta_desde
                    ),
                    CuentaHasta AS (
                        SELECT id_cuenta, codigo_cuenta
                        FROM cuentas_contables
                        WHERE id_cuenta = :id_cuenta_hasta
                    ),
                    CuentasActivas AS (
                        SELECT DISTINCT
                            cc.id_cuenta,
                            cc.codigo_cuenta,
                            cc.nombre_cuenta
                        FROM asientos_contables_detalle AS det
                        INNER JOIN asientos_contables AS cab
                            ON det.id_asiento = cab.id_asiento
                        INNER JOIN cuentas_contables AS cc
                            ON det.id_cuenta = cc.id_cuenta
                        CROSS JOIN CuentaDesde AS cd
                        CROSS JOIN CuentaHasta AS ch
                        WHERE cc.codigo_cuenta BETWEEN cd.codigo_cuenta AND ch.codigo_cuenta
                            AND cab.estado = 'B'
                            AND det.fecha_aplicacion BETWEEN :fecha_desde_activas AND :fecha_hasta_activas
                    ),
                    UltimosIds AS (
                        SELECT
                            det.id_cuenta,
                            MAX(det.id_detalle) AS max_id_detalle
                        FROM asientos_contables_detalle AS det
                        INNER JOIN asientos_contables AS cab
                            ON det.id_asiento = cab.id_asiento
                        INNER JOIN CuentasActivas AS ca
                            ON det.id_cuenta = ca.id_cuenta
                        WHERE cab.estado = 'B'
                            AND det.fecha_aplicacion < :fecha_desde_ultimos
                        GROUP BY det.id_cuenta
                    ),
                    UltimoRegistro AS (
                        SELECT
                            det.id_detalle,
                            det.id_asiento,
                            COALESCE(cab.numero_asiento, cab.id_asiento) AS numero_asiento,
                            det.id_cuenta,
                            det.descripcion,
                            det.fecha_aplicacion,
                            det.debe AS montoDebe,
                            det.haber AS montoHaber,
                            det.saldo,
                            cab.estado,
                            cab.fecha_creacion AS fecha_carga,
                            cab.descripcion AS descripcion_asiento,
                            cc.codigo_cuenta AS cuenta_comp
                        FROM asientos_contables_detalle AS det
                        INNER JOIN UltimosIds AS ult
                            ON det.id_detalle = ult.max_id_detalle
                        INNER JOIN asientos_contables AS cab
                            ON det.id_asiento = cab.id_asiento
                        INNER JOIN cuentas_contables AS cc
                            ON det.id_cuenta = cc.id_cuenta
                    ),
                    UltimoRegistroFicticio AS (
                        SELECT
                            0 AS id_detalle,
                            0 AS id_asiento,
                            0 AS numero_asiento,
                            ca.id_cuenta,
                            '' AS descripcion,
                            DATE_SUB(:fecha_desde_ficticia, INTERVAL 1 DAY) AS fecha_aplicacion,
                            0.00 AS montoDebe,
                            0.00 AS montoHaber,
                            0.00 AS saldo,
                            'B' AS estado,
                            DATE_SUB(:fecha_desde_carga_ficticia, INTERVAL 1 DAY) AS fecha_carga,
                            '' AS descripcion_asiento,
                            ca.codigo_cuenta AS cuenta_comp
                        FROM CuentasActivas AS ca
                        WHERE NOT EXISTS (
                            SELECT 1
                            FROM UltimoRegistro AS ur
                            WHERE ur.id_cuenta = ca.id_cuenta
                        )
                    ),
                    RegistrosPrincipales AS (
                        SELECT
                            det.id_detalle,
                            det.id_asiento,
                            COALESCE(cab.numero_asiento, cab.id_asiento) AS numero_asiento,
                            det.id_cuenta,
                            det.descripcion,
                            det.fecha_aplicacion,
                            det.debe AS montoDebe,
                            det.haber AS montoHaber,
                            det.saldo,
                            cab.estado,
                            cab.fecha_creacion AS fecha_carga,
                            cab.descripcion AS descripcion_asiento,
                            ca.codigo_cuenta AS cuenta_comp
                        FROM asientos_contables_detalle AS det
                        INNER JOIN asientos_contables AS cab
                            ON det.id_asiento = cab.id_asiento
                        INNER JOIN CuentasActivas AS ca
                            ON det.id_cuenta = ca.id_cuenta
                        WHERE cab.estado = 'B'
                            AND det.fecha_aplicacion BETWEEN :fecha_desde_principal AND :fecha_hasta_principal
                    ),
                    SaldoTotales AS (
                        SELECT
                            0 AS id_detalle,
                            0 AS id_asiento,
                            0 AS numero_asiento,
                            det.id_cuenta,
                            '' AS descripcion,
                            DATE_ADD(:fecha_hasta_totales, INTERVAL 1 DAY) AS fecha_aplicacion,
                            SUM(det.debe) AS montoDebe,
                            SUM(det.haber) AS montoHaber,
                            SUM(det.debe) - SUM(det.haber) AS saldo,
                            'B' AS estado,
                            DATE_ADD(:fecha_hasta_carga_totales, INTERVAL 1 DAY) AS fecha_carga,
                            '' AS descripcion_asiento,
                            ca.codigo_cuenta AS cuenta_comp
                        FROM asientos_contables_detalle AS det
                        INNER JOIN asientos_contables AS cab
                            ON det.id_asiento = cab.id_asiento
                        INNER JOIN CuentasActivas AS ca
                            ON det.id_cuenta = ca.id_cuenta
                        WHERE cab.estado = 'B'
                            AND det.fecha_aplicacion BETWEEN :fecha_desde_totales AND :fecha_hasta_totales_rango
                        GROUP BY det.id_cuenta, ca.codigo_cuenta
                    )
                    SELECT
                        id_detalle,
                        id_asiento,
                        numero_asiento,
                        id_cuenta,
                        descripcion,
                        fecha_aplicacion,
                        montoDebe,
                        montoHaber,
                        saldo,
                        estado,
                        fecha_carga,
                        descripcion_asiento,
                        cuenta_comp,
                        si
                    FROM (
                        SELECT UltimoRegistro.*, 'S' AS si FROM UltimoRegistro
                        UNION ALL
                        SELECT UltimoRegistroFicticio.*, 'S' AS si FROM UltimoRegistroFicticio
                        UNION ALL
                        SELECT RegistrosPrincipales.*, 'N' AS si FROM RegistrosPrincipales
                        UNION ALL
                        SELECT SaldoTotales.*, 'F' AS si FROM SaldoTotales
                    ) AS Asientos
                    ORDER BY
                        cuenta_comp ASC,
                        CASE WHEN si = 'S' THEN 0 ELSE 1 END,
                        fecha_aplicacion ASC,
                        id_detalle ASC";

            $query = $this->dbc->prepare($sql);
            $query->bindValue(':id_cuenta_desde', $idCuentaDesde, PDO::PARAM_INT);
            $query->bindValue(':id_cuenta_hasta', $idCuentaHasta, PDO::PARAM_INT);
            $query->bindValue(':fecha_desde_activas', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_hasta_activas', $fechaHasta, PDO::PARAM_STR);
            $query->bindValue(':fecha_desde_ultimos', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_desde_ficticia', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_desde_carga_ficticia', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_desde_principal', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_hasta_principal', $fechaHasta, PDO::PARAM_STR);
            $query->bindValue(':fecha_hasta_totales', $fechaHasta, PDO::PARAM_STR);
            $query->bindValue(':fecha_hasta_carga_totales', $fechaHasta, PDO::PARAM_STR);
            $query->bindValue(':fecha_desde_totales', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_hasta_totales_rango', $fechaHasta, PDO::PARAM_STR);
        } else {
            $sql = "WITH CuentaSeleccionada AS (
                        SELECT id_cuenta, codigo_cuenta
                        FROM cuentas_contables
                        WHERE id_cuenta = :id_cuenta_desde
                    ),
                    UltimoRegistro AS (
                        SELECT
                            det.id_detalle,
                            det.id_asiento,
                            COALESCE(cab.numero_asiento, cab.id_asiento) AS numero_asiento,
                            det.id_cuenta,
                            det.descripcion,
                            det.fecha_aplicacion,
                            det.debe AS montoDebe,
                            det.haber AS montoHaber,
                            det.saldo,
                            cab.estado,
                            cab.fecha_creacion AS fecha_carga,
                            cab.descripcion AS descripcion_asiento,
                            cc.codigo_cuenta AS cuenta_comp
                        FROM asientos_contables_detalle AS det
                        INNER JOIN asientos_contables AS cab
                            ON det.id_asiento = cab.id_asiento
                        INNER JOIN cuentas_contables AS cc
                            ON det.id_cuenta = cc.id_cuenta
                        INNER JOIN CuentaSeleccionada AS cs
                            ON det.id_cuenta = cs.id_cuenta
                        WHERE cab.estado = 'B'
                            AND det.fecha_aplicacion < :fecha_desde_ultimo
                        ORDER BY det.fecha_aplicacion DESC, det.id_detalle DESC
                        LIMIT 1
                    ),
                    UltimoRegistroFicticio AS (
                        SELECT
                            0 AS id_detalle,
                            0 AS id_asiento,
                            0 AS numero_asiento,
                            cs.id_cuenta,
                            '' AS descripcion,
                            DATE_SUB(:fecha_desde_ficticia, INTERVAL 1 DAY) AS fecha_aplicacion,
                            0.00 AS montoDebe,
                            0.00 AS montoHaber,
                            0.00 AS saldo,
                            'B' AS estado,
                            DATE_SUB(:fecha_desde_carga_ficticia, INTERVAL 1 DAY) AS fecha_carga,
                            '' AS descripcion_asiento,
                            cs.codigo_cuenta AS cuenta_comp
                        FROM CuentaSeleccionada AS cs
                        WHERE NOT EXISTS (SELECT 1 FROM UltimoRegistro)
                    ),
                    RegistrosPrincipales AS (
                        SELECT
                            det.id_detalle,
                            det.id_asiento,
                            COALESCE(cab.numero_asiento, cab.id_asiento) AS numero_asiento,
                            det.id_cuenta,
                            det.descripcion,
                            det.fecha_aplicacion,
                            det.debe AS montoDebe,
                            det.haber AS montoHaber,
                            det.saldo,
                            cab.estado,
                            cab.fecha_creacion AS fecha_carga,
                            cab.descripcion AS descripcion_asiento,
                            cc.codigo_cuenta AS cuenta_comp
                        FROM asientos_contables_detalle AS det
                        INNER JOIN asientos_contables AS cab
                            ON det.id_asiento = cab.id_asiento
                        INNER JOIN cuentas_contables AS cc
                            ON det.id_cuenta = cc.id_cuenta
                        INNER JOIN CuentaSeleccionada AS cs
                            ON det.id_cuenta = cs.id_cuenta
                        WHERE cab.estado = 'B'
                            AND det.fecha_aplicacion BETWEEN :fecha_desde_principal AND :fecha_hasta_principal
                    ),
                    SaldoTotales AS (
                        SELECT
                            0 AS id_detalle,
                            0 AS id_asiento,
                            0 AS numero_asiento,
                            det.id_cuenta,
                            '' AS descripcion,
                            DATE_ADD(:fecha_hasta_totales, INTERVAL 1 DAY) AS fecha_aplicacion,
                            SUM(det.debe) AS montoDebe,
                            SUM(det.haber) AS montoHaber,
                            SUM(det.debe) - SUM(det.haber) AS saldo,
                            'B' AS estado,
                            DATE_ADD(:fecha_hasta_carga_totales, INTERVAL 1 DAY) AS fecha_carga,
                            '' AS descripcion_asiento,
                            cc.codigo_cuenta AS cuenta_comp
                        FROM asientos_contables_detalle AS det
                        INNER JOIN asientos_contables AS cab
                            ON det.id_asiento = cab.id_asiento
                        INNER JOIN cuentas_contables AS cc
                            ON det.id_cuenta = cc.id_cuenta
                        INNER JOIN CuentaSeleccionada AS cs
                            ON det.id_cuenta = cs.id_cuenta
                        WHERE cab.estado = 'B'
                            AND det.fecha_aplicacion BETWEEN :fecha_desde_totales AND :fecha_hasta_totales_cuenta
                        GROUP BY det.id_cuenta, cc.codigo_cuenta
                    )
                    SELECT
                        id_detalle,
                        id_asiento,
                        numero_asiento,
                        id_cuenta,
                        descripcion,
                        fecha_aplicacion,
                        montoDebe,
                        montoHaber,
                        saldo,
                        estado,
                        fecha_carga,
                        descripcion_asiento,
                        cuenta_comp,
                        si
                    FROM (
                        SELECT UltimoRegistro.*, 'S' AS si FROM UltimoRegistro
                        UNION ALL
                        SELECT UltimoRegistroFicticio.*, 'S' AS si FROM UltimoRegistroFicticio
                        UNION ALL
                        SELECT RegistrosPrincipales.*, 'N' AS si FROM RegistrosPrincipales
                        UNION ALL
                        SELECT SaldoTotales.*, 'F' AS si FROM SaldoTotales
                    ) AS Asientos
                    ORDER BY
                        CASE WHEN si = 'S' THEN 0 ELSE 1 END,
                        fecha_aplicacion ASC,
                        id_detalle ASC";

            $query = $this->dbc->prepare($sql);
            $query->bindValue(':id_cuenta_desde', $idCuentaDesde, PDO::PARAM_INT);
            $query->bindValue(':fecha_desde_ultimo', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_desde_ficticia', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_desde_carga_ficticia', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_desde_principal', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_hasta_principal', $fechaHasta, PDO::PARAM_STR);
            $query->bindValue(':fecha_hasta_totales', $fechaHasta, PDO::PARAM_STR);
            $query->bindValue(':fecha_hasta_carga_totales', $fechaHasta, PDO::PARAM_STR);
            $query->bindValue(':fecha_desde_totales', $fechaDesde, PDO::PARAM_STR);
            $query->bindValue(':fecha_hasta_totales_cuenta', $fechaHasta, PDO::PARAM_STR);
        }

        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }


    // Modificacion de asientos
    public function actualizar_asiento_cabecera($data)
    {
        $sql = "UPDATE asientos_contables
                SET ejercicio = :ejercicio,
                    fecha_aplicacion = :fecha_aplicacion,
                    descripcion = :descripcion,
                    nota = :nota,
                    usuario_modificacion = :usuario_modificacion,
                    fecha_modificacion = :fecha_modificacion
                WHERE id_asiento = :id_asiento";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':ejercicio', $data['ejercicio']);
        $query->bindValue(':fecha_aplicacion', $data['fecha_aplicacion_new']);
        $query->bindValue(':descripcion', $data['descripcion']);
        $query->bindValue(':nota', $data['nota']);
        $query->bindValue(':usuario_modificacion', $_SESSION['auth_data']['username']);
        $query->bindValue(':fecha_modificacion', date("Y-m-d H:i:s"));
        $query->bindValue(':id_asiento', $data['id_asiento']);

        if ($query->execute()) {
            return $query->rowCount() > 0;
        } else {
            return false;
        }
    }

    public function actualizar_descripcion_asiento_detalle($id_asiento, $descripcion)
    {
        $sql = "UPDATE asientos_contables_detalle
                SET descripcion = :descripcion
                WHERE id_asiento = :id_asiento";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':descripcion', $descripcion, PDO::PARAM_STR);
        $query->bindValue(':id_asiento', $id_asiento, PDO::PARAM_INT);

        if ($query->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function  actualizar_asiento_detalle($data, $id_asiento)
    {

        $sql = "UPDATE asientos_contables_detalle
                SET id_cuenta = :id_cuenta,
                    descripcion = :descripcion,
                    fecha_aplicacion = :fecha_aplicacion,
                    debe = :debe,
                    haber = :haber,
                    usuario_modificacion = :usr_mod,
                    fecha_modificacion = :fecha_mod
                    WHERE id_detalle = :id_detalle AND id_asiento = :id_asiento";
        $query = $this->dbc->prepare($sql);
        $query->bindParam(':id_cuenta', $data['id_cuenta_new'], PDO::PARAM_INT);
        $query->bindParam(':descripcion', $data['descripcion'], PDO::PARAM_STR);
        $query->bindPAram(':fecha_aplicacion', $data['fecha_aplicacion_new'], PDO::PARAM_STR);
        $query->bindParam(':debe', $data['debe'], PDO::PARAM_STR);
        $query->bindParam(':haber', $data['haber'], PDO::PARAM_STR);
        $query->bindParam(':usr_mod', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_mod', date("Y-m-d"), PDO::PARAM_STR);
        $query->bindParam(':id_detalle', $data['id_detalle'], PDO::PARAM_INT);
        $query->bindValue(':id_asiento', $id_asiento, PDO::PARAM_INT);

        if ($query->execute()) {
            return $query->rowCount() > 0;
        } else {
            return false;
        }
    }

    public function actualizar_fecha_asiento_detalle($id_asiento, $id_detalle, $fecha_aplicacion)
    {
        $sql = "UPDATE asientos_contables_detalle
                SET fecha_aplicacion = :fecha_aplicacion,
                    usuario_modificacion = :usr_mod,
                    fecha_modificacion = :fecha_mod
                WHERE id_detalle = :id_detalle AND id_asiento = :id_asiento";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':fecha_aplicacion', $fecha_aplicacion, PDO::PARAM_STR);
        $query->bindValue(':usr_mod', $_SESSION['auth_data']['username'], PDO::PARAM_STR);
        $query->bindValue(':fecha_mod', date("Y-m-d"), PDO::PARAM_STR);
        $query->bindValue(':id_detalle', $id_detalle, PDO::PARAM_INT);
        $query->bindValue(':id_asiento', $id_asiento, PDO::PARAM_INT);

        if ($query->execute()) {
            return $query->rowCount() > 0;
        } else {
            return false;
        }
    }

    public function eliminar_asiento_detalle($id_detalle, $id_asiento)
    {
        $sql = "DELETE FROM asientos_contables_detalle WHERE id_detalle = :id_detalle AND id_asiento = :id_asiento";
        $query = $this->dbc->prepare($sql);
        $query->bindValue(':id_detalle', $id_detalle, PDO::PARAM_INT);
        $query->bindValue(':id_asiento', $id_asiento, PDO::PARAM_INT);

        if ($query->execute()) {
            return $query->rowCount() > 0;
        } else {
            return false;
        }
    }
}
