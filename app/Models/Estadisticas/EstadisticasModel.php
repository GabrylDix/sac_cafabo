<?php

namespace App\Models\Estadisticas;

use App\Helper\LoggerHelper;

use PDO;
use DateTime;

class EstadisticasModel
{
    private $dbc;
    private $directorio = "estadisticas";

    function __construct($db)
    {
        $this->dbc = $db;
    }

    public function get_farmacias(){
        $sql = "SELECT 
                    COUNT(*) AS total,
                    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) AS activas,
                    SUM(CASE WHEN activo = 0 THEN 1 ELSE 0 END) AS inactivas
                FROM padron_farmacias;";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function get_convenios(){
        $sql = "SELECT 
                    COUNT(*) AS total,
                    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) AS activos,
                    SUM(CASE WHEN activo = 0 THEN 1 ELSE 0 END) AS inactivos
                FROM padron_convenios;";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function get_presentaciones(){
        $sql = "SELECT 
                    COUNT(*) AS total
                FROM presentaciones
                WHERE estado <> 'E';";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function get_top_convenios_facturados(){
        $sql = "SELECT 
                    pc.id_convenio,
                    pc.nombre,
                    sum(total_a_pagar) AS total
                FROM presentaciones AS p
                INNER JOIN padron_convenios AS pc
                    ON p.convenio_id = pc.id_convenio
                GROUP BY p.convenio_id
                ORDER BY total DESC
                LIMIT 5";
        $query = $this->dbc->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function get_top_farmacias_facturadas(){
        $sql = "SELECT  
                    id_farmacia,
                    nombre,
                    sum(total_a_pagar) AS total
                FROM presentaciones_farmacias
                GROUP BY id_farmacia
                ORDER BY total DESC
                LIMIT 5";
        $query = $this->dbc->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function presentaciones_convenios(){
        $sql = "SELECT 
                    CONCAT (c.id_convenio, ' - ', c.nombre) AS label,
                    COUNT(p.id_presentacion) AS value
                FROM presentaciones AS p
                JOIN padron_convenios c 
                    ON c.id_convenio = p.convenio_id
                WHERE p.estado != 'E'
                GROUP BY p.convenio_id, c.nombre
                ORDER BY value DESC
                LIMIT 5";
        $query = $this->dbc->prepare($sql);
        $query->execute();
        $datos = $query->fetchAll(PDO::FETCH_ASSOC);

        $labels = [];
        $values = [];

        foreach ($datos as $row) {
            $labels[] = $row['label'];
            $values[] = (int)$row['value'];
        }

        return [
            'labels' => $labels,
            'values' => $values
        ];
    }

    public function get_ingresos(){
        $sql = "SELECT 
                    DATE_FORMAT(fecha_comprobante, '%Y-%m') AS periodo,
                    SUM(total) AS total
                FROM recibos_cobranza
                WHERE estado != 'E'
                  AND fecha_comprobante >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01')
                GROUP BY periodo
                ORDER BY periodo ASC";
        $query = $this->dbc->prepare($sql);
        $query->execute();
        $ingresos = $query->fetchAll(PDO::FETCH_ASSOC);

        $datos = [];
        foreach ($ingresos as $row) {
            $datos[$row['periodo']] = (float)$row['total'];
        }

        $labels = [];
        $values = [];

        setlocale(LC_TIME, 'es_AR.UTF-8');

        for ($i = 5; $i >= 0; $i--) {
            $fecha = new DateTime();
            $fecha->modify("-$i months");

            $periodo = $fecha->format('Y-m');
            $label = strftime('%b %Y', $fecha->getTimestamp());
            $labels[] = $label;
            $values[] = $datos[$periodo] ?? 0;
        }

        return [
            'labels' => $labels,
            'values' => $values
        ];
    }

}
