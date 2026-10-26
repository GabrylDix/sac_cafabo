const ClassFormatos = window.Formatos;

$(document).ready(function () {
    const datatableListadoLibroMayor = $("#datatable_listado_libro_mayor");
    const selectCuentaDesde = $("#id_cuenta_desde");
    const selectCuentaHasta = $("#id_cuenta_hasta");

    const CHOICES_CONFIG = {
        searchEnabled: true,
        searchFloor: 0,
        searchResultLimit: 9999,
        searchPlaceholderValue: "Buscar...",
        itemSelectText: "Seleccionar",
        noResultsText: "No se encontraron resultados",
        noChoicesText: "No hay opciones disponibles",
        shouldSort: false,
        position: "bottom",
        removeItemButton: false,
        searchChoices: false,
    };

    let choicesCuentaDesde = null;
    let choicesCuentaHasta = null;
    let timeoutBusquedaCuentaDesde = null;
    let timeoutBusquedaCuentaHasta = null;
    let cuentasContablesCache = [];

    inicializar_fechas();
    inicializar_selects();
    buscar_cuentas_contables("", "desde");
    buscar_cuentas_contables("", "hasta");

    $("#btn_filtrar_movimientos").on("click", function () {
        extraer_libro_mayor();
    });

    $("#rango_cuentas_switch").on("change", function () {
        const habilitado = $(this).is(":checked");

        $("#campo_cuenta_hasta").toggleClass("d-none", !habilitado);
        $("#label_cuenta_desde").text(habilitado ? "Desde cuenta" : "Cuenta");
        selectCuentaHasta.prop("disabled", !habilitado);

        if (choicesCuentaHasta) {
            if (habilitado) {
                choicesCuentaHasta.enable();
            } else {
                choicesCuentaHasta.disable();
            }
        }

        if (!habilitado) {
            limpiar_seleccion_cuenta(choicesCuentaHasta, selectCuentaHasta);
        } else {
            buscar_cuentas_contables("", "hasta");
        }
    });

    function inicializar_fechas() {
        const hoy = new Date();
        const inicioAnio = new Date(hoy.getFullYear(), 0, 1);
        const finMesActual = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        $("#id_fecha_desde").val(formatear_fecha_input(inicioAnio));
        $("#id_fecha_hasta").val(formatear_fecha_input(finMesActual));
    }

    function inicializar_selects() {
        if (typeof Choices !== "undefined") {
            choicesCuentaDesde = new Choices(selectCuentaDesde[0], {
                ...CHOICES_CONFIG,
                placeholderValue: "Seleccione una cuenta",
                searchPlaceholderValue: "Buscar cuenta...",
            });

            choicesCuentaHasta = new Choices(selectCuentaHasta[0], {
                ...CHOICES_CONFIG,
                placeholderValue: "Seleccione una cuenta",
                searchPlaceholderValue: "Buscar cuenta...",
            });

            choicesCuentaHasta.disable();

            selectCuentaDesde.on("search", function (e) {
                clearTimeout(timeoutBusquedaCuentaDesde);
                timeoutBusquedaCuentaDesde = setTimeout(function () {
                    buscar_cuentas_contables(String(e?.detail?.value || "").trim(), "desde");
                }, 250);
            });

            selectCuentaDesde.on("change choice", function () {
                limpiar_seleccion_cuenta(choicesCuentaHasta, selectCuentaHasta);

                if ($("#rango_cuentas_switch").is(":checked")) {
                    buscar_cuentas_contables("", "hasta");
                }
            });

            selectCuentaHasta.on("search", function (e) {
                clearTimeout(timeoutBusquedaCuentaHasta);
                timeoutBusquedaCuentaHasta = setTimeout(function () {
                    buscar_cuentas_contables(String(e?.detail?.value || "").trim(), "hasta");
                }, 250);
            });
        } else {
            selectCuentaDesde.append('<option value="">Seleccione una cuenta...</option>');
            selectCuentaHasta.append('<option value="">Seleccione una cuenta...</option>');
        }
    }

    function buscar_cuentas_contables(termino, destino) {
        const codigoMinimo = destino === "hasta" ? obtener_codigo_minimo_hasta() : "";

        if (destino === "hasta" && !codigoMinimo) {
            cargar_select_cuentas(destino, [], "");
            return;
        }

        $.ajax({
            data: {
                backend: destino === "hasta" ? "sugerencias_cuentas_contables_con_minimo" : "sugerencias_cuentas_contables",
                termino: termino,
                minimo: codigoMinimo,
            },
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                const cuentas = normalizar_respuesta_cuentas(response);
                fusionar_cuentas_en_cache(cuentas);
                cargar_select_cuentas(destino, cuentas, destino === "hasta" ? selectCuentaHasta.val() : selectCuentaDesde.val());
            },
            error: function () {
                cargar_select_cuentas(destino, [], "");
            },
        });
    }

    function cargar_select_cuentas(destino, cuentas, valorSeleccionado = "") {
        const select = destino === "hasta" ? selectCuentaHasta : selectCuentaDesde;
        const choices = destino === "hasta" ? choicesCuentaHasta : choicesCuentaDesde;
        const cuentasDisponibles = destino === "hasta" ? filtrar_cuentas_hasta(cuentas) : Array.isArray(cuentas) ? cuentas : [];
        const existeCuentaSeleccionada = cuentasDisponibles.some(function (cuenta) {
            return String(cuenta.id_cuenta) === String(valorSeleccionado);
        });

        if (choices) {
            choices.clearChoices();
            choices.setChoices(
                [
                    { value: "", label: "Seleccione una cuenta...", selected: !existeCuentaSeleccionada },
                    ...cuentasDisponibles.map(function (cuenta) {
                        return {
                            value: String(cuenta.id_cuenta),
                            label: cuenta.label || construir_descripcion_cuenta_contable(cuenta),
                            selected: String(cuenta.id_cuenta) === valorSeleccionado,
                        };
                    }),
                ],
                "value",
                "label",
                true,
            );
            return;
        }

        select.empty().append('<option value="">Seleccione una cuenta...</option>');
        cuentasDisponibles.forEach(function (cuenta) {
            select.append(`<option value="${cuenta.id_cuenta}">${cuenta.label || construir_descripcion_cuenta_contable(cuenta)}</option>`);
        });
        select.val(existeCuentaSeleccionada ? String(valorSeleccionado) : "");
    }

    function normalizar_respuesta_cuentas(response) {
        if (response && response.success && Array.isArray(response.data)) {
            return response.data;
        }

        return Array.isArray(response) ? response : [];
    }

    function fusionar_cuentas_en_cache(cuentas) {
        const cuentasPorId = new Map(
            (Array.isArray(cuentasContablesCache) ? cuentasContablesCache : []).map(function (cuenta) {
                return [String(cuenta.id_cuenta), cuenta];
            }),
        );

        (Array.isArray(cuentas) ? cuentas : []).forEach(function (cuenta) {
            cuentasPorId.set(String(cuenta.id_cuenta), cuenta);
        });

        cuentasContablesCache = Array.from(cuentasPorId.values()).sort(function (a, b) {
            return String(a.codigo_cuenta || "").localeCompare(String(b.codigo_cuenta || ""), "es");
        });
    }

    function obtener_cuenta_contable(idCuenta) {
        return cuentasContablesCache.find(function (cuenta) {
            return String(cuenta.id_cuenta) === String(idCuenta);
        });
    }

    function construir_descripcion_cuenta_contable(cuenta) {
        return [cuenta.codigo_cuenta, cuenta.nombre_cuenta].filter(Boolean).join(" - ");
    }

    function filtrar_cuentas_hasta(cuentas) {
        const lista = Array.isArray(cuentas) ? cuentas : [];
        const codigoMinimo = obtener_codigo_minimo_hasta();

        if (!codigoMinimo) {
            return lista;
        }

        return lista.filter(function (cuenta) {
            return String(cuenta.codigo_cuenta || "") >= String(codigoMinimo);
        });
    }

    function obtener_codigo_minimo_hasta() {
        const cuentaDesde = obtener_cuenta_contable(selectCuentaDesde.val());
        return cuentaDesde && cuentaDesde.codigo_cuenta ? String(cuentaDesde.codigo_cuenta) : "";
    }

    function limpiar_seleccion_cuenta(choices, select) {
        if (choices) {
            choices.removeActiveItems();
            choices.setChoiceByValue("");
        }

        select.val("");
    }

    function extraer_libro_mayor() {
        const datos = obtener_filtros();

        if (!validar_filtros(datos)) {
            return;
        }

        $("#myAlert").modal("show");

        $.ajax({
            data: {
                backend: "extraer_libro_mayor",
                datos: datos,
            },
            url: "app/Controllers/Reportes/Contable/Reportes_contables_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    $("#mensaje_libro_mayor").addClass("d-none");
                    $("#div_tabla").removeClass("d-none");
                    cargar_tabla_libro_mayor(response.data || []);
                    return;
                }

                Swal.fire({
                    icon: response?.alert?.icon || "error",
                    title: response?.alert?.title || "Error",
                    text: response?.message || "No se pudo obtener el libro mayor.",
                });
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo comunicar con el servidor.",
                });
            },
            complete: function () {
                $("#myAlert").modal("hide");
            },
        });
    }

    function obtener_filtros() {
        return {
            id_cuenta_desde: selectCuentaDesde.val(),
            id_cuenta_hasta: $("#rango_cuentas_switch").is(":checked") ? selectCuentaHasta.val() : "",
            fecha_desde: $("#id_fecha_desde").val(),
            fecha_hasta: $("#id_fecha_hasta").val(),
        };
    }

    function validar_filtros(datos) {
        if (!datos.id_cuenta_desde) {
            Swal.fire({ icon: "warning", title: "Cuenta requerida", text: "Seleccione una cuenta inicial." });
            return false;
        }

        if (!datos.fecha_desde || !datos.fecha_hasta) {
            Swal.fire({ icon: "warning", title: "Fechas requeridas", text: "Complete el rango de fechas." });
            return false;
        }

        if (datos.fecha_desde > datos.fecha_hasta) {
            Swal.fire({ icon: "warning", title: "Fechas inválidas", text: "La fecha desde no puede ser mayor a la fecha hasta." });
            return false;
        }

        if ($("#rango_cuentas_switch").is(":checked")) {
            if (!datos.id_cuenta_hasta) {
                Swal.fire({ icon: "warning", title: "Cuenta requerida", text: "Seleccione la cuenta hasta." });
                return false;
            }

            const cuentaDesde = obtener_cuenta_contable(datos.id_cuenta_desde);
            const cuentaHasta = obtener_cuenta_contable(datos.id_cuenta_hasta);

            if (cuentaDesde && cuentaHasta && cuentaDesde.codigo_cuenta > cuentaHasta.codigo_cuenta) {
                Swal.fire({ icon: "warning", title: "Rango inválido", text: "La cuenta desde no puede ser mayor a la cuenta hasta." });
                return false;
            }
        }

        return true;
    }

    function cargar_tabla_libro_mayor(asientos) {
        const tabla = datatableListadoLibroMayor.DataTable({
            destroy: true,
            data: asientos,
            autoWidth: false,
            columns: [
                { data: "cuenta_comp", defaultContent: "-", width: "80px" },
                {
                    data: null,
                    width: "70px",
                    className: "text-center",
                    render: function (data) {
                        return data.si === "N" ? data.numero_asiento || data.id_asiento || "" : "";
                    },
                },
                {
                    data: null,
                    width: "90px",
                    render: function (data) {
                        return data.si === "N" ? formatFecha(data.fecha_aplicacion) : "";
                    },
                },
                {
                    data: null,
                    width: "180px",
                    render: function (data) {
                        return data.si === "N" ? data.descripcion || "" : "";
                    },
                },
                {
                    data: null,
                    width: "260px",
                    render: function (data) {
                        if (data.si === "S") {
                            return `SALDO INICIAL CUENTA ${data.cuenta_comp}`;
                        }

                        if (data.si === "F") {
                            return `SALDO FINAL CUENTA ${data.cuenta_comp}`;
                        }

                        return data.descripcion_asiento || "";
                    },
                },
                {
                    data: null,
                    width: "110px",
                    className: "text-end",
                    render: function (data) {
                        return data.si === "S" ? "" : formatMoneda(data.montoDebe);
                    },
                },
                {
                    data: null,
                    width: "110px",
                    className: "text-end",
                    render: function (data) {
                        return data.si === "S" ? "" : formatMoneda(data.montoHaber);
                    },
                },
                {
                    data: null,
                    width: "110px",
                    className: "text-end",
                    render: function (data) {
                        return formatMoneda(data.saldo);
                    },
                },
            ],
            createdRow: function (row, data) {
                if (data.si === "S" || data.si === "F") {
                    $("td", row).eq(0).attr("colspan", 4).css("text-align", "left");
                    $("td", row).eq(1).remove();
                    $("td", row).eq(1).remove();
                    $("td", row).eq(1).remove();
                }
            },
            rowCallback: function (row, data) {
                if (data.si === "S") {
                    $(row).addClass("sac-libro-mayor__row--opening");
                }

                if (data.si === "F") {
                    $(row).addClass("sac-libro-mayor__row--closing");
                }
            },
            language: {
                url: "public/json/Spanish.json",
                emptyTable: "No hay movimientos para los filtros seleccionados.",
            },
            pageLength: 100,
            lengthMenu: [
                [10, 20, 50, -1],
                [10, 20, 50, "Todos"],
            ],
            serching: false,
            responsive: false,
            info: false,
            ordering: false,
            searching: false,
            lengthChange: false,
        });

        tabla.columns.adjust().draw(false);
    }

    function formatear_fecha_input(fecha) {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        return `${anio}-${mes}-${dia}`;
    }

    function formatNumero(value) {
        if (ClassFormatos && typeof ClassFormatos.formatoNumero === "function") {
            return ClassFormatos.formatoNumero(value, 2);
        }

        return new Intl.NumberFormat("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value) || 0);
    }

    function formatMoneda(value) {
        if (ClassFormatos && typeof ClassFormatos.formatoMoneda === "function") {
            return ClassFormatos.formatoMoneda(value);
        }

        return `$ ${formatNumero(value)}`;
    }

    function formatFecha(value) {
        if (!value) {
            return "";
        }

        const fecha = String(value).split(" ")[0];
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return value;
        }

        const partes = fecha.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
});
