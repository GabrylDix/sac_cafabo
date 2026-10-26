$(document).ready(function () {
    // ===================================================================================
    // 1. CONFIGURACIÓN, VARIABLES Y CONSTANTES
    // ===================================================================================
    const btnAbrirModal = $("#btnLiquidarPresentaciones");
    const btnConfirmar = $("#btnConfirmarLiquidacionTotal");
    const modalLiquidacion = $("#modalLiquidacionTotal");

    const selectConvenio = $("#convenio_liquidacion_total");
    const importeLiquidacion = $("#importe_liquidacion_total");
    const campoCantidad = $("#cantidad_presentaciones_liquidacion_total");
    const campoTotalPagar = $("#total_pagar_liquidacion_total");
    const campoSaldoPendiente = $("#saldo_pendiente_liquidacion_total");
    const campoPorcentaje = $("#porcentaje_liquidacion_total");
    const campoModo = $("#modo_liquidacion_total");

    const datatable_presentaciones = $("#datatable_presentaciones");
    const datatable_recibos = $("#datatable_recibos_liquidacion_total");

    const contenedorTabla = $("#contenedor_tabla_presentaciones_total");
    const ayudaPresentaciones = $("#ayuda_presentaciones_total");
    const seccionResumen = $("#seccion_resumen_liquidacion_total");
    const seccionRecibos = $("#seccion_recibos_liquidacion_total");
    const ayudaResumen = $("#ayuda_resumen_liquidacion_total");
    const ayudaRecibos = $("#ayuda_recibos_liquidacion_total");

    let choicesConvenio = null;
    let timeoutBusqueda = null;
    let conveniosCache = [];
    let presentacionesCache = [];
    let presentacionesSeleccionadas = [];
    let recibosSeleccionados = [];
    let ultimoConvenioSeleccionado = "";
    let ultimoCampoEditado = "importe";
    let aplicarImporteCompletoPorDefecto = false;
    let solicitudRecibos = 0;
    let recibosListos = true;

    // ===================================================================================
    // 2. INICIALIZACIÓN DE LA APP
    // ===================================================================================
    function onInit() {
        try {
            inicializar_choices_convenio();
            cargar_tabla_presentaciones([]);
            cargar_tabla_recibos([]);
            resetear_modal();
        } catch (error) {
            console.error("Error al inicializar la liquidación de presentaciones:", error);
        }
    }

    // ===================================================================================
    // APERTURA, CIERRE Y LIMPIEZA DEL MODAL
    // ===================================================================================
    btnAbrirModal.on("click", function (e) {
        e.preventDefault();
        resetear_modal();
        abrir_modal();
    });

    modalLiquidacion.on("hidden.bs.modal", function () {
        resetear_modal();
    });

    function resetear_modal() {
        ultimoConvenioSeleccionado = "";
        choicesConvenio ? choicesConvenio.removeActiveItems() : selectConvenio.val("");
        presentacionesCache = [];
        cargar_tabla_presentaciones([]);
        resetear_seleccion();
        contenedorTabla.collapse("hide");
        ayudaPresentaciones.removeClass("d-none");
    }

    function resetear_seleccion() {
        ++solicitudRecibos;
        recibosListos = true;
        presentacionesSeleccionadas = [];
        recibosSeleccionados = [];
        ultimoCampoEditado = "importe";
        aplicarImporteCompletoPorDefecto = false;
        cargar_tabla_recibos([]);
        seccionResumen.addClass("d-none");
        seccionRecibos.addClass("d-none");
        ayudaRecibos.removeClass("d-none").text("Seleccione una presentación para consultar sus recibos asociados.");
        ayudaResumen.addClass("d-none").text("");
        campoCantidad.val(0);
        campoTotalPagar.val(Formatos.formatoMoneda(0));
        campoSaldoPendiente.val(Formatos.formatoMoneda(0));
        campoPorcentaje.val(formato_porcentaje_editable(0)).prop("readonly", true);
        campoModo.val("-");
        importeLiquidacion.val(formato_importe_editable(0)).prop("readonly", true);
        actualizar_estado_boton_confirmar();
    }

    function abrir_modal() {
        const instanciaModal = obtener_instancia_modal();

        if (instanciaModal) {
            instanciaModal.show();
        } else if (typeof modalLiquidacion.modal === "function") {
            modalLiquidacion.modal("show");
        }
    }

    function cerrar_modal() {
        const instanciaModal = obtener_instancia_modal();

        if (instanciaModal) {
            instanciaModal.hide();
        } else if (typeof modalLiquidacion.modal === "function") {
            modalLiquidacion.modal("hide");
        }
    }

    function obtener_instancia_modal() {
        if (!window.bootstrap || !modalLiquidacion.length) return null;
        return window.bootstrap.Modal.getOrCreateInstance(modalLiquidacion[0]);
    }

    // ===================================================================================
    // SELECCIÓN Y BÚSQUEDA DE CONVENIOS
    // ===================================================================================
    selectConvenio.on("change", function () {
        manejar_cambio_convenio($(this).val());
    });

    selectConvenio.on("choice", function (e) {
        manejar_cambio_convenio(e?.detail?.choice?.value || "");
    });

    selectConvenio.on("search", function (e) {
        const termino = String(e?.detail?.value || "").trim();
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(() => buscar_convenios(termino), 250);
    });

    function inicializar_choices_convenio() {
        if (typeof Choices === "undefined" || !selectConvenio.length) return;
        if (choicesConvenio) choicesConvenio.destroy();

        choicesConvenio = new Choices(selectConvenio[0], {
            searchEnabled: true,
            searchFloor: 0,
            searchResultLimit: 9999,
            shouldSort: false,
            position: "bottom",
            removeItemButton: false,
            searchChoices: false,
            placeholderValue: "Teclee para buscar convenios",
            searchPlaceholderValue: "Buscar convenio...",
            itemSelectText: "Seleccionar",
            noResultsText: "Escriba para buscar convenios",
            noChoicesText: "No hay opciones disponibles",
        });
    }

    function buscar_convenios(termino) {
        let dataString = { backend: "sugerencias_convenios", termino: termino };

        $.ajax({
            type: "POST",
            url: "app/Controllers/Convenios/Convenios_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                conveniosCache = Array.isArray(response) ? response : [];
                cargar_opciones_convenio(conveniosCache, selectConvenio.val());
            },
        });
    }

    function cargar_opciones_convenio(convenios, valorSeleccionado = "") {
        const existeSeleccionado = convenios.some((convenio) => String(convenio.id_convenio) === String(valorSeleccionado));

        const opciones = [
            { value: "", label: "Seleccione Convenio", selected: !existeSeleccionado },
            ...convenios.map((convenio) => ({
                value: String(convenio.id_convenio),
                label: convenio.label || `${convenio.id_convenio} - ${convenio.nombre || ""}`,
                selected: String(convenio.id_convenio) === String(valorSeleccionado),
            })),
        ];

        if (choicesConvenio) {
            choicesConvenio.clearChoices();
            choicesConvenio.setChoices(opciones, "value", "label", true);
            return;
        }

        selectConvenio.empty().append('<option value="" selected>Seleccione Convenio</option>');
        convenios.forEach((convenio) => {
            selectConvenio.append(
                `<option value="${convenio.id_convenio}">${convenio.label || `${convenio.id_convenio} - ${convenio.nombre || ""}`}</option>`,
            );
        });
        selectConvenio.val(existeSeleccionado ? String(valorSeleccionado) : "");
    }

    function manejar_cambio_convenio(id_convenio) {
        if (String(ultimoConvenioSeleccionado) === String(id_convenio)) return;
        ultimoConvenioSeleccionado = String(id_convenio || "");
        resetear_seleccion();

        if (!id_convenio) {
            presentacionesCache = [];
            cargar_tabla_presentaciones([]);
            contenedorTabla.collapse("hide");
            ayudaPresentaciones.removeClass("d-none");
            return;
        }

        extraer_presentaciones_liquidar(id_convenio);
    }

    // ===================================================================================
    // EXTRAER Y SELECCIONAR PRESENTACIONES
    // ===================================================================================
    function extraer_presentaciones_liquidar(id_convenio) {
        let dataString = { backend: "extraer_presentaciones_liquidar", id_convenio: id_convenio };

        $.ajax({
            type: "POST",
            url: "app/Controllers/Presentaciones/Presentaciones_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                presentacionesCache = response?.success && Array.isArray(response.data) ? response.data : [];
                cargar_tabla_presentaciones(presentacionesCache);
                ayudaPresentaciones.addClass("d-none");
                contenedorTabla.collapse("show");
            },
            error: function () {
                presentacionesCache = [];
                cargar_tabla_presentaciones([]);
                contenedorTabla.collapse("show");
            },
        });
    }

    function cargar_tabla_presentaciones(presentaciones) {
        if (!datatable_presentaciones.length || !$.fn.DataTable) return;

        datatable_presentaciones.DataTable({
            destroy: true,
            select: { style: "multi" },
            data: presentaciones,
            columns: [
                {
                    title: "Nro Presentación",
                    data: "id_presentacion",
                    className: "text-center",
                    defaultContent: "-",
                },
                {
                    title: "Convenio",
                    data: null,
                    defaultContent: "-",
                    render: function (data, type, row) {
                        return row.convenio_nombre || row.nombre || row.razon_social || "-";
                    },
                },
                {
                    title: "Periodo",
                    data: "periodo",
                    className: "text-center",
                    defaultContent: "-",
                },
                {
                    title: "Total a Pagar",
                    data: null,
                    className: "text-end",
                    render: function (data, type, row) {
                        return Formatos.formatoMoneda(total_pagar_de(row));
                    },
                },
                {
                    title: "Saldo Pendiente",
                    data: null,
                    className: "text-end",
                    render: function (data, type, row) {
                        return Formatos.formatoMoneda(saldo_pendiente_de(row));
                    },
                },
                {
                    title: "Estado",
                    data: "estado",
                    className: "text-center",
                    render: function (estado) {
                        return mostrar_estado_presentacion(estado);
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                emptyTable: "No hay presentaciones listas para liquidar para el convenio seleccionado.",
            },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
            responsive: true,
            drawCallback: function () {
                sincronizar_filas(datatable_presentaciones);
            },
        });
    }

    datatable_presentaciones.on("select.dt deselect.dt", function () {
        sincronizar_filas(datatable_presentaciones);
        actualizar_presentaciones_seleccionadas();
    });

    function actualizar_presentaciones_seleccionadas() {
        if (!datatable_presentaciones.length || !$.fn.DataTable.isDataTable(datatable_presentaciones)) {
            presentacionesSeleccionadas = [];
            aplicarImporteCompletoPorDefecto = false;
            actualizar_resumen();
            return;
        }

        presentacionesSeleccionadas = datatable_presentaciones.DataTable().rows({ selected: true }).data().toArray();
        aplicarImporteCompletoPorDefecto = true;
        actualizar_resumen();
        actualizar_tabla_recibos();
    }

    function mostrar_estado_presentacion(estado) {
        const estados = {
            PL: { label: "Pendiente Liquidación", className: "bg-warning-subtle text-warning" },
            LP: { label: "Liquidación Parcial", className: "bg-secondary-subtle text-secondary" },
            LT: { label: "Liquidación Total", className: "bg-success-subtle text-success" },
        };
        const { label, className } = estados[estado] || { label: estado || "-", className: "bg-secondary-subtle text-secondary" };
        return `<span class="badge ${className} badge-border">${label}</span>`;
    }

    // ===================================================================================
    // EXTRAER Y SELECCIONAR RECIBOS DE LAS PRESENTACIONES
    // ===================================================================================
    async function extraer_recibos_presentacion(id_presentacion) {
        let dataString = { backend: "extraer_recibos_presentacion", id_presentacion: id_presentacion };

        const response = await $.ajax({
            type: "POST",
            url: "app/Controllers/Presentaciones/Presentaciones_backend.php",
            data: dataString,
            dataType: "json",
        });

        if (response?.success && Array.isArray(response.data)) {
            return response.data;
        }
        throw new Error(response?.message || "Respuesta inválida al extraer recibos de la presentación.");
    }

    async function actualizar_tabla_recibos() {
        const solicitudActual = ++solicitudRecibos;
        const presentaciones = [...presentacionesSeleccionadas];
        recibosSeleccionados = [];
        cargar_tabla_recibos([]);

        const hayPresentaciones = presentaciones.length > 0;
        seccionRecibos.toggleClass("d-none", !hayPresentaciones);
        ayudaRecibos
            .removeClass("d-none")
            .text(hayPresentaciones ? "Cargando recibos asociados..." : "Seleccione una presentación para consultar sus recibos asociados.");
        ajustar_tabla(datatable_recibos);

        recibosListos = !hayPresentaciones;
        actualizar_estado_boton_confirmar();
        if (!hayPresentaciones) return;

        try {
            const resultados = await Promise.all(presentaciones.map((presentacion) => extraer_recibos_presentacion(presentacion.id_presentacion)));
            if (solicitudActual !== solicitudRecibos) return;

            const recibosPorId = new Map();
            resultados.flat().forEach((recibo) => {
                if (recibo?.id_recibo && !recibosPorId.has(String(recibo.id_recibo))) {
                    recibosPorId.set(String(recibo.id_recibo), recibo);
                }
            });

            const recibosDisponibles = Array.from(recibosPorId.values());
            cargar_tabla_recibos(recibosDisponibles);
            ayudaRecibos
                .toggleClass("d-none", recibosDisponibles.length > 0)
                .text("No hay recibos asociados a las presentaciones seleccionadas.");
            ajustar_tabla(datatable_recibos);
            recibosListos = true;
            actualizar_estado_boton_confirmar();
        } catch (error) {
            if (solicitudActual !== solicitudRecibos) return;
            console.error("Error al extraer recibos de las presentaciones:", error);
            ayudaRecibos
                .removeClass("d-none")
                .text("No se pudieron cargar los recibos. Vuelva a seleccionar las presentaciones para reintentar.");
        }
    }

    function cargar_tabla_recibos(recibos) {
        if (!datatable_recibos.length || !$.fn.DataTable) return;

        datatable_recibos.DataTable({
            destroy: true,
            select: { style: "multi" },
            data: recibos,
            columns: [
                {
                    title: "ID",
                    data: "id_recibo",
                    className: "text-center",
                    defaultContent: "-",
                },
                {
                    title: "Nro Comprobante",
                    data: "numero_comprobante",
                    defaultContent: "-",
                },
                {
                    title: "Fecha",
                    data: "fecha_comprobante",
                    className: "text-center",
                    defaultContent: "-",
                },
                {
                    title: "Importe",
                    data: "importe",
                    className: "text-end",
                    defaultContent: 0,
                    render: function (importe) {
                        return Formatos.formatoMoneda(importe || 0);
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                emptyTable: "No hay recibos asociados disponibles para la selección actual.",
            },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
            responsive: true,
            drawCallback: function () {
                sincronizar_filas(datatable_recibos);
            },
        });
    }

    datatable_recibos.on("select.dt deselect.dt", function () {
        sincronizar_filas(datatable_recibos);
        actualizar_recibos_seleccionados();
    });

    function actualizar_recibos_seleccionados() {
        if (!datatable_recibos.length || !$.fn.DataTable.isDataTable(datatable_recibos)) {
            recibosSeleccionados = [];
            actualizar_estado_boton_confirmar();
            return;
        }

        recibosSeleccionados = datatable_recibos
            .DataTable()
            .rows({ selected: true })
            .data()
            .toArray()
            .map((recibo) => recibo.id_recibo);

        actualizar_estado_boton_confirmar();
    }

    contenedorTabla.on("shown.bs.collapse", function () {
        ajustar_tabla(datatable_presentaciones);
        ajustar_tabla(datatable_recibos);
    });

    // ===================================================================================
    // RESUMEN E IMPORTE DE LA LIQUIDACIÓN
    // ===================================================================================
    Formatos.aplicarMascaraMonedaInput("#importe_liquidacion_total", function () {
        if (!esta_en_modo_liquidacion_individual()) {
            actualizar_estado_boton_confirmar();
            return;
        }

        ultimoCampoEditado = "importe";
        actualizar_resumen();
    });

    Formatos.aplicarMascaraPorcentajeInput("#porcentaje_liquidacion_total", function () {
        if (!esta_en_modo_liquidacion_individual()) {
            actualizar_estado_boton_confirmar();
            return;
        }

        ultimoCampoEditado = "porcentaje";
        actualizar_resumen();
    });

    function actualizar_resumen() {
        const cantidad = presentacionesSeleccionadas.length;
        const totalPagar = presentacionesSeleccionadas.reduce((acc, presentacion) => acc + total_pagar_de(presentacion), 0);
        const saldoPendiente = presentacionesSeleccionadas.reduce((acc, presentacion) => acc + saldo_pendiente_de(presentacion), 0);

        campoCantidad.val(cantidad);
        campoTotalPagar.val(Formatos.formatoMoneda(totalPagar));
        campoSaldoPendiente.val(Formatos.formatoMoneda(saldoPendiente));

        if (cantidad === 0) {
            seccionResumen.addClass("d-none");
            ayudaResumen.addClass("d-none").text("");
            campoPorcentaje.val(formato_porcentaje_editable(0)).prop("readonly", true);
            campoModo.val("-");
            importeLiquidacion.val(formato_importe_editable(0)).prop("readonly", true);
            actualizar_estado_boton_confirmar();
            return;
        }

        seccionResumen.removeClass("d-none");

        if (cantidad > 1) {
            importeLiquidacion.val(formato_importe_editable(saldoPendiente)).prop("readonly", true);
            campoPorcentaje.val(formato_porcentaje_editable(100)).prop("readonly", true);
            campoModo.val("Liquidación total obligatoria por múltiples presentaciones");
            ayudaResumen
                .removeClass("d-none")
                .text("Cuando se selecciona más de una presentación, la liquidación se realiza al 100% del saldo pendiente.");
            actualizar_estado_boton_confirmar();
            return;
        }

        // Una sola presentación: los campos de importe y porcentaje son editables.
        importeLiquidacion.prop("readonly", false);
        campoPorcentaje.prop("readonly", false);

        if (aplicarImporteCompletoPorDefecto) {
            ultimoCampoEditado = "porcentaje";
            campoPorcentaje.val(formato_porcentaje_editable(100));
            aplicarImporteCompletoPorDefecto = false;
        }

        const { importe, porcentaje } = calcular_importe_y_porcentaje(totalPagar, saldoPendiente);
        const presentacion = presentacionesSeleccionadas[0];

        importeLiquidacion.val(formato_importe_editable(importe));
        campoPorcentaje.val(formato_porcentaje_editable(porcentaje));
        campoModo.val(importe < saldoPendiente ? "Liquidación parcial" : "Liquidación total");
        ayudaResumen
            .removeClass("d-none")
            .text(
                `Puede liquidar hasta ${Formatos.formatoMoneda(saldoPendiente)} para la presentación ${presentacion.id_presentacion}. Puede ingresar importe o porcentaje.`,
            );

        actualizar_estado_boton_confirmar();
    }

    function calcular_importe_y_porcentaje(totalPagar, saldoPendiente) {
        const porcentajeMax = totalPagar > 0 ? Math.min((saldoPendiente / totalPagar) * 100, 100) : 0;

        if (ultimoCampoEditado === "porcentaje") {
            const porc = Math.min(Math.max(Formatos.parseNumero(campoPorcentaje.val()) || 0, 0), porcentajeMax);
            return { porcentaje: porc, importe: Math.min((totalPagar * porc) / 100, saldoPendiente) };
        }

        const importe = Math.min(Math.max(Formatos.parseNumero(importeLiquidacion.val()) || 0, 0), saldoPendiente);
        return { importe, porcentaje: totalPagar > 0 ? Math.min((importe / totalPagar) * 100, porcentajeMax) : 0 };
    }

    function actualizar_estado_boton_confirmar() {
        const cantidad = presentacionesSeleccionadas.length;
        if (cantidad === 0 || !recibosListos) {
            btnConfirmar.prop("disabled", true);
            return;
        }
        if (cantidad > 1) {
            btnConfirmar.prop("disabled", false);
            return;
        }

        const saldo = saldo_pendiente_de(presentacionesSeleccionadas[0]);
        const importe = Formatos.parseNumero(importeLiquidacion.val()) || 0;
        btnConfirmar.prop("disabled", !(importe > 0 && importe <= saldo));
    }

    function total_pagar_de(presentacion) {
        return Number(presentacion.total_a_pagar || presentacion.atotal_a_pagar || presentacion.total || presentacion.importe || 0);
    }

    function saldo_pendiente_de(presentacion) {
        const saldo = Number(presentacion.saldo_pendiente);
        return saldo > 0 || String(presentacion.saldo_pendiente) === "0" ? saldo : total_pagar_de(presentacion);
    }

    function formato_importe_editable(valor) {
        return Formatos.formatoNumero(valor, 2);
    }

    function formato_porcentaje_editable(valor) {
        const numero = Math.min(Math.max(Formatos.parseNumero(valor), 0), 100);
        return Formatos.formatoNumero(numero, 2);
    }

    function esta_en_modo_liquidacion_individual() {
        return !importeLiquidacion.prop("readonly") && !campoPorcentaje.prop("readonly") && presentacionesSeleccionadas.length === 1;
    }

    // ===================================================================================
    // CONFIRMAR LIQUIDACIÓN
    // ===================================================================================
    btnConfirmar.on("click", function () {
        const dataString = construir_payload();
        if (!dataString) return;

        btnConfirmar.prop("disabled", true);
        Swal.fire({
            title: "¿Desea confirmar esta liquidación?",
            text: "Se liquidarán las presentaciones seleccionadas con el importe indicado.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, liquidar",
            cancelButtonText: "Cancelar",
        }).then(function (result) {
            if (result.isConfirmed) {
                liquidar_presentaciones_ajax(dataString);
            } else {
                actualizar_estado_boton_confirmar();
            }
        });
    });

    function liquidar_presentaciones_ajax(dataString) {
        btnConfirmar.prop("disabled", true);

        $.ajax({
            type: "POST",
            url: "app/Controllers/Liquidaciones/Liquidaciones_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                const alerta = response?.alert || {};

                if (response?.success) {
                    cerrar_modal();
                    Swal.fire({
                        title: alerta.title || "Exito",
                        text: alerta.message || response?.message || "Las presentaciones se liquidaron correctamente.",
                        icon: alerta.icon || "success",
                        confirmButtonText: "Aceptar",
                        confirmButtonClass: "btn btn-success w-xs me-2 mt-2",
                    });
                    return;
                }

                Swal.fire({
                    title: alerta.title || "Error",
                    text: alerta.message || response?.message || "Error al liquidar presentaciones.",
                    icon: alerta.icon || "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonClass: "btn btn-danger w-xs me-2 mt-2",
                });
            },
            error: function () {
                Swal.fire({
                    title: "Error de conexion",
                    text: "No se pudo comunicar con el servidor. Por favor, intente nuevamente.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonClass: "btn btn-danger w-xs me-2 mt-2",
                });
            },
            complete: function () {
                if (modalLiquidacion.hasClass("show")) {
                    actualizar_estado_boton_confirmar();
                }
            },
        });
    }

    function construir_payload() {
        if (!presentacionesSeleccionadas.length) return null;

        const totalPagar = presentacionesSeleccionadas.reduce((acc, presentacion) => acc + total_pagar_de(presentacion), 0);
        const esMultiple = presentacionesSeleccionadas.length > 1;
        const importe = esMultiple
            ? presentacionesSeleccionadas.reduce((acc, presentacion) => acc + saldo_pendiente_de(presentacion), 0)
            : Formatos.parseNumero(importeLiquidacion.val()) || 0;
        const porcentaje = totalPagar > 0 ? ((importe / totalPagar) * 100).toFixed(2) : "0.00";

        return {
            backend: "liquidar_presentaciones",
            cabecera: {
                id_convenio: selectConvenio.val(),
                porcentaje: esMultiple ? "100.00" : porcentaje,
            },
            presentaciones: presentacionesSeleccionadas.map((presentacion) => String(presentacion.id_presentacion)),
            recibos: recibosSeleccionados.map(String),
        };
    }

    // ===================================================================================
    // FUNCIONES AUXILIARES DE LAS TABLAS
    // ===================================================================================
    function ajustar_tabla(datatable) {
        if (!datatable.length || !$.fn.DataTable.isDataTable(datatable)) return;
        const tabla = datatable.DataTable();
        tabla.columns.adjust();
        tabla.responsive?.recalc?.();
        sincronizar_filas(datatable);
    }

    function sincronizar_filas(datatable) {
        if (!datatable.length || !$.fn.DataTable.isDataTable(datatable)) return;
        const tabla = datatable.DataTable();
        $(tabla.rows().nodes()).removeClass("selected table-primary");
        $(tabla.rows({ selected: true }).nodes()).addClass("selected table-primary");
    }

    // ===================================================================================
    // PUNTO DE ENTRADA DE LA APLICACIÓN
    // ===================================================================================
    onInit();
});
