const ClassValidaciones = window.Validaciones;
$(document).ready(function () {
    // ******************************* REFERENCIAS DOM ***************************************
    // Datatables
    const datatable_recibos = $("#datatable_recibos");
    const datatable_detalles_alta = $("#datatable_detalles_alta");
    const datatable_pagos_alta = $("#datatable_pagos_alta");
    const datatable_presentaciones_alta = $("#datatable_presentaciones_alta");
    const datatable_detalles_detalle_recibo = $("#datatable_detalles_detalle_recibo");
    const datatable_pagos_detalle_recibo = $("#datatable_pagos_detalle_recibo");
    const datatable_presentaciones_detalle_recibo = $("#datatable_presentaciones_detalle_recibo");

    // Formularios
    const modalReciboAlta = $("#modalReciboAlta");
    const modalDetalleRecibo = $("#modalDetalleRecibo");
    const formAltaRecibo = $("#formAltaRecibo");
    const formDetalleAlta = $("#formDetalleAlta");
    const formPagoAlta = $("#formPagoAlta");
    const formPresentacionAlta = $("#formPresentacionAlta");
    const fechaComprobanteAlta = $("#fecha_comprobante_alta");
    const importeTotalAlta = $("#importe_total_alta");
    const clienteAlta = $("#cliente_alta");
    const clienteNombreAlta = $("#cliente_nombre_alta");
    const convenioAlta = $("#convenio_alta");
    const presentacionAlta = $("#presentacion_alta");
    const tipoPagoAlta = $("#tipo_pago_alta");
    const cuentaPagoAlta = $("#id_cuenta_pago_alta");
    const numeroChequePagoAlta = $("#numero_cheque_pago_alta");
    const fechaEmisionPagoAlta = $("#fecha_emision_pago_alta");
    const fechaCobroPagoAlta = $("#fecha_cobro_pago_alta");

    // Botones
    const btnNuevoRecibo = $("#btnNuevoRecibo");
    const btnGuardarDetalleAlta = $("#btnGuardarDetalleAlta");
    const btnGuardarPagoAlta = $("#btnGuardarPagoAlta");
    const btnGuardarPresentacionAlta = $("#btnGuardarPresentacionAlta");
    const btnConfirmarAltaRecibo = $("#btnConfirmarAltaRecibo");

    const CHOICES_CONFIG = {
        searchEnabled: true,
        searchFloor: 0, // Muestra el buscador siempre, incluso con pocas opciones
        searchResultLimit: 9999, // Muestra todos los resultados
        searchPlaceholderValue: "Buscar...",
        itemSelectText: "Seleccionar",
        noResultsText: "No se encontraron resultados",
        noChoicesText: "No hay opciones disponibles",
        shouldSort: false,
        position: "bottom",
        removeItemButton: false,
    };

    // Variables de estado

    let clientesCache = [];
    let cuentasBancariasCache = [];
    let conveniosCache = [];
    let presentacionesConvenioCache = [];
    let choicesConvenioAlta = null;
    let choicesPresentacionAlta = null;
    let timeoutBusquedaConveniosAlta = null;

    // ******************************* INICIALIZACION ****************************************

    // **************************************************************************************
    // ******************************* DATOS PRINCIPALES *************************************

    aplicarFormatosAlta();
    extraer_recibos();
    extraer_clientes();
    extraer_cuentas_bancarias();
    inicializarFormularioPagosAlta();
    inicializarFormularioClienteAlta();
    inicializarFormularioPresentacionesAlta();

    function extraer_recibos() {
        $.ajax({
            data: { backend: "extraer_recibos" },
            url: "app/Controllers/Tesoreria/Recibos_cobranza_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    cargar_tabla_recibos(Array.isArray(response.data) ? response.data : []);
                }
            },
        });
    }

    function cargar_tabla_recibos(recibos) {
        datatable_recibos.DataTable({
            destroy: true,
            data: recibos,
            columns: [
                { data: "id_recibo", title: "ID", className: "text-start align-middle" },
                { data: "numero_comprobante", title: "NRO COMPROBANTE", defaultContent: "-" },
                { data: "fecha_comprobante", title: "FECHA COMPROBANTE", className: "text-center", defaultContent: "-" },
                {
                    data: "total",
                    title: "TOTAL",
                    className: "text-end",
                    defaultContent: 0,
                    render: function (data) {
                        return Formatos.formatoMoneda(data || 0);
                    },
                },
                {
                    data: "estado",
                    title: "ESTADO",
                    className: "text-center align-middle",
                    defaultContent: "-",
                    render: function (data) {
                        return renderizarEstadoRecibo(data);
                    },
                },
                {
                    data: null,
                    title: "ACCIONES",
                    className: "text-center",
                    orderable: false,
                    render: function (data, type, row) {
                        return renderizarAccionesRecibo(row);
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: "Buscar recibos...",
            },
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            responsive: true,
            iDisplayLength: 10,
            lengthMenu: [
                [10, 20, 50, -1],
                [10, 20, 50, "Todos"],
            ],
            order: false
        });
    }

    datatable_recibos.on("click", "button", function () {
        const accion = $(this).attr("accion");
        let row = $(this).closest("tr");
        let recibo = datatable_recibos.DataTable().row(row).data();

        if (!recibo && row.hasClass("child")) {
            recibo = datatable_recibos.DataTable().row(row.prev()).data();
        }

        if (!recibo) {
            return;
        }

        switch (accion) {
            case "btnVerRecibo":
                extraer_datos_recibo(recibo.id_recibo, cargar_modal_detalle_recibo);
                break;
            case "btnEliminarRecibo":
                Swal.fire({
                    title: "Confirmar",
                    text: `¿Desea eliminar el recibo de cobranza n° ${recibo.id_recibo}?`,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    allowOutsideClick: false,
                    confirmButtonClass: "btn btn-success w-xs me-2 mt-2",
                    cancelButtonClass: "btn btn-danger w-xs mt-2",
                }).then(function (result) {
                    if (result.value || result.isConfirmed) {
                        confirmar_eliminacion_recibo(recibo);
                    }
                });
                break;
        }
    });

    // **************************************************************************************
    // ************************************* ALTA *******************************************
    // Cabecera

    btnNuevoRecibo.on("click", function () {
        abrir_modal_alta();
    });

    $("#btnCancelarDetalleAlta").on("click", function () {
        resetearSeccionColapsable({
            form: formDetalleAlta,
            containerSelector: "#formContainerDetalleAlta",
            buttonSelector: "#btnAgregarDetalleAlta",
            titleSelector: "#formDetalleTitle_alta",
            defaultTitle: "Gestionar Detalle",
        });
    });

    $("#btnCancelarPagoAlta").on("click", function () {
        resetearSeccionColapsable({
            form: formPagoAlta,
            containerSelector: "#formContainerPagoAlta",
            buttonSelector: "#btnAgregarPagoAlta",
            titleSelector: "#formPagoTitle_alta",
            defaultTitle: "Gestionar Pago",
        });
    });

    $("#btnCancelarPresentacionAlta").on("click", function () {
        resetearSeccionColapsable({
            form: formPresentacionAlta,
            containerSelector: "#formContainerPresentacionesAlta",
            buttonSelector: "#btnAgregarPresentacionesAlta",
            titleSelector: "#formPresentacionTitle_alta",
            defaultTitle: "Gestionar Presentación",
        });
    });

    modalReciboAlta.on("hidden.bs.modal", function () {
        limpiarModalAltaCompleto();
    });

    ClassValidaciones.validarFormulario(formAltaRecibo, btnConfirmarAltaRecibo, function () {
        if (!validar_tabla_pagos_alta()) {
            return;
        }
        Swal.fire({
            title: "Confirmar alta",
            text: "¿Desea guardar el recibo de cobranza?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false,
            confirmButtonClass: "btn btn-success w-xs me-2 mt-2",
            cancelButtonClass: "btn btn-danger w-xs mt-2",
        }).then(function (result) {
            if (result.value || result.isConfirmed) {
                guardar_recibo_cobranza();
            }
        });
    });

    function abrir_modal_alta() {
        aplicarSoloNumeros("#nro_comprobante_alta");

        // Inicializar la tabla de planes como vacía
        inicializar_tabla_detalle_alta();
        inicializar_tabla_pagos_alta();
        inicializar_tabla_presentaciones_alta();

        limpiarSeccionesColapsablesAlta();
        importeTotalAlta.val(Formatos.formatoMoneda(0));

        if (!fechaComprobanteAlta.val()) {
            fechaComprobanteAlta.val(new Date().toISOString().split("T")[0]);
        }

        // Mostrar el modal
        $("#modalReciboAlta").modal("show");
    }
    function inicializar_tabla_detalle_alta() {
        datatable_detalles_alta.DataTable({
            destroy: true,
            data: [],
            columns: [
                { data: "concepto", title: "Concepto" },
                { data: "observaciones", title: "Observaciones" },
                {
                    data: "importe",
                    title: "Importe",
                    className: "text-end align-middle",
                    render: function (data) {
                        return Formatos.formatoMoneda(data || 0);
                    },
                },
                {
                    data: null,
                    title: "Acciones",
                    className: "text-center align-middle",
                    orderable: false,
                    render: function () {
                        return `<div class="sac-table-actions">
                                <button type="button" accion="btnEliminarDetalleAlta" class="sac-btn-icon sac-btn-icon-sm sac-btn-delete" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar Detalle" aria-label="Eliminar detalle"><i class="ri-delete-bin-fill"></i></button>
                            </div>`;
                    },
                },
            ],
            language: { url: "public/json/Spanish.json", emptyTable: "Aún no se han agregado detalles." },
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
        });
    }
    function inicializar_tabla_pagos_alta() {
        datatable_pagos_alta.DataTable({
            destroy: true,
            data: [],
            columns: [
                {
                    data: "tipo_pago",
                    title: "Tipo Pago",
                    render: function (data) {
                        return obtenerDescripcionTipoPago(data);
                    },
                },
                {
                    data: "importe",
                    title: "Importe",
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data || 0);
                    },
                },
                {
                    data: null,
                    title: "Cuenta",
                    render: function (data, type, row) {
                        return row.cuenta_descripcion || "-";
                    },
                },
                { data: "observaciones", title: "Observaciones" },
                { data: "numero_cheque", title: "Nro Cheque", className: "text-end", defaultContent: "-" },
                { data: "fecha_emision", title: "Fecha Emisión", className: "text-center", defaultContent: "-" },
                { data: "fecha_cobro", title: "Fecha Cobro", className: "text-center", defaultContent: "-" },
                {
                    data: null,
                    title: "Acciones",
                    className: "text-center align-middle",
                    orderable: false,
                    render: function () {
                        return `<div class="sac-table-actions">
                                <button type="button" accion="btnEliminarPagoAlta" class="sac-btn-icon sac-btn-icon-sm sac-btn-delete" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar Pago" aria-label="Eliminar pago"><i class="ri-delete-bin-fill"></i></button>
                            </div>`;
                    },
                },
            ],
            language: { url: "public/json/Spanish.json", emptyTable: "Aún no se han agregado pagos." },
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
        });
    }
    function inicializar_tabla_presentaciones_alta() {
        datatable_presentaciones_alta.DataTable({
            destroy: true,
            data: [],
            columns: [
                { data: "id_presentacion", title: "Id Presentación" },
                { data: "nombre_convenio", title: "Nombre Convenio" },
                { data: "periodo", title: "Periodo", defaultContent: "-" },
                {
                    data: "importe",
                    title: "Importe",
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data || 0);
                    },
                },
                {
                    data: null,
                    title: "Acciones",
                    className: "text-center",
                    orderable: false,
                    render: function () {
                        return `<div class="sac-table-actions">
                                <button type="button" accion="btnEliminarPresentacionAlta" class="sac-btn-icon sac-btn-icon-sm sac-btn-delete" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar Presentación" aria-label="Eliminar presentación"><i class="ri-delete-bin-fill"></i></button>
                            </div>`;
                    },
                },
            ],
            language: { url: "public/json/Spanish.json", emptyTable: "Aún no se han agregado presentaciones." },
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
        });
    }

    configurarBotonCollapse({
        buttonSelector: "#btnAgregarDetalleAlta",
        containerSelector: "#formContainerDetalleAlta",
        titleSelector: "#formDetalleTitle_alta",
        expandedTitle: "Agregar Nuevo Detalle",
        onHide: function () {
            limpiarFormulario(formDetalleAlta);
        },
        onExpand: function () {
            fila_detalle_a_editar_alta = null;
            $("#id_detalle_form_alta").val("");
        },
    });

    configurarBotonCollapse({
        buttonSelector: "#btnAgregarPagoAlta",
        containerSelector: "#formContainerPagoAlta",
        titleSelector: "#formPagoTitle_alta",
        expandedTitle: "Agregar Nuevo Pago",
        onHide: function () {
            limpiarFormulario(formPagoAlta);
        },
        onExpand: function () {
            fila_detalle_a_editar_alta = null;
        },
    });

    configurarBotonCollapse({
        buttonSelector: "#btnAgregarPresentacionesAlta",
        containerSelector: "#formContainerPresentacionesAlta",
        titleSelector: "#formPresentacionTitle_alta",
        expandedTitle: "Agregar Nueva Presentación",
        onHide: function () {
            limpiarFormulario(formPresentacionAlta);
        },
        onExpand: function () {
            fila_detalle_a_editar_alta = null;
        },
    });

    // **************************************************************************************
    // Detalle

    ClassValidaciones.validarFormulario(formDetalleAlta, btnGuardarDetalleAlta, function () {
        agregar_linea_detalle_alta();
    });

    // **************************************************************************************
    // Pagos
    ClassValidaciones.validarFormulario(formPagoAlta, btnGuardarPagoAlta, function () {
        agregar_linea_pago_alta();
    });

    // **************************************************************************************
    // Presentaciones
    ClassValidaciones.validarFormulario(formPresentacionAlta, btnGuardarPresentacionAlta, function () {
        agregar_linea_presentacion_alta();
    });

    datatable_detalles_alta.on("click", "button[accion='btnEliminarDetalleAlta']", function () {
        eliminarFilaDatatable(datatable_detalles_alta, this);
    });

    datatable_pagos_alta.on("click", "button[accion='btnEliminarPagoAlta']", function () {
        eliminarFilaDatatable(datatable_pagos_alta, this);
        actualizar_total_alta_desde_pagos();
    });

    datatable_presentaciones_alta.on("click", "button[accion='btnEliminarPresentacionAlta']", function () {
        eliminarFilaDatatable(datatable_presentaciones_alta, this);
    });

    // ===================================================================================
    // FUNCIONES AUXILIARES
    // ===================================================================================

    function configurarBotonCollapse({ buttonSelector, containerSelector, titleSelector, expandedTitle, onExpand, onHide }) {
        const button = $(buttonSelector);
        const container = $(containerSelector);
        const title = $(titleSelector);

        button.on("click", function (e) {
            e.preventDefault();

            const estaVisible = container.hasClass("show");
            if (!estaVisible) {
                title.text(expandedTitle);
                if (typeof onExpand === "function") {
                    onExpand();
                }
            }

            container.collapse(estaVisible ? "hide" : "show");
        });

        container.on("shown.bs.collapse", function () {
            actualizarEstadoBotonCollapse(button, true);
        });

        container.on("hidden.bs.collapse", function () {
            if (typeof onHide === "function") {
                onHide();
            }
            actualizarEstadoBotonCollapse(button, false);
        });
    }

    function actualizarEstadoBotonCollapse(button, expandido) {
        const icono = button.find(".toggle-icon");
        const texto = button.find(".toggle-text");
        const textoExpandido = button.data("expand-text");
        const textoContraido = button.data("collapse-text");

        button.attr("aria-expanded", expandido);
        icono.toggleClass("bi-plus-circle", !expandido);
        icono.toggleClass("bi-chevron-up", expandido);
        texto.text(expandido ? textoContraido : textoExpandido);
    }

    function aplicarFormatosAlta() {
        Formatos.aplicarMascaraMonedaInput(".js-input-moneda");
    }

    function inicializarFormularioPagosAlta() {
        tipoPagoAlta.on("change", function () {
            actualizarFormularioSegunTipoPago();
        });

        actualizarFormularioSegunTipoPago();
    }

    function extraer_cuentas_bancarias() {
        $.ajax({
            data: { backend: "extraer_cuentas_bancarias" },
            url: "app/Controllers/Tesoreria/Cuentas_bancarias_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    cuentasBancariasCache = Array.isArray(response.data) ? response.data : [];
                    cargar_select_cuentas_bancarias(cuentasBancariasCache);
                }
            },
        });
    }

    function extraer_clientes() {
        $.ajax({
            data: { backend: "extraer_clientes" },
            url: "app/Controllers/Clientes/Clientes_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    clientesCache = Array.isArray(response.data) ? response.data : [];
                    cargar_select_clientes(clientesCache);
                }
            },
        });
    }

    function extraer_datos_recibo(idRecibo, callback) {
        $.ajax({
            type: "POST",
            url: "app/Controllers/Tesoreria/Recibos_cobranza_backend.php",
            data: {
                backend: "extraer_recibo",
                id_recibo: idRecibo,
            },
            dataType: "json",
            success: function (response) {
                if (response && response.success && typeof callback === "function") {
                    callback(response.data);
                }
            },
        });
    }

    function cargar_select_clientes(clientes) {
        clienteAlta.empty().append('<option value="" selected>Seleccione Cliente</option>');

        (clientes || []).forEach(function (cliente) {
            const descripcion = construirDescripcionCliente(cliente);
            clienteAlta.append(`<option value="${cliente.id_cliente}">${descripcion}</option>`);
        });
    }

    function inicializarFormularioClienteAlta() {
        clienteAlta.on("change", function () {
            const clienteSeleccionado = obtenerClienteSeleccionado();
            clienteNombreAlta.val(clienteSeleccionado ? construirNombreCliente(clienteSeleccionado) : "");
        });
    }

    function inicializarFormularioPresentacionesAlta() {
        inicializarChoicesConvenioAlta();
        inicializarChoicesPresentacionAlta();

        convenioAlta.on("change", function () {
            const convenioId = $(this).val();
            resetearPresentacionesConvenioAlta();

            if (!convenioId) {
                return;
            }

            extraer_presentaciones_convenio(convenioId);
        });

        convenioAlta.on("search", function (event) {
            const termino = event && event.detail ? String(event.detail.value || "").trim() : "";

            clearTimeout(timeoutBusquedaConveniosAlta);
            timeoutBusquedaConveniosAlta = setTimeout(function () {
                buscar_convenios_alta(termino);
            }, 250);
        });
    }

    function construirDescripcionCliente(cliente) {
        const nombre = construirNombreCliente(cliente);
        return [nombre, cliente.cuit].filter(Boolean).join(" - ");
    }

    function construirNombreCliente(cliente) {
        return cliente.razon_social || cliente.nombre_fantasia || "";
    }

    function inicializarChoicesConvenioAlta() {
        if (typeof Choices === "undefined" || !convenioAlta.length) {
            return;
        }

        if (choicesConvenioAlta) {
            choicesConvenioAlta.destroy();
        }

        choicesConvenioAlta = new Choices(convenioAlta[0], {
            ...CHOICES_CONFIG,
            searchChoices: false,
            placeholderValue: "Seleccione Convenio",
            searchPlaceholderValue: "Buscar convenio...",
            noResultsText: "Escriba para buscar convenios",
        });
    }

    function inicializarChoicesPresentacionAlta() {
        if (typeof Choices === "undefined" || !presentacionAlta.length) {
            return;
        }

        if (choicesPresentacionAlta) {
            choicesPresentacionAlta.destroy();
        }

        choicesPresentacionAlta = new Choices(presentacionAlta[0], {
            ...CHOICES_CONFIG,
            placeholderValue: "Seleccione Presentación",
            searchPlaceholderValue: "Buscar presentación...",
            noResultsText: "No se encontraron presentaciones",
        });
    }

    function buscar_convenios_alta(termino) {
        $.ajax({
            data: {
                backend: "sugerencias_convenios",
                termino: termino,
            },
            url: "app/Controllers/Convenios/Convenios_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                conveniosCache = Array.isArray(response) ? response : [];
                cargar_select_convenios_alta(conveniosCache, convenioAlta.val());
            },
        });
    }

    function extraer_presentaciones_convenio(convenioId) {
        $.ajax({
            data: {
                backend: "extraer_presentaciones",
                datos: {
                    convenio_id: convenioId,
                    estado: "AP",
                },
            },
            url: "app/Controllers/Presentaciones/Presentaciones_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                presentacionesConvenioCache = response && Array.isArray(response.data) ? response.data : [];
                cargar_select_presentaciones_alta(presentacionesConvenioCache);
            },
        });
    }

    function cargar_select_convenios_alta(convenios, valorSeleccionado = "") {
        const existeConvenio = (convenios || []).some(function (convenio) {
            return String(convenio.id_convenio) === String(valorSeleccionado);
        });

        if (choicesConvenioAlta) {
            choicesConvenioAlta.clearChoices();
            choicesConvenioAlta.setChoices(
                [
                    { value: "", label: "Seleccione Convenio", selected: !existeConvenio },
                    ...(convenios || []).map(function (convenio) {
                        return {
                            value: String(convenio.id_convenio),
                            label: convenio.label || `${convenio.id_convenio} - ${convenio.nombre || ""}`,
                            selected: String(convenio.id_convenio) === String(valorSeleccionado),
                        };
                    }),
                ],
                "value",
                "label",
                true,
            );
            return;
        }

        convenioAlta.empty().append('<option value="" selected>Seleccione Convenio</option>');

        (convenios || []).forEach(function (convenio) {
            convenioAlta.append(
                `<option value="${convenio.id_convenio}">${convenio.label || `${convenio.id_convenio} - ${convenio.nombre || ""}`}</option>`,
            );
        });

        convenioAlta.val(existeConvenio ? String(valorSeleccionado) : "");
    }

    function cargar_select_presentaciones_alta(presentaciones, valorSeleccionado = "") {
        presentacionAlta.prop("disabled", false);
        presentacionAlta.empty().append('<option value="" selected>Seleccione Presentación</option>');

        (presentaciones || []).forEach(function (presentacion) {
            presentacionAlta.append(
                `<option value="${presentacion.id_presentacion}">${construirDescripcionPresentacion(presentacion)}</option>`,
            );
        });

        const existePresentacion = (presentaciones || []).some(function (presentacion) {
            return String(presentacion.id_presentacion) === String(valorSeleccionado);
        });

        presentacionAlta.val(existePresentacion ? String(valorSeleccionado) : "");
        inicializarChoicesPresentacionAlta();

        if (existePresentacion && choicesPresentacionAlta) {
            choicesPresentacionAlta.setChoiceByValue(String(valorSeleccionado));
        }
    }

    function construirDescripcionPresentacion(presentacion) {
        const partes = [presentacion.id_presentacion, presentacion.periodo].filter(Boolean);
        return partes.join(" - ") || String(presentacion.id_presentacion || "");
    }

    function resetearPresentacionesConvenioAlta() {
        presentacionesConvenioCache = [];
        presentacionAlta.prop("disabled", true);
        presentacionAlta.empty().append('<option value="" selected>Seleccione Presentación</option>');
        inicializarChoicesPresentacionAlta();
    }

    function obtenerConvenioSeleccionadoAlta() {
        return conveniosCache.find(function (convenio) {
            return String(convenio.id_convenio) === String(convenioAlta.val());
        });
    }

    function obtenerPresentacionSeleccionadaAlta() {
        return presentacionesConvenioCache.find(function (presentacion) {
            return String(presentacion.id_presentacion) === String(presentacionAlta.val());
        });
    }

    function obtenerClienteSeleccionado() {
        return clientesCache.find(function (cliente) {
            return String(cliente.id_cliente) === String(clienteAlta.val());
        });
    }

    function cargar_select_cuentas_bancarias(cuentas) {
        cuentaPagoAlta.empty().append('<option value="" selected>Seleccione cuenta bancaria</option>');

        (cuentas || []).forEach(function (cuenta) {
            if (cuenta.estado !== "A") {
                return;
            }

            const descripcion = construirDescripcionCuentaBancaria(cuenta);
            cuentaPagoAlta.append(`<option value="${cuenta.id_cuenta}">${descripcion}</option>`);
        });
    }

    function construirDescripcionCuentaBancaria(cuenta) {
        const partes = [cuenta.nombre_banco, cuenta.numero_cuenta, cuenta.nombre_cuenta].filter(Boolean);
        return partes.join(" - ");
    }

    function obtenerDescripcionTipoPago(tipoPago) {
        const tiposPago = {
            TRA: "Transferencia",
            EFE: "Efectivo",
            CHC: "Cheque",
            CHD: "Cheque Diferido",
        };

        return tiposPago[tipoPago] || tipoPago || "-";
    }

    function obtenerDescripcionEstadoRecibo(estado) {
        const estados = {
            I: "Importado",
            AP: "Imputado",
            PA: "Pagado",
        };

        return estados[estado] || estado || "-";
    }

    function obtenerDescripcionEstadoPago(estado) {
        const estados = {
            AC: "Acreditado",
            PE: "Pendiente",
        };

        return estados[estado] || estado || "-";
    }

    function actualizarFormularioSegunTipoPago() {
        const tipoPago = tipoPagoAlta.val();
        const esTransferencia = tipoPago === "TRA";
        const esCheque = tipoPago === "CHC" || tipoPago === "CHD";

        cuentaPagoAlta.prop("disabled", !esTransferencia);
        cuentaPagoAlta.prop("required", esTransferencia);
        $("#cuentaPagoObligatoria_alta").toggle(esTransferencia);

        $("#grupoNumeroChequeAlta").toggleClass("d-none", !esCheque);
        $("#grupoFechaEmisionChequeAlta").toggleClass("d-none", !esCheque);
        $("#grupoFechaCobroChequeAlta").toggleClass("d-none", !esCheque);

        numeroChequePagoAlta.prop("required", esCheque);
        fechaEmisionPagoAlta.prop("required", esCheque);
        fechaCobroPagoAlta.prop("required", esCheque);

        if (!esTransferencia) {
            cuentaPagoAlta.val("");
            cuentaPagoAlta.removeClass("is-valid is-invalid");
        }

        if (!esCheque) {
            numeroChequePagoAlta.val("").removeClass("is-valid is-invalid");
            fechaEmisionPagoAlta.val("").removeClass("is-valid is-invalid");
            fechaCobroPagoAlta.val("").removeClass("is-valid is-invalid");
        }
    }

    function agregar_linea_detalle_alta() {
        addNewRowDetalleAlta();
        resetearSeccionColapsable({
            form: formDetalleAlta,
            containerSelector: "#formContainerDetalleAlta",
            buttonSelector: "#btnAgregarDetalleAlta",
            titleSelector: "#formDetalleTitle_alta",
            defaultTitle: "Gestionar Detalle",
        });
    }

    function addNewRowDetalleAlta() {
        datatable_detalles_alta
            .DataTable()
            .row.add({
                id_concepto: null,
                concepto: $("#concepto_detalle_alta").val().trim(),
                observaciones: $("#observaciones_detalle_alta").val().trim(),
                importe: parseNumero($("#importe_detalle_alta").val()),
            })
            .draw();
    }

    function agregar_linea_pago_alta() {
        addNewRowPagoAlta();
        actualizar_total_alta_desde_pagos();
        resetearSeccionColapsable({
            form: formPagoAlta,
            containerSelector: "#formContainerPagoAlta",
            buttonSelector: "#btnAgregarPagoAlta",
            titleSelector: "#formPagoTitle_alta",
            defaultTitle: "Gestionar Pago",
        });
    }

    function addNewRowPagoAlta() {
        const cuentaSeleccionada = obtenerCuentaBancariaSeleccionada();

        datatable_pagos_alta
            .DataTable()
            .row.add({
                tipo_pago: tipoPagoAlta.val(),
                importe: parseNumero($("#importe_pago_alta").val()),
                id_cuenta: cuentaSeleccionada ? parseInt(cuentaSeleccionada.id_cuenta, 10) : null,
                cuenta_descripcion: cuentaSeleccionada ? construirDescripcionCuentaBancaria(cuentaSeleccionada) : null,
                observaciones: $("#observaciones_pago_alta").val().trim(),
                numero_cheque: numeroChequePagoAlta.val().trim() || null,
                fecha_emision: fechaEmisionPagoAlta.val() || null,
                fecha_cobro: fechaCobroPagoAlta.val() || null,
            })
            .draw();
    }

    function obtenerCuentaBancariaSeleccionada() {
        return cuentasBancariasCache.find(function (cuenta) {
            return String(cuenta.id_cuenta) === String(cuentaPagoAlta.val());
        });
    }

    function agregar_linea_presentacion_alta() {
        const filaAgregada = addNewRowPresentacionAlta();

        if (!filaAgregada) {
            return;
        }

        resetearSeccionColapsable({
            form: formPresentacionAlta,
            containerSelector: "#formContainerPresentacionesAlta",
            buttonSelector: "#btnAgregarPresentacionesAlta",
            titleSelector: "#formPresentacionTitle_alta",
            defaultTitle: "Gestionar Presentación",
        });
    }

    function addNewRowPresentacionAlta() {
        const convenioSeleccionado = obtenerConvenioSeleccionadoAlta();
        const presentacionSeleccionada = obtenerPresentacionSeleccionadaAlta();

        if (!presentacionSeleccionada) {
            return false;
        }

        const existePresentacion = datatable_presentaciones_alta
            .DataTable()
            .rows()
            .data()
            .toArray()
            .some(function (presentacion) {
                return String(presentacion.id_presentacion) === String(presentacionSeleccionada.id_presentacion);
            });

        if (existePresentacion) {
            Swal.fire({
                title: "Alerta",
                text: "La presentación seleccionada ya fue agregada al recibo.",
                icon: "warning",
                allowOutsideClick: false,
                confirmButtonText: "Aceptar",
                confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
            });
            return false;
        }

        datatable_presentaciones_alta
            .DataTable()
            .row.add({
                id_presentacion: presentacionSeleccionada.id_presentacion,
                id_convenio: convenioSeleccionado ? convenioSeleccionado.id_convenio : null,
                nombre_convenio: presentacionSeleccionada.convenio_nombre || (convenioSeleccionado ? convenioSeleccionado.nombre : ""),
                periodo: presentacionSeleccionada.periodo || null,
                importe: parseNumero($("#importe_presentacion_alta").val()),
            })
            .draw();

        return true;
    }

    function guardar_recibo_cobranza() {
        const payload = construir_payload_recibo_cobranza();

        $.ajax({
            type: "POST",
            url: "app/Controllers/Tesoreria/Recibos_cobranza_backend.php",
            data: payload,
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    Swal.fire({
                        title: response.alert ? response.alert.title : "Éxito",
                        text: response.message || (response.alert ? response.alert.message : "El recibo se cargó correctamente."),
                        icon: response.alert ? response.alert.icon : "success",
                        allowOutsideClick: false,
                        confirmButtonText: "Aceptar",
                        confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                    }).then(function () {
                        modalReciboAlta.modal("hide");
                        extraer_recibos();
                    });
                }
            },
        });
    }

    function renderizarEstadoRecibo(estado) {
        const estados = {
            I: { label: "Importado", className: "sac-status-view" },
            AP: { label: "Imputado", className: "sac-status-modify" },
            PA: { label: "Pagado", className: "sac-status-active" },
            E: { label: "Eliminado", className: "sac-status-inactive" },
        };

        const estadoConfig = estados[estado] || { label: estado || "Sin definir", className: "sac-status-neutral" };
        return `<span class="sac-status-badge ${estadoConfig.className}">${estadoConfig.label}</span>`;
    }

    function renderizarAccionesRecibo(recibo) {
        const botones = [
            `<button accion="btnVerRecibo" class="sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver recibo"><i class="ri-eye-fill"></i></button>`,
        ];

        if (recibo && recibo.estado === "I") {
            botones.push(
                `<button accion="btnEliminarRecibo" class="sac-btn-icon sac-btn-icon-sm sac-btn-delete" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar" aria-label="Eliminar recibo"><i class="ri-close-circle-fill"></i></button>`,
            );
        }

        return `<div class="sac-table-actions">${botones.join("")}</div>`;
    }

    function cargar_modal_detalle_recibo(data) {
        const cabecera = data && data.cabecera ? data.cabecera : {};
        const detalle = data && Array.isArray(data.detalle) ? data.detalle : [];
        const pagos = data && Array.isArray(data.pagos) ? data.pagos : [];
        const presentaciones = data && Array.isArray(data.presentaciones) ? data.presentaciones : [];

        $("#id_detalle_recibo").val(cabecera.id_recibo || "-");
        $("#estado_detalle_recibo").val(obtenerDescripcionEstadoRecibo(cabecera.estado));
        $("#nro_comprobante_detalle_recibo").val(cabecera.numero_comprobante || "-");
        $("#fecha_comprobante_detalle_recibo").val(cabecera.fecha_comprobante || "");
        $("#importe_total_detalle_recibo").val(Formatos.formatoMoneda(cabecera.total || 0));
        $("#cliente_nombre_detalle_recibo").val(cabecera.cliente || "-");
        $("#observaciones_detalle_recibo").val(cabecera.observaciones || cabecera.observacion || "-");
        $("#usuario_creacion_detalle_recibo").val(cabecera.usuario_creacion || "-");
        $("#fecha_creacion_detalle_recibo").val(cabecera.fecha_creacion || "-");

        inicializar_tabla_detalles_detalle_recibo(detalle);
        inicializar_tabla_pagos_detalle_recibo(pagos);
        inicializar_tabla_presentaciones_detalle_recibo(presentaciones);

        modalDetalleRecibo.modal("show");
    }

    function cargar_modal_modificar_recibo(data) {
        console.log("Modificar recibo", data);
    }

    function confirmar_eliminacion_recibo(recibo) {

        $.ajax({
            type: "POST",
            url: "app/Controllers/Tesoreria/Recibos_cobranza_backend.php",
            data: {
                backend: "eliminar_recibo",
                id_recibo: recibo.id_recibo,
            },
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    Swal.fire({
                        title: response.alert.title,
                        text: response.alert.message,
                        icon: response.alert.icon,
                        confirmButtonText: "Aceptar",
                        allowOutsideClick: false,
                        confirmButtonClass: "btn btn-success w-xs me-2 mt-2",
                    }).then(function (result) {
                        if (result.value || result.isConfirmed) {
                            window.location.reload(true);
                        }
                    });
                }
            },
        });


        // Swal.fire({
        //     title: "Pendiente",
        //     text: `La eliminación del recibo ${recibo.numero_comprobante || ""} todavía no está implementada.`,
        //     icon: "info",
        //     allowOutsideClick: false,
        //     confirmButtonText: "Aceptar",
        //     confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
        // });
    }

    function inicializar_tabla_detalles_detalle_recibo(detalle) {
        datatable_detalles_detalle_recibo.DataTable({
            destroy: true,
            data: detalle,
            columns: [
                {
                    data: "observaciones",
                    title: "Observaciones",
                    defaultContent: "-",
                },
                {
                    data: "importe",
                    title: "Importe",
                    className: "text-end",
                    defaultContent: 0,
                    render: function (data) {
                        return Formatos.formatoMoneda(data || 0);
                    },
                },
            ],
            language: { url: "public/json/Spanish.json", emptyTable: "Este recibo no tiene detalles cargados." },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
        });
    }

    function inicializar_tabla_pagos_detalle_recibo(pagos) {
        datatable_pagos_detalle_recibo.DataTable({
            destroy: true,
            data: pagos,
            columns: [
                {
                    data: "id_tipo_pago",
                    title: "Tipo Pago",
                    render: function (data) {
                        return obtenerDescripcionTipoPago(data);
                    },
                },
                {
                    data: "importe",
                    title: "Importe",
                    className: "text-end",
                    defaultContent: 0,
                    render: function (data) {
                        return Formatos.formatoMoneda(data || 0);
                    },
                },
                {
                    data: null,
                    title: "Cuenta",
                    render: function (data, type, row) {
                        return [row.nombre_banco, row.numero_cuenta, row.nombre_cuenta].filter(Boolean).join(" - ") || "-";
                    },
                },
                {
                    data: "estado",
                    title: "Estado",
                    className: "text-center",
                    defaultContent: "-",
                    render: function (data) {
                        return obtenerDescripcionEstadoPago(data);
                    },
                },
                { data: "observaciones", title: "Observaciones", defaultContent: "-" },
                { data: "numero_cheque", title: "Nro Cheque", className: "text-end", defaultContent: "-" },
                { data: "fecha_emision", title: "Fecha Emisión", className: "text-center", defaultContent: "-" },
                { data: "fecha_cobro", title: "Fecha Cobro", className: "text-center", defaultContent: "-" },
            ],
            language: { url: "public/json/Spanish.json", emptyTable: "Este recibo no tiene pagos cargados." },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
        });
    }

    function inicializar_tabla_presentaciones_detalle_recibo(presentaciones) {
        datatable_presentaciones_detalle_recibo.DataTable({
            destroy: true,
            data: presentaciones,
            columns: [
                { data: "id_presentacion", title: "Id Presentación", defaultContent: "-" },
                { data: "nombre_convenio", title: "Nombre Convenio", defaultContent: "-" },
                { data: "periodo", title: "Periodo", defaultContent: "-" },
                {
                    data: "importe",
                    title: "Importe",
                    className: "text-end",
                    defaultContent: 0,
                    render: function (data) {
                        return Formatos.formatoMoneda(data || 0);
                    },
                },
            ],
            language: { url: "public/json/Spanish.json", emptyTable: "Este recibo no tiene presentaciones cargadas." },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
        });
    }

    function construir_payload_recibo_cobranza() {
        return {
            backend: "nuevo_recibo_cobranza",
            datos: {
                cabecera: construir_cabecera_recibo(),
                detalle: obtener_detalle_recibo(),
                pagos: obtener_pagos_recibo(),
                presentaciones: obtener_presentaciones_recibo(),
            },
        };
    }

    function validar_tabla_pagos_alta() {
        if (!$.fn.DataTable || !$.fn.DataTable.isDataTable(datatable_pagos_alta)) {
            return false;
        }

        const cantidadPagos = datatable_pagos_alta.DataTable().rows().count();

        if (cantidadPagos > 0) {
            return true;
        }

        Swal.fire({
            title: "Alerta",
            text: "Debe cargar al menos un pago antes de guardar el recibo.",
            icon: "warning",
            allowOutsideClick: false,
            confirmButtonText: "Aceptar",
            confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
        });

        return false;
    }

    function construir_cabecera_recibo() {
        const clienteSeleccionado = obtenerClienteSeleccionado();

        return {
            cliente_id: clienteSeleccionado ? parseInt(clienteSeleccionado.id_cliente, 10) : null,
            cliente: clienteNombreAlta.val().trim(),
            numero_comprobante: $("#nro_comprobante_alta").val().trim(),
            fecha_comprobante: fechaComprobanteAlta.val(),
            total: formatearImportePayload(parseNumero(importeTotalAlta.val())),
            observacion: $("#observaciones_alta").val().trim(),
        };
    }

    function obtener_detalle_recibo() {
        if (!$.fn.DataTable || !$.fn.DataTable.isDataTable(datatable_detalles_alta)) {
            return [];
        }

        return datatable_detalles_alta
            .DataTable()
            .rows()
            .data()
            .toArray()
            .map(function (detalle) {
                return {
                    id_concepto: detalle.id_concepto || null,
                    observaciones: detalle.observaciones || "",
                    importe: formatearImportePayload(detalle.importe),
                };
            });
    }

    function obtener_pagos_recibo() {
        if (!$.fn.DataTable || !$.fn.DataTable.isDataTable(datatable_pagos_alta)) {
            return [];
        }

        return datatable_pagos_alta
            .DataTable()
            .rows()
            .data()
            .toArray()
            .map(function (pago) {
                return {
                    tipo_pago: pago.tipo_pago || null,
                    importe: formatearImportePayload(pago.importe),
                    id_cuenta: pago.id_cuenta || null,
                    observaciones: pago.observaciones || "",
                    numero_cheque: pago.numero_cheque || null,
                    fecha_emision: pago.fecha_emision || null,
                    fecha_cobro: pago.fecha_cobro || null,
                };
            });
    }

    function obtener_presentaciones_recibo() {
        if (!$.fn.DataTable || !$.fn.DataTable.isDataTable(datatable_presentaciones_alta)) {
            return [];
        }

        return datatable_presentaciones_alta
            .DataTable()
            .rows()
            .data()
            .toArray()
            .map(function (presentacion) {
                return {
                    id_presentacion: presentacion.id_presentacion || null,
                    importe: formatearImportePayload(presentacion.importe),
                };
            });
    }

    function resetearSeccionColapsable({ form, containerSelector, buttonSelector, titleSelector, defaultTitle }) {
        $(containerSelector).collapse("hide");
        $(titleSelector).text(defaultTitle);
        actualizarEstadoBotonCollapse($(buttonSelector), false);
    }

    function limpiarSeccionesColapsablesAlta() {
        resetearSeccionColapsable({
            form: formDetalleAlta,
            containerSelector: "#formContainerDetalleAlta",
            buttonSelector: "#btnAgregarDetalleAlta",
            titleSelector: "#formDetalleTitle_alta",
            defaultTitle: "Gestionar Detalle",
        });

        resetearSeccionColapsable({
            form: formPagoAlta,
            containerSelector: "#formContainerPagoAlta",
            buttonSelector: "#btnAgregarPagoAlta",
            titleSelector: "#formPagoTitle_alta",
            defaultTitle: "Gestionar Pago",
        });

        resetearSeccionColapsable({
            form: formPresentacionAlta,
            containerSelector: "#formContainerPresentacionesAlta",
            buttonSelector: "#btnAgregarPresentacionesAlta",
            titleSelector: "#formPresentacionTitle_alta",
            defaultTitle: "Gestionar Presentación",
        });
    }

    function limpiarModalAltaCompleto() {
        limpiarFormulario(formAltaRecibo);
        limpiarFormulario(formDetalleAlta);
        limpiarFormulario(formPagoAlta);
        limpiarFormulario(formPresentacionAlta);
        limpiarSeccionesColapsablesAlta();
        limpiarTablasAlta();
        importeTotalAlta.val(Formatos.formatoMoneda(0));
        fechaComprobanteAlta.val("");
    }

    function limpiarTablasAlta() {
        [datatable_detalles_alta, datatable_pagos_alta, datatable_presentaciones_alta].forEach(function (tabla) {
            if ($.fn.DataTable.isDataTable(tabla)) {
                tabla.DataTable().clear().draw();
            }
        });

        actualizar_total_alta_desde_pagos();
    }

    function limpiarFormulario(formulario) {
        if (!formulario || !formulario.length) {
            return;
        }

        formulario[0].reset();
        formulario.removeClass("was-validated");
        formulario.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");

        if (formulario.is(formPagoAlta)) {
            actualizarFormularioSegunTipoPago();
        }

        if (formulario.is(formPresentacionAlta)) {
            convenioAlta.val("");
            inicializarChoicesConvenioAlta();
            resetearPresentacionesConvenioAlta();
        }
    }

    function parseNumero(value) {
        return Formatos.parseNumero(value);
    }

    function formatearImportePayload(value) {
        return parseNumero(value).toFixed(2);
    }

    function eliminarFilaDatatable(datatable, buttonElement) {
        const tabla = datatable.DataTable();
        let row = $(buttonElement).closest("tr");
        let fila = tabla.row(row);

        if (!fila.data() && row.hasClass("child")) {
            row = row.prev();
            fila = tabla.row(row);
        }

        if (fila.data()) {
            fila.remove().draw();
        }
    }

    function actualizar_total_alta_desde_pagos() {
        if (!$.fn.DataTable || !$.fn.DataTable.isDataTable(datatable_pagos_alta)) {
            importeTotalAlta.val(Formatos.formatoMoneda(0));
            return;
        }

        const totalPagos = datatable_pagos_alta
            .DataTable()
            .rows()
            .data()
            .toArray()
            .reduce(function (acumulado, pago) {
                return acumulado + parseNumero(pago.importe);
            }, 0);

        importeTotalAlta.val(Formatos.formatoMoneda(totalPagos));
    }

    function aplicarSoloNumeros(selector) {
        $(selector).on("keypress", function (e) {
            // Obtener el código de la tecla
            const keyCode = e.which || e.keyCode;

            // Permitir: backspace, delete, tab, escape, enter
            if (keyCode === 8 || keyCode === 9 || keyCode === 27 || keyCode === 13 || keyCode === 46) {
                return;
            }

            // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
            if (
                (keyCode === 65 || keyCode === 67 || keyCode === 86 || keyCode === 88 || keyCode === 90) &&
                (e.ctrlKey === true || e.metaKey === true)
            ) {
                return;
            }

            // Permitir: home, end, left, right, down, up
            if (keyCode >= 35 && keyCode <= 40) {
                return;
            }

            // Solo permitir números (0-9)
            if (keyCode < 48 || keyCode > 57) {
                e.preventDefault();
                return false;
            }
        });

        // También bloquear paste de contenido no numérico
        $(selector).on("paste", function (e) {
            // Obtener el texto pegado
            const pastedText = (e.originalEvent || e).clipboardData.getData("text/plain");

            // Verificar si el texto contiene solo números
            if (!/^\d*$/.test(pastedText)) {
                e.preventDefault();
                return false;
            }
        });

        // Filtrar caracteres no numéricos si se pegan o escriben de otra forma
        $(selector).on("input", function () {
            const valor = $(this).val();
            const valorNumerico = valor.replace(/[^\d]/g, "");

            if (valor !== valorNumerico) {
                $(this).val(valorNumerico);
            }
        });
    }
});
