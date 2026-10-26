const ClassFormatos = window.Formatos;
$(document).ready(function () {
    // ******************************* REFERENCIAS DOM ***************************************
    const contenedor_stats = $("#home_stats_cards");

    // ******************************* VARIABLES DE ESTADO ***********************************
    const registro_graficos = {};
    let datos_dashboard = {};

    // ******************************* INICIALIZACION ****************************************
    extraer_datos_home();

    // **************************************************************************************
    // ******************************* DATOS PRINCIPALES *************************************
    function extraer_datos_home() {
        $.ajax({
            type: "POST",
            url: "app/Controllers/Estadisticas/Estadisticas_backend.php",
            data: {
                backend: "home",
            },
            dataType: "json",
            success: function (respuesta) {
                datos_dashboard = respuesta && respuesta.data ? respuesta.data : {};
                renderizar_dashboard(datos_dashboard);
            },
            error: function () {
                mostrarErrorConexion("No se pudo comunicar con el servidor para actualizar el dashboard.");
            },
        });
    }

    // **************************************************************************************
    // ************************************** STATS *****************************************
    function construir_items_stats(datos) {
        const farmacia_top = Array.isArray(datos.top_farmacias_facturadas) ? datos.top_farmacias_facturadas[0] : null;

        return [
            {
                titulo: "Farmacias activas",
                valor: ClassFormatos.formatoEntero(datos.farmacias?.activas),
                detalle: "Cantidad de farmacias actualmente activas en el sistema.",
                icono: "bi bi-shop",
                tendencia: `${ClassFormatos.formatoEntero(datos.farmacias?.inactivas)} inactivas sobre ${ClassFormatos.formatoEntero(datos.farmacias?.total)} totales`,
                clase_tendencia: Number(datos.farmacias?.inactivas || 0) > 0 ? "text-warning" : "text-success",
            },
            {
                titulo: "Convenios activos",
                valor: ClassFormatos.formatoEntero(datos.convenios?.activos),
                detalle: "Convenios vigentes disponibles para la operatoria actual.",
                icono: "bi bi-people",
                tendencia: `${ClassFormatos.formatoEntero(datos.convenios?.inactivos)} inactivos sobre ${ClassFormatos.formatoEntero(datos.convenios?.total)} totales`,
                clase_tendencia: Number(datos.convenios?.inactivos || 0) > 0 ? "text-warning" : "text-success",
            },
            {
                titulo: "Presentaciones",
                valor: ClassFormatos.formatoEntero(datos.presentaciones?.total),
                detalle: "Presentaciones registradas segun los datos reales disponibles.",
                icono: "bi bi-file-earmark-text",
                tendencia: "",
                clase_tendencia: "text-primary",
            },
            {
                titulo: "Top farmacia facturada",
                valor: farmacia_top ? ClassFormatos.formatoMoneda(farmacia_top.total) : ClassFormatos.formatoMoneda(0),
                detalle: farmacia_top ? farmacia_top.nombre : "Sin datos de facturacion para mostrar.",
                icono: "bi bi-cash-stack",
                tendencia: "",
                clase_tendencia: "text-info",
            },
        ];
    }

    function renderizar_stats(datos) {
        const tarjetas = construir_items_stats(datos)
            .map(function (item_stat) {
                return `
                <div class="col-12 col-md-6 col-xl-3">
                    <div class="card home-kpi-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                                <div>
                                    <p class="text-muted text-uppercase fw-semibold fs-12 mb-2">${item_stat.titulo}</p>
                                    <h3 class="mb-1">${item_stat.valor}</h3>
                                </div>
                                <span class="home-kpi-icon">
                                    <i class="${item_stat.icono}"></i>
                                </span>
                            </div>
                            <p class="text-muted mb-3">${item_stat.detalle}</p>
                            <span class="home-kpi-trend ${item_stat.clase_tendencia}">${item_stat.tendencia}</span>
                        </div>
                    </div>
                </div>`;
            })
            .join("");

        contenedor_stats.html(tarjetas);
    }

    // **************************************************************************************
    // ************************************* GRAFICOS ****************************************
    function renderizar_grafico(clave, selector, opciones) {
        if (registro_graficos[clave]) {
            registro_graficos[clave].destroy();
        }

        const elemento = document.querySelector(selector);

        if (!elemento || typeof ApexCharts === "undefined") {
            return;
        }

        registro_graficos[clave] = new ApexCharts(elemento, opciones);
        registro_graficos[clave].render();
    }

    function limpiar_grafico(clave, selector) {
        if (registro_graficos[clave]) {
            registro_graficos[clave].destroy();
            delete registro_graficos[clave];
        }

        const elemento = document.querySelector(selector);

        if (elemento) {
            elemento.innerHTML = "";
        }
    }

    function obtener_datos_grafico_ingresos(datos) {
        const facturacion = datos.facturacion || {};
        const ingresos = facturacion.ingresos || {};
        const categorias = Array.isArray(ingresos.labels) ? ingresos.labels : [];
        const valores = Array.isArray(ingresos.values)
            ? ingresos.values.map(function (valor) {
                  return Number(valor || 0);
              })
            : [];

        if (!categorias.length || !valores.length) {
            return null;
        }

        return {
            categorias,
            series: [
                {
                    name: "Ingresos",
                    data: valores,
                },
            ],
        };
    }

    function obtener_maximo_eje_y(series) {
        const valores = (series || []).flatMap(function (serie) {
            return Array.isArray(serie.data) ? serie.data : [];
        });

        const maximo = Math.max.apply(
            null,
            valores.map(function (valor) {
                return Number(valor || 0);
            }),
        );

        if (!isFinite(maximo) || maximo <= 0) {
            return 10;
        }

        return Math.ceil(maximo * 1.15);
    }

    function renderizar_grafico_actividad_periodos(periodo) {
        const graficos_periodo = periodo.charts || {};
        const grafico_actividad = graficos_periodo.activity || {};
        const series_actividad = grafico_actividad.series || [];

        renderizar_grafico("actividad", "#home_grafico_actividad", {
            chart: {
                type: "line",
                height: 320,
                toolbar: { show: false },
            },
            series: series_actividad,
            colors: ["#0ab39c"],
            stroke: {
                curve: "smooth",
                width: 4,
            },
            markers: {
                size: 5,
                strokeWidth: 0,
                hover: {
                    sizeOffset: 2,
                },
            },
            dataLabels: { enabled: false },
            xaxis: { categories: grafico_actividad.categories || [] },
            grid: { borderColor: "#eef1f7" },
            legend: { position: "top", horizontalAlign: "left" },
            yaxis: {
                min: 0,
                max: obtener_maximo_eje_y(series_actividad),
                labels: {
                    formatter: function (valor) {
                        return ClassFormatos.formatoMillones(valor);
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (valor) {
                        return ClassFormatos.formatoMillonesTexto(valor);
                    },
                },
            },
        });
    }

    function renderizar_graficos_periodos(periodo) {
        const graficos_periodo = periodo.charts || {};
        const grafico_convenios = graficos_periodo.agreements || {};
        const grafico_farmacias = graficos_periodo.pharmacies || {};
        const grafico_presentaciones = graficos_periodo.presentations || {};

        renderizar_grafico_actividad_periodos(periodo);

        renderizar_grafico("convenios", "#home_grafico_convenios", {
            chart: {
                type: "bar",
                height: 300,
                toolbar: { show: false },
            },
            series: grafico_convenios.series || [],
            colors: ["#405189"],
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 4,
                    barHeight: "52%",
                },
            },
            dataLabels: { enabled: false },
            grid: { borderColor: "#eef1f7" },
            legend: { position: "top", horizontalAlign: "left" },
            xaxis: {
                categories: grafico_convenios.categories || [],
                labels: {
                    formatter: function (valor) {
                        return ClassFormatos.formatoMillones(valor);
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (valor) {
                        return ClassFormatos.formatoMillonesTexto(valor);
                    },
                },
            },
        });

        renderizar_grafico("farmacias", "#home_grafico_farmacias", {
            chart: {
                type: "bar",
                height: 300,
                toolbar: { show: false },
            },
            series: grafico_farmacias.series || [],
            colors: ["#0ab39c"],
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 4,
                    barHeight: "52%",
                },
            },
            dataLabels: { enabled: false },
            grid: { borderColor: "#eef1f7" },
            legend: { position: "top", horizontalAlign: "left" },
            xaxis: {
                categories: grafico_farmacias.categories || [],
                labels: {
                    formatter: function (valor) {
                        return ClassFormatos.formatoMillones(valor);
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (valor) {
                        return ClassFormatos.formatoMillonesTexto(valor);
                    },
                },
            },
        });

        renderizar_grafico("presentaciones", "#home_grafico_presentaciones", {
            chart: {
                type: "donut",
                height: 300,
            },
            series: grafico_presentaciones.series || [],
            labels: grafico_presentaciones.categories || [],
            colors: ["#405189", "#0ab39c", "#f7b84b", "#299cdb", "#f06548"],
            legend: { position: "bottom" },
            dataLabels: { enabled: false },
            plotOptions: {
                pie: {
                    donut: {
                        size: "68%",
                    },
                },
            },
            stroke: { width: 0 },
        });
    }

    function renderizar_graficos(datos) {
        if (typeof datos === "string" && datos_dashboard.periods && datos_dashboard.periods[datos]) {
            renderizar_graficos_periodos(datos_dashboard.periods[datos]);
            return;
        }

        const top_convenios = Array.isArray(datos.top_convenios_facturados) ? datos.top_convenios_facturados : [];
        const top_farmacias = Array.isArray(datos.top_farmacias_facturadas) ? datos.top_farmacias_facturadas : [];
        const presentaciones_convenios = datos.presentaciones_convenios || {};
        const labels_presentaciones = Array.isArray(presentaciones_convenios.labels) ? presentaciones_convenios.labels : [];
        const valores_presentaciones = Array.isArray(presentaciones_convenios.values) ? presentaciones_convenios.values : [];
        const datos_ingresos = obtener_datos_grafico_ingresos(datos);

        if (datos_ingresos) {
            const series_ingresos = datos_ingresos.series || [];

            renderizar_grafico("actividad", "#home_grafico_actividad", {
                chart: {
                    type: "line",
                    height: 320,
                    toolbar: { show: false },
                },
                series: series_ingresos,
                colors: ["#0ab39c"],
                stroke: {
                    curve: "smooth",
                    width: 4,
                },
                markers: {
                    size: 5,
                    strokeWidth: 0,
                    hover: {
                        sizeOffset: 2,
                    },
                },
                dataLabels: { enabled: false },
                xaxis: { categories: datos_ingresos.categorias },
                grid: { borderColor: "#eef1f7" },
                legend: { position: "top", horizontalAlign: "left" },
                yaxis: {
                    min: 0,
                    max: obtener_maximo_eje_y(series_ingresos),
                    labels: {
                        formatter: function (valor) {
                            return ClassFormatos.formatoMonedaCompacta(valor);
                        },
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (valor) {
                            return ClassFormatos.formatoMoneda(valor);
                        },
                    },
                },
            });
        } else {
            limpiar_grafico("actividad", "#home_grafico_actividad");
        }

        if (top_convenios.length) {
            renderizar_grafico("convenios", "#home_grafico_convenios", {
                chart: {
                    type: "bar",
                    height: 300,
                    toolbar: { show: false },
                },
                series: [
                    {
                        name: "Facturado",
                        data: top_convenios.map(function (convenio) {
                            return Number(convenio.total || 0);
                        }),
                    },
                ],
                colors: ["#405189"],
                plotOptions: {
                    bar: {
                        horizontal: true,
                        borderRadius: 4,
                        barHeight: "52%",
                    },
                },
                dataLabels: { enabled: false },
                grid: { borderColor: "#eef1f7" },
                legend: { position: "top", horizontalAlign: "left" },
                xaxis: {
                    categories: top_convenios.map(function (convenio) {
                        return convenio.nombre;
                    }),
                    labels: {
                        formatter: function (valor) {
                            return ClassFormatos.formatoMonedaCompacta(valor);
                        },
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (valor) {
                            return ClassFormatos.formatoMoneda(valor);
                        },
                    },
                },
            });
        } else {
            limpiar_grafico("convenios", "#home_grafico_convenios");
        }

        if (top_farmacias.length) {
            renderizar_grafico("farmacias", "#home_grafico_farmacias", {
                chart: {
                    type: "bar",
                    height: 300,
                    toolbar: { show: false },
                },
                series: [
                    {
                        name: "Facturado",
                        data: top_farmacias.map(function (farmacia) {
                            return Number(farmacia.total || 0);
                        }),
                    },
                ],
                colors: ["#0ab39c"],
                plotOptions: {
                    bar: {
                        horizontal: true,
                        borderRadius: 4,
                        barHeight: "52%",
                    },
                },
                dataLabels: { enabled: false },
                grid: { borderColor: "#eef1f7" },
                legend: { position: "top", horizontalAlign: "left" },
                xaxis: {
                    categories: top_farmacias.map(function (farmacia) {
                        return farmacia.nombre;
                    }),
                    labels: {
                        formatter: function (valor) {
                            return ClassFormatos.formatoMonedaCompacta(valor);
                        },
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (valor) {
                            return ClassFormatos.formatoMoneda(valor);
                        },
                    },
                },
            });
        } else {
            limpiar_grafico("farmacias", "#home_grafico_farmacias");
        }

        if (labels_presentaciones.length && valores_presentaciones.length) {
            renderizar_grafico("presentaciones", "#home_grafico_presentaciones", {
                chart: {
                    type: "donut",
                    height: 300,
                },
                series: valores_presentaciones.map(function (valor) {
                    return Number(valor || 0);
                }),
                labels: labels_presentaciones,
                colors: ["#405189", "#0ab39c", "#f7b84b", "#299cdb", "#f06548"],
                legend: { position: "bottom" },
                dataLabels: { enabled: false },
                plotOptions: {
                    pie: {
                        donut: {
                            size: "68%",
                        },
                    },
                },
                stroke: { width: 0 },
            });
        } else {
            limpiar_grafico("presentaciones", "#home_grafico_presentaciones");
        }
    }

    // **************************************************************************************
    // *********************************** DASHBOARD ****************************************
    function actualizar_hero(datos) {
        $("#home_hero_farmacias").text(ClassFormatos.formatoEntero(datos.farmacias?.activas));
        $("#home_hero_convenios").text(ClassFormatos.formatoEntero(datos.convenios?.activos));
        $("#home_hero_periodo").text("Mensual");
    }

    function renderizar_dashboard(datos) {
        actualizar_hero(datos);
        renderizar_stats(datos);
        renderizar_graficos(datos);
    }
});
