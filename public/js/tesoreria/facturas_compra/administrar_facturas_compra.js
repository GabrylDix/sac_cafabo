const ClassValidaciones = window.Validaciones;
const ClassFormatos = window.Formatos;
$(document).ready(function () {
    // ******************************* REFERENCIAS DOM ***************************************
    // Datatables
    const datatable_facturas_compra = $("#datatable_facturas_compra");
    const datatable_factura_detalle = $("#datatable_factura_detalle");
    const datatable_factura_detalle_modal = $("#datatable_factura_detalle_modal");
    const datatable_factura_detalle_mod = $("#datatable_factura_detalle_mod");
    // Formularios
    const form_cargar_factura_compra = $("#form_cargar_factura_compra");
    const form_agregar_detalle = $("#form_agregar_detalle");
    const formModFacturaCompra = $("#formModFacturaCompra");
    const form_agregar_detalle_mod = $("#form_agregar_detalle_mod");

    // Botones
    const btnNuevaFacturaCompra = $("#btnNuevaFacturaCompra");
    const btnAgregarFacturaCompra = $("#btnAgregarFacturaCompra");
    const btnConfirmarAltaDet = $("#btnConfirmarAltaDet");
    const btnNext = $("#btn_next");
    const btnGuardar_modificarFacturaCompra = $("#btnGuardar_modificarFacturaCompra");
    const btnConfirmarAltaDet_mod = $("#btnConfirmarAltaDet_mod");
    const btnConfirmarEditDet_mod = $("#btnConfirmarEditDet_mod");
    const btnCancelarEdit_mod = $("#btnCancelarEdit_mod");

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
    let choicesProveedor = {};
    let choicesConcepto = {};
    let proveedoresCache = [];
    let conceptosCache = [];
    let facturaCompraEnEdicion = null;

    // ******************************* INICIALIZACION ****************************************

    validarNumeroInput("#cai");
    validarNumeroInput("#cai_mod");
    extraer_proveedores();
    extraer_conceptos();
    inicializar_tabla_detalle_factura();
    inicializar_tabla_detalle_factura_modal();
    inicializar_tabla_detalle_factura_mod();
    inicializar_eventos_calculo_detalle();
    inicializar_eventos_calculo_detalle_mod();
    inicializar_validaciones_fechas();
    inicializar_validaciones_fechas_mod();
    inicializar_mascaras_importes();
    inicializar_mascaras_importes_mod();
    formateoNroFactura("#nro_comprobante");
    formateoNroFactura("#nro_comprobante_mod");
    recalcular_totales_detalle_form();
    recalcular_totales_detalle_form_mod();
    extraer_facturas_compra();

    // **************************************************************************************
    // ******************************* DATOS PRINCIPALES *************************************
    function extraer_facturas_compra() {
        $.ajax({
            url: "app/Controllers/Tesoreria/Facturas_compra_backend.php",
            type: "POST",
            data: { backend: "extraer_facturas_compras" },
            dataType: "json",
            success: function (response) {
                // console.log(response.data);
                if (response && response.success) {
                    cargar_tabla_facturas_compra(response.data);
                }
            },
        });
    }
    function cargar_tabla_facturas_compra(facturas) {
        datatable_facturas_compra.DataTable({
            destroy: true,
            data: facturas,
            columns: [
                { title: "Id Factura", className: "text-start align-middle", data: "id_factura" },
                {
                    title: "Comprobante",
                    data: null,
                    render: function (data) {
                        const numero = data.numero_factura || "-";
                        const tipo = data.tipo_factura || "-";
                        const fecha = data.fecha || "-";

                        return `<div class="data-doble-cell">
                                    <div>Nro: ${numero}</div>
                                    <small>Tipo: ${tipo} | Fecha: ${fecha}</small>
                                </div>`;
                    },
                },
                { title: "Descripción", data: "observaciones", defaultContent: "-", className: "text-start" },
                {
                    title: "Proveedor",
                    data: null,
                    render: function (data) {
                        return `<div class="data-doble-cell">
                                    ${data.proveedor}
                                    ${data.cuit_proveedor ? `<small>${data.cuit_proveedor}</small>` : ""}
                                </div>`;
                    },
                },
                {
                    title: "Importe Total",
                    data: "total",
                    className: "text-end",
                    defaultContent: 0,
                    render: function (data) {
                        return formatMoneda(data);
                    },
                },
                {
                    title: "Estado",
                    data: "estado",
                    className: "text-center align-middle",
                    defaultContent: "A",
                    render: function (data) {
                        switch (data) {
                            case "PE":
                                return '<span class="sac-status-badge sac-status-modify">Pendiente de Aprobación</span>';
                            case "AP":
                                return '<span class="sac-status-badge sac-status-active">Aprobado</span>';
                            case "LO":
                                return '<span class="sac-status-badge sac-status-view">En Lote</span>';
                            case "PA":
                                return '<span class="sac-status-badge sac-status-active">Pagado</span>';
                            case "E":
                                return '<span class="sac-status-badge sac-status-inactive">Eliminado</span>';
                            case "AN":
                                return '<span class="sac-status-badge sac-status-inactive">Anulado</span>';
                            default:
                                return '<span class="sac-status-badge sac-status-neutral">Desconocido</span>';
                        }
                    },
                },
                {
                    title: "Acciones",
                    data: null,
                    className: "text-center align-middle",
                    orderable: false,
                    render: function (data) {
                        switch (data.estado) {
                            case "PE":
                                return `<div class="sac-table-actions">
                                            <button accion="btnVer" class="sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver factura">
                                                <i class="ri-eye-fill"></i>
                                            </button>
                                            <button accion="btnEditar" class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar factura">
                                                <i class="ri-edit-2-fill"></i>
                                            </button>
                                            <button  accion="btnEliminar" class="sac-btn-icon sac-btn-icon-sm sac-btn-delete" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar" aria-label="Eliminar factura">
                                                <i class="ri-close-circle-fill"></i>
                                            </button>
                                            <button accion="btnConfirmarFactura" class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Aprobar Factura" aria-label="Aprobar factura">
                                                <i class="ri-check-double-line"></i>
                                            </button>
                                        </div>`;
                            case "AP":
                                return `<div class="sac-table-actions">
                                            <button accion="btnVer" class="sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver factura">
                                                <i class="ri-eye-fill"></i>
                                            </button>
                                            <button  accion="btnEliminar" class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Anular Factura" aria-label="Anular factura">
                                                <i class="ri-close-circle-fill"></i>
                                            </button>
                                          
                                        </div>`;
                            case "LO":
                            case "PA":
                            case "E":
                            case "AN":
                                return `<div class="sac-table-actions">
                                                <button accion="btnVer" class="sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver factura">
                                                    <i class="ri-eye-fill"></i>
                                                </button>
                                            </div>`;
                        }
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: "Buscar Facturas...",
            },
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            responsive: true,
            order: [[0, "desc"]],
            iDisplayLength: 10,
            lengthMenu: [
                [10, 20, 50, -1],
                [10, 20, 50, "Todos"],
            ],
        });
    }

    $("#datatable_facturas_compra").on("click", "button", function () {
        let opt = $(this).attr("accion");
        let row = $(this).closest("tr");
        let factura = datatable_facturas_compra.DataTable().row(row).data();

        if (!factura && row.hasClass("child")) {
            factura = datatable_facturas_compra.DataTable().row(row.prev()).data();
        }

        switch (opt) {
            case "btnVer":
                extraer_datos_factura(factura["id_factura"], cargar_modal_detalle_factura_compra);
                break;
            case "btnEditar":
                extraer_datos_factura(factura["id_factura"], cargar_modal_modificar_factura_compra);
                break;
            case "btnConfirmarFactura":
                mostrarAlerta({
                    title: "¿Confirmar esta factura de compra?",
                    text: "Una vez confirmada, esta factura no podrá ser editada ni eliminada. ¿Deseas continuar?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, confirmar",
                    cancelButtonText: "No, cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        confirmar_factura_compra(factura["id_factura"]);
                    }
                });
                break;
            case "btnEliminar":
                mostrarAlerta({
                    title: "Eliminar esta factura de compra?",
                    text: "Esta acción no se puede deshacer. ¿Deseas continuar?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "No, cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        eliminar_factura_compra(factura["id_factura"], factura["estado"]);
                    }
                });
                break;
        }
    });

    function extraer_datos_factura(id_factura, callback) {
        let dataString = {
            backend: "extraer_factura_compra",
            id_factura_compra: id_factura,
        };
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Tesoreria/Facturas_compra_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                $("#myAlert").modal("hide");
                if (response.success) {
                    if (typeof callback === "function") {
                        callback(response.data);
                    }
                } else {
                    mostrarAlerta({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#myAlert").modal("hide");
                mostrarAlerta({
                    icon: "error",
                    title: "Error de Conexión",
                    text: "No se pudo comunicar con el servidor. Por favor, revisa tu conexión a internet.",
                });
            },
        });
    }

    // **************************************************************************************
    // ******************************* MODAL VER DETALLE *************************************
    function cargar_modal_detalle_factura_compra(data) {
        const cabecera = data && data.cabecera ? data.cabecera : {};
        const detalle = data && Array.isArray(data.detalle) ? data.detalle : [];

        $("#tipo_factura_detalle").val(cabecera.tipo_factura || "-");
        $("#nro_comprobante_detalle").val(cabecera.numero_factura || "-");
        $("#fecha_comprobante_detalle").val(cabecera.fecha || "-");
        $("#fecha_vencimiento_detalle").val(cabecera.fecha_vencimiento || "");
        $("#cai_detalle").val(cabecera.cai || "-");
        $("#fecha_vencimiento_cai_detalle").val(cabecera.fecha_vencimiento_cai || "");
        $("#descripcion_factura_detalle").val(cabecera.observaciones || "-");
        $("#razon_social_detalle").val(cabecera.proveedor || "-");
        $("#cuit_prov_detalle").val(cabecera.cuit_proveedor || "-");

        datatable_factura_detalle_modal.DataTable().clear().rows.add(detalle).draw();
        actualizar_totales_modal_detalle(cabecera, detalle);

        $("#modalDetalleFacturaCompra").modal("show");
    }

    // **************************************************************************************
    // ************************** CONFIRMAR FACTURA DE COMPRA ******************************
    function confirmar_factura_compra(idFacturaCompra) {
        $.ajax({
            url: "app/Controllers/Tesoreria/Facturas_compra_backend.php",
            type: "POST",
            data: {
                backend: "confirmar_factura_compra",
                id_factura_compra: idFacturaCompra,
            },
            dataType: "json",
            success: function (response) {
                console.log(response);
                if (response && response.success) {
                    mostrarAlerta({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    }).then(() => {
                        extraer_facturas_compra();
                    });
                } else {
                    mostrarAlerta({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    });
                }
            },
        });
    }

    // **************************************************************************************
    // ************************************* ALTA *******************************************
    // Cabecera
    btnNuevaFacturaCompra.click(function () {
        $("#modalAgregarFacturaCompra").modal("show");
    });
    $("#btn_cerrar_modal ,#btn_cerrar_modal_x").click(function () {
        $("#modalAgregarFacturaCompra").modal("hide");
    });

    registrarValidacionFormulario(form_cargar_factura_compra, btnNext, function () {
        validar_relacion_fechas();
        actualizar_estado_visual_proveedor(true);
        $("#detalle_factura_compra").slideDown("slow");
    });

    // Detalle
    registrarValidacionFormulario(form_agregar_detalle, btnConfirmarAltaDet, function () {
        agregar_linea_dt();
    });
    function agregar_linea_dt() {
        addNewRow();
        actualizar_totales_detalle();
        setTimeout(function () {
            limpiarFormulario(form_agregar_detalle);
        }, 0);
        $("#modalAgregarFacturaCompra").modal("show");
    }
    function addNewRow() {
        datatable_factura_detalle
            .DataTable()
            .row.add({
                concepto_id: $("#concepto_id_det").val(),
                concepto_descripcion:
                    $("#concepto_id_det option:selected").text().split(" - ").slice(1).join(" - ") ||
                    $("#descripcion_concepto_det").val() ||
                    "",
                descripcion: $("#descripcion_det").val(),
                cuenta_contable: $("#cuenta_contable_det").val(),
                cantidad: parseInt($("#cantidad").val()),
                precio_unitario: parseNumero($("#precio_unitario").val()),
                subtotal: parseNumero($("#subtotal").val()),
                porcentaje_bonificacion: parseNumero($("#porc_bonif").val()),
                importe_bonificacion: parseNumero($("#monto_bonif").val()),
                total: parseNumero($("#total").val()),
                porcentaje_iva: $("#iva_sel option:selected").text(),
                id_alicuota: $("#iva_sel").val(),
                importe_iva: parseNumero($("#total_iva").val()),
                total_iva: parseNumero($("#total_c_iva").val()),
                detalle: $("#observaciones").val(),
            })
            .draw();
    }

    // Tabla de detalle
    function obtener_columnas_detalle(actionMode = null) {
        const columns = [
            {
                data: null,
                defaultContent: "-",
                render: function (data, type, row) {
                    return row.concepto_descripcion || obtener_descripcion_concepto(row.concepto_id) || "-";
                },
            },
            { data: "descripcion", defaultContent: "-" },
            { data: "cantidad", className: "text-end", defaultContent: 0 },
            {
                data: "precio_unitario",
                className: "text-end",
                defaultContent: 0,
                render: function (data) {
                    return formatMoneda(data);
                },
            },
            {
                data: "subtotal",
                className: "text-end",
                defaultContent: 0,
                render: function (data) {
                    return formatMoneda(data);
                },
            },
            {
                data: "porcentaje_bonificacion",
                className: "text-end",
                defaultContent: 0,
                render: function (data) {
                    return `${formatNumero(data)}%`;
                },
            },
            {
                data: "importe_bonificacion",
                className: "text-end",
                defaultContent: 0,
                render: function (data) {
                    return formatMoneda(data);
                },
            },
            {
                data: "total",
                className: "text-end",
                defaultContent: 0,
                render: function (data, type, row) {
                    return formatMoneda(obtenerNetoLinea(row));
                },
            },
            {
                data: null,
                className: "text-end",
                defaultContent: "0%",
                render: function (data, type, row) {
                    return row.porcentaje_iva || obtenerTextoAlicuota(row.id_alicuota || row.Id_alicuota);
                },
            },
            {
                data: "importe_iva",
                className: "text-end",
                defaultContent: 0,
                render: function (data) {
                    return formatMoneda(data);
                },
            },
            {
                data: "total_iva",
                className: "text-end",
                defaultContent: 0,
                render: function (data) {
                    return formatMoneda(data);
                },
            },
            {
                data: null,
                defaultContent: "-",
                render: function (data, type, row) {
                    return row.detalle || row.concepto || "-";
                },
            },
        ];

        if (actionMode === "alta") {
            columns.push({
                data: null,
                className: "text-center",
                orderable: false,
                render: function () {
                    return `<button type="button" class="sac-btn-icon sac-btn-icon-sm sac-btn-delete" accion="eliminarDetalle" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar detalle" aria-label="Eliminar detalle"><i class="ri-delete-bin-fill"></i></button>`;
                },
            });
        } else if (actionMode === "mod") {
            columns.push({
                data: null,
                className: "text-center",
                orderable: false,
                render: function () {
                    return `<div class="sac-table-actions">
                                <button type="button" class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" accion="editarDetalleMod" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar detalle" aria-label="Editar detalle"><i class="ri-edit-2-fill"></i></button>
                                <button type="button" class="sac-btn-icon sac-btn-icon-sm sac-btn-delete" accion="eliminarDetalleMod" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar detalle" aria-label="Eliminar detalle"><i class="ri-delete-bin-fill"></i></button>
                            </div>`;
                },
            });
        }

        return columns;
    }

    function inicializar_tabla_detalle_factura() {
        datatable_factura_detalle.DataTable({
            destroy: true,
            data: [],
            columns: obtener_columnas_detalle("alta"),
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                emptyTable: "Aun no se agregaron detalles.",
            },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
            autoWidth: false,
        });
    }

    function inicializar_tabla_detalle_factura_modal() {
        datatable_factura_detalle_modal.DataTable({
            destroy: true,
            data: [],
            columns: obtener_columnas_detalle(),
            language: {
                url: "public/json/Spanish.json",
                emptyTable: "Esta factura no tiene detalles cargados.",
            },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
            autoWidth: false,
        });
    }

    function inicializar_tabla_detalle_factura_mod() {
        datatable_factura_detalle_mod.DataTable({
            destroy: true,
            data: [],
            columns: obtener_columnas_detalle("mod"),
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                emptyTable: "Esta factura no tiene detalles cargados.",
            },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
            autoWidth: false,
        });
    }

    // Calculo y formato de detalle

    function parseNumero(value) {
        return ClassFormatos.parseNumero(value);
    }

    function formatNumero(value) {
        return ClassFormatos.formatoNumero(value, 2);
    }

    function formatMoneda(value) {
        return ClassFormatos.formatoMoneda(value);
    }

    function mostrarAlerta(options) {
        return Swal.fire({
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-success w-xs me-2 mt-2",
                cancelButton: "btn btn-danger w-xs mt-2",
            },
            ...options,
        });
    }

    function obtenerTextoAlicuota(idAlicuota) {
        const mapaAlicuotas = {
            3: "0%",
            4: "10.5%",
            5: "21%",
            6: "27%",
            8: "5%",
            9: "2.5%",
        };

        return mapaAlicuotas[parseInt(idAlicuota, 10)] || "0%";
    }

    function obtenerPorcentajeIvaDesdeFila(rowData) {
        const textoIva = rowData.porcentaje_iva || obtenerTextoAlicuota(rowData.id_alicuota || rowData.Id_alicuota);
        return parseNumero(String(textoIva).replace("%", ""));
    }

    function obtenerNetoLinea(rowData) {
        if (!rowData) {
            return 0;
        }

        if (rowData.total !== undefined && rowData.total !== null && rowData.total !== "") {
            return parseNumero(rowData.total);
        }

        return Math.max(parseNumero(rowData.subtotal) - parseNumero(rowData.importe_bonificacion), 0);
    }

    function setValorInput(selector, value) {
        $(selector).val(formatNumero(value));
    }

    function normalizarFechaIso(value) {
        return value ? String(value).trim() : "";
    }

    function validar_relacion_fechas() {
        const fechaComprobante = normalizarFechaIso($("#fecha_comprobante").val());
        const $fechaVencimiento = $("#fecha_vencimiento_comprobante");
        const $fechaVencimientoCai = $("#fecha_vencimiento_comprobante_cai");
        const mensajeError = "Debe ser mayor o igual a la fecha del comprobante.";

        $fechaVencimiento.attr("min", fechaComprobante || "");
        $fechaVencimientoCai.attr("min", fechaComprobante || "");

        [$fechaVencimiento, $fechaVencimientoCai].forEach(function ($campo) {
            const fechaCampo = normalizarFechaIso($campo.val());
            const esInvalida = Boolean(fechaComprobante && fechaCampo && fechaCampo < fechaComprobante);

            if ($campo.length) {
                $campo[0].setCustomValidity(esInvalida ? mensajeError : "");
                $campo.toggleClass("is-invalid", esInvalida);
            }
        });
    }

    function inicializar_validaciones_fechas() {
        $(document).on(
            "change input",
            "#fecha_comprobante, #fecha_vencimiento_comprobante, #fecha_vencimiento_comprobante_cai",
            function () {
                validar_relacion_fechas();
            },
        );

        validar_relacion_fechas();
    }

    function validar_relacion_fechas_mod() {
        const fechaComprobante = normalizarFechaIso($("#fecha_comprobante_mod").val());
        const $fechaVencimiento = $("#fecha_vencimiento_comprobante_mod");
        const $fechaVencimientoCai = $("#fecha_vencimiento_comprobante_cai_mod");
        const mensajeError = "Debe ser mayor o igual a la fecha del comprobante.";

        $fechaVencimiento.attr("min", fechaComprobante || "");
        $fechaVencimientoCai.attr("min", fechaComprobante || "");

        [$fechaVencimiento, $fechaVencimientoCai].forEach(function ($campo) {
            const fechaCampo = normalizarFechaIso($campo.val());
            const esInvalida = Boolean(fechaComprobante && fechaCampo && fechaCampo < fechaComprobante);

            if ($campo.length) {
                $campo[0].setCustomValidity(esInvalida ? mensajeError : "");
                $campo.toggleClass("is-invalid", esInvalida);
            }
        });
    }

    function inicializar_validaciones_fechas_mod() {
        $(document).on(
            "change input",
            "#fecha_comprobante_mod, #fecha_vencimiento_comprobante_mod, #fecha_vencimiento_comprobante_cai_mod",
            function () {
                validar_relacion_fechas_mod();
            },
        );

        validar_relacion_fechas_mod();
    }

    function inicializar_mascaras_importes() {
        ClassFormatos.aplicarMascaraMonedaInput("#precio_unitario", function () {
            recalcular_totales_detalle_form();
        });

        ClassFormatos.aplicarMascaraPorcentajeInput("#porc_bonif", function () {
            recalcular_totales_detalle_form();
        });
    }

    function inicializar_mascaras_importes_mod() {
        ClassFormatos.aplicarMascaraMonedaInput("#precio_unitario_mod", function () {
            recalcular_totales_detalle_form_mod();
        });

        ClassFormatos.aplicarMascaraPorcentajeInput("#porc_bonif_mod", function () {
            recalcular_totales_detalle_form_mod();
        });
    }

    function actualizar_estado_visual_proveedor(forzarValidacion = false) {
        const $selectProveedor = $("#id_proveedor");
        const esValido = Boolean($selectProveedor.val());
        const $choices = $selectProveedor.closest(".choices");
        const $choicesInner = $choices.find(".choices__inner");
        const mostrarEstado =
            forzarValidacion ||
            $selectProveedor.hasClass("is-valid") ||
            $selectProveedor.hasClass("is-invalid") ||
            form_cargar_factura_compra.hasClass("was-validated");

        if (!mostrarEstado) {
            $selectProveedor.removeClass("is-valid is-invalid");

            if ($choicesInner.length) {
                $choicesInner.removeClass("border border-danger border-success");
            }

            return;
        }

        $selectProveedor.toggleClass("is-valid", esValido);
        $selectProveedor.toggleClass("is-invalid", !esValido);

        if ($choicesInner.length) {
            $choicesInner.toggleClass("border border-danger", !esValido);
            $choicesInner.toggleClass("border border-success", esValido);
        }
    }

    function actualizar_estado_visual_proveedor_mod(forzarValidacion = false) {
        const $selectProveedor = $("#id_proveedor_mod");
        const esValido = Boolean($selectProveedor.val());
        const $choices = $selectProveedor.closest(".choices");
        const $choicesInner = $choices.find(".choices__inner");
        const mostrarEstado =
            forzarValidacion ||
            $selectProveedor.hasClass("is-valid") ||
            $selectProveedor.hasClass("is-invalid") ||
            formModFacturaCompra.hasClass("was-validated");

        if (!mostrarEstado) {
            $selectProveedor.removeClass("is-valid is-invalid");

            if ($choicesInner.length) {
                $choicesInner.removeClass("border border-danger border-success");
            }

            return;
        }

        $selectProveedor.toggleClass("is-valid", esValido);
        $selectProveedor.toggleClass("is-invalid", !esValido);

        if ($choicesInner.length) {
            $choicesInner.toggleClass("border border-danger", !esValido);
            $choicesInner.toggleClass("border border-success", esValido);
        }
    }

    function registrarValidacionFormulario(form, btnValidar, callback) {
        if (!form.length || !btnValidar.length || typeof callback !== "function") {
            return;
        }

        if (ClassValidaciones && typeof ClassValidaciones.validarFormulario === "function") {
            ClassValidaciones.validarFormulario(form, btnValidar, callback);
        } else {
            form.find("input, select, textarea").on("input change", function () {
                $(this).toggleClass("is-valid", $(this).is(":valid"));
                $(this).toggleClass("is-invalid", !$(this).is(":valid"));
            });

            btnValidar.on("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (!form[0].checkValidity()) {
                    form.addClass("was-validated");
                    return;
                }

                callback();
                form.addClass("was-validated");
            });
        }

        form.on("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();
            btnValidar.trigger("click");
        });
    }

    function sincronizar_proveedor_seleccionado(selector, prefix = "") {
        const $selectProveedor = $(selector);

        if (!$selectProveedor.length) {
            return;
        }

        completar_datos_proveedor($selectProveedor.val(), prefix);

        if (prefix === "_mod") {
            actualizar_estado_visual_proveedor_mod(true);
            actualizar_estado_validacion_cabecera_duplicados_mod();
            return;
        }

        actualizar_estado_visual_proveedor(true);
        actualizar_estado_validacion_cabecera_duplicados();
    }

    function registrar_eventos_proveedor(selector, prefix = "") {
        const $selectProveedor = $(selector);

        if (!$selectProveedor.length) {
            return;
        }

        $selectProveedor.off(".facturaCompraProveedor");
        $selectProveedor.on("change.facturaCompraProveedor addItem.facturaCompraProveedor", function () {
            sincronizar_proveedor_seleccionado(selector, prefix);
        });
    }

    function obtenerPorcentajeIvaSeleccionado() {
        const textoIva = $("#iva_sel option:selected").text().trim();
        return parseNumero(textoIva.replace("%", ""));
    }

    function recalcular_totales_detalle_form() {
        const cantidad = Math.max(parseNumero($("#cantidad").val()), 0);
        const precioUnitario = Math.max(parseNumero($("#precio_unitario").val()), 0);
        const porcentajeBonificacion = Math.max(parseNumero($("#porc_bonif").val()), 0);
        const porcentajeIva = Math.max(obtenerPorcentajeIvaSeleccionado(), 0);

        const subtotal = cantidad * precioUnitario;
        const montoBonificado = Math.min(subtotal, subtotal * (porcentajeBonificacion / 100));
        const totalNeto = subtotal - montoBonificado;
        const totalIva = totalNeto * (porcentajeIva / 100);
        const totalConIva = totalNeto + totalIva;

        setValorInput("#subtotal", subtotal);
        setValorInput("#monto_bonif", montoBonificado);
        setValorInput("#total", totalNeto);
        setValorInput("#total_iva", totalIva);
        setValorInput("#total_c_iva", totalConIva);
    }

    function obtenerPorcentajeIvaSeleccionadoMod() {
        const textoIva = $("#iva_sel_mod option:selected").text().trim();
        return parseNumero(textoIva.replace("%", ""));
    }

    function setValorInputMod(selector, value) {
        $(selector).val(formatNumero(value));
    }

    function inicializar_eventos_calculo_detalle() {
        $(document).on("input", "#cantidad, #porc_bonif", function () {
            recalcular_totales_detalle_form();
        });

        $(document).on("change", "#iva_sel", function () {
            recalcular_totales_detalle_form();
        });
    }

    function inicializar_eventos_calculo_detalle_mod() {
        $(document).on("input", "#cantidad_mod, #porc_bonif_mod", function () {
            recalcular_totales_detalle_form_mod();
        });

        $(document).on("change", "#iva_sel_mod", function () {
            recalcular_totales_detalle_form_mod();
        });
    }

    function recalcular_totales_detalle_form_mod() {
        const cantidad = Math.max(parseNumero($("#cantidad_mod").val()), 0);
        const precioUnitario = Math.max(parseNumero($("#precio_unitario_mod").val()), 0);
        const porcentajeBonificacion = Math.max(parseNumero($("#porc_bonif_mod").val()), 0);
        const porcentajeIva = Math.max(obtenerPorcentajeIvaSeleccionadoMod(), 0);

        const subtotal = cantidad * precioUnitario;
        const montoBonificado = Math.min(subtotal, subtotal * (porcentajeBonificacion / 100));
        const totalNeto = subtotal - montoBonificado;
        const totalIva = totalNeto * (porcentajeIva / 100);
        const totalConIva = totalNeto + totalIva;

        setValorInputMod("#subtotal_mod", subtotal);
        setValorInputMod("#monto_bonif_mod", montoBonificado);
        setValorInputMod("#total_mod", totalNeto);
        setValorInputMod("#total_iva_mod", totalIva);
        setValorInputMod("#total_c_iva_mod", totalConIva);
    }

    // Totales resumen
    function calcular_totales_desde_items(items, totalFacturaCabecera = null) {
        let netoGravado = 0;
        let netoNoGravado = 0;
        let totalBonificacion = 0;
        let totalIva = 0;
        let totalFactura = 0;

        (items || []).forEach(function (item) {
            const rowData = item || {};
            const netoLinea = obtenerNetoLinea(rowData);
            const bonificacionLinea = parseNumero(rowData.importe_bonificacion);
            const ivaLinea = parseNumero(rowData.importe_iva);
            const totalLinea = parseNumero(rowData.total_iva);
            const porcentajeIva = obtenerPorcentajeIvaDesdeFila(rowData);

            if (porcentajeIva === 0) {
                netoNoGravado += netoLinea;
            } else {
                netoGravado += netoLinea;
            }

            totalBonificacion += bonificacionLinea;
            totalIva += ivaLinea;
            totalFactura += totalLinea;
        });

        if (totalFacturaCabecera !== null && totalFacturaCabecera !== undefined) {
            totalFactura = parseNumero(totalFacturaCabecera);
        }

        return {
            netoGravado,
            netoNoGravado,
            totalBonificacion,
            totalIva,
            totalFactura,
        };
    }

    function actualizar_totales_detalle() {
        let totales = calcular_totales_desde_items([]);

        if ($.fn.DataTable && $.fn.DataTable.isDataTable(datatable_factura_detalle)) {
            totales = calcular_totales_desde_items(datatable_factura_detalle.DataTable().rows().data().toArray());
        }

        $("#imp_net_grav").text(formatMoneda(totales.netoGravado));
        $("#imp_net_no_grav").text(formatMoneda(totales.netoNoGravado));
        $("#bonificacion_total").text(formatMoneda(totales.totalBonificacion));
        $("#iva").text(formatMoneda(totales.totalIva));
        $("#total_factura_general").text(formatMoneda(totales.totalFactura));
    }

    function actualizar_totales_modal_detalle(cabecera, detalle) {
        const totales = calcular_totales_desde_items(detalle, cabecera.total);

        $("#imp_net_grav_detalle").text(formatMoneda(totales.netoGravado));
        $("#imp_net_no_grav_detalle").text(formatMoneda(totales.netoNoGravado));
        $("#bonificacion_total_detalle").text(formatMoneda(totales.totalBonificacion));
        $("#iva_detalle").text(formatMoneda(totales.totalIva));
        $("#total_factura_general_detalle").text(formatMoneda(totales.totalFactura));
    }

    function actualizar_totales_mod_detalle(cabecera, detalle) {
        const totales = calcular_totales_desde_items(detalle, cabecera.total);

        $("#imp_net_grav_mod").text(formatMoneda(totales.netoGravado));
        $("#imp_net_no_grav_mod").text(formatMoneda(totales.netoNoGravado));
        $("#bonificacion_total_mod").text(formatMoneda(totales.totalBonificacion));
        $("#iva_mod").text(formatMoneda(totales.totalIva));
        $("#total_factura_general_mod").text(formatMoneda(totales.totalFactura));
    }

    // ****************************************************************************************** */
    // ******************************* MODIFICAR FACTURA DE COMPRA ****************************** */

    function cargar_modal_modificar_factura_compra(data) {
        const cabecera = data && data.cabecera ? data.cabecera : {};
        const detalle = data && Array.isArray(data.detalle) ? data.detalle : [];

        facturaCompraEnEdicion = cabecera.id_factura || null;

        $("#id_factura_mod").val(cabecera.id_factura || "");
        $("#tipo_factura_mod").val(cabecera.tipo_factura || "");
        $("#nro_comprobante_mod").val(cabecera.numero_factura || "");
        $("#fecha_comprobante_mod").val(cabecera.fecha || "");
        $("#fecha_vencimiento_comprobante_mod").val(cabecera.fecha_vencimiento || "");
        $("#cai_mod").val(cabecera.cai || "");
        $("#fecha_vencimiento_comprobante_cai_mod").val(cabecera.fecha_vencimiento_cai || "");
        $("#descripcion_mod").val(cabecera.observaciones || "");
        $("#id_proveedor_mod").val(cabecera.id_proveedor || "");

        if (choicesProveedor["#id_proveedor_mod"] && cabecera.id_proveedor) {
            choicesProveedor["#id_proveedor_mod"].setChoiceByValue(String(cabecera.id_proveedor));
        }

        completar_datos_proveedor(cabecera.id_proveedor || "", "_mod");

        datatable_factura_detalle_mod.DataTable().clear().rows.add(detalle).draw();
        actualizar_totales_mod_detalle(cabecera, detalle);
        limpiar_form_detalle_mod();
        validar_relacion_fechas_mod();
        actualizar_estado_visual_proveedor_mod(false);

        $("#modalModificarFacturaCompra").modal("show");
    }

    function recargar_factura_en_edicion(mensajeExito = null) {
        if (!facturaCompraEnEdicion) {
            return;
        }

        extraer_datos_factura(facturaCompraEnEdicion, function (data) {
            cargar_modal_modificar_factura_compra(data);
            extraer_facturas_compra();

            if (mensajeExito) {
                mostrarAlerta({
                    title: "Exito",
                    text: mensajeExito,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    showCloseButton: true,
                    allowOutsideClick: false,
                });
            }
        });
    }

    // Persistencia de alta
    btnAgregarFacturaCompra.on("click", function (e) {
        e.preventDefault();
        validar_relacion_fechas();

        const validTable = !datatable_factura_detalle.DataTable().rows().count();

        if (!form_cargar_factura_compra[0].checkValidity()) {
            form_cargar_factura_compra.addClass("was-validated");
            mostrarAlerta({
                title: "Alerta",
                text: "Complete los datos obligatorios de la cabecera antes de continuar.",
                icon: "error",
                confirmButtonText: "Aceptar",
                showCloseButton: true,
                allowOutsideClick: false,
            });
            return;
        }

        if (validTable) {
            mostrarAlerta({
                title: "Alerta",
                text: "La tabla esta vacia. Agrega elementos antes de realizar esta accion.",
                icon: "error",
                confirmButtonText: "Aceptar",
                showCloseButton: true,
                allowOutsideClick: false,
            });
        } else {
            let detalleArray = obtener_detalle_factura();
            const payload = construir_payload_factura_compra(detalleArray);

            validar_disponibilidad_factura_compra(payload, function (disponible) {
                if (!disponible) {
                    return;
                }

                mostrarAlerta({
                    title: "Alerta",
                    text: "¿Esta seguro que desea agregar la factura de compra?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    showCloseButton: true,
                    allowOutsideClick: false,
                }).then(function (result) {
                    if (result.value || result.isConfirmed) {
                        cargar_factura_compras(payload);
                    }
                });
            });
        }
    });

    function obtener_detalle_factura() {
        if (!$.fn.DataTable || !$.fn.DataTable.isDataTable(datatable_factura_detalle)) {
            return [];
        }

        return datatable_factura_detalle
            .DataTable()
            .rows()
            .data()
            .toArray()
            .map(function (detalle) {
                return {
                    concepto_id: detalle.concepto_id || "",
                    concepto_descripcion: detalle.concepto_descripcion || obtener_descripcion_concepto(detalle.concepto_id) || "",
                    descripcion: detalle.descripcion || "",
                    cantidad: parseNumero(detalle.cantidad),
                    precio_unitario: parseNumero(detalle.precio_unitario),
                    subtotal: parseNumero(detalle.subtotal),
                    porcentaje_bonificacion: parseNumero(detalle.porcentaje_bonificacion),
                    importe_bonificacion: parseNumero(detalle.importe_bonificacion),
                    total: parseNumero(detalle.total),
                    porcentaje_iva: detalle.porcentaje_iva || "0%",
                    id_alicuota: detalle.id_alicuota || "",
                    importe_iva: parseNumero(detalle.importe_iva),
                    total_iva: parseNumero(detalle.total_iva),
                    cuenta_contable: detalle.cuenta_contable || "",
                    detalle: detalle.detalle || "",
                };
            });
    }

    function obtener_detalle_form_mod() {
        return {
            id_detalle: $("#id_detalle_mod").val(),
            concepto_id: $("#concepto_id_det_mod").val(),
            concepto_descripcion: $("#descripcion_concepto_det_mod").val(),
            descripcion: $("#descripcion_det_mod").val(),
            cantidad: parseNumero($("#cantidad_mod").val()),
            precio_unitario: parseNumero($("#precio_unitario_mod").val()),
            subtotal: parseNumero($("#subtotal_mod").val()),
            porcentaje_bonificacion: parseNumero($("#porc_bonif_mod").val()),
            importe_bonificacion: parseNumero($("#monto_bonif_mod").val()),
            total: parseNumero($("#total_mod").val()),
            porcentaje_iva: $("#iva_sel_mod option:selected").text(),
            id_alicuota: $("#iva_sel_mod").val(),
            importe_iva: parseNumero($("#total_iva_mod").val()),
            total_iva: parseNumero($("#total_c_iva_mod").val()),
            cuenta_contable: $("#cuenta_contable_det_mod").val(),
            detalle: $("#observaciones_mod").val(),
        };
    }

    // Payloads y AJAX
    function construir_payload_factura_compra(detalleFactura) {
        return {
            backend: "nueva_factura_compra",
            datos: {
                cabecera: {
                    nro_comprobante: $("#nro_comprobante").val(),
                    tipo_factura: $("#tipo_factura").val(),
                    fecha_comprobante: $("#fecha_comprobante").val(),
                    fecha_vencimiento: $("#fecha_vencimiento_comprobante").val(),
                    cai: $("#cai").val(),
                    fecha_vencimiento_cai: $("#fecha_vencimiento_comprobante_cai").val(),
                    descripcion: $("#descripcion").val(),
                    id_proveedor: $("#id_proveedor").val(),
                    imp_net_grav: parseNumero($("#imp_net_grav").text()),
                    imp_net_no_grav: parseNumero($("#imp_net_no_grav").text()),
                    iva: parseNumero($("#iva").text()),
                    total_factura: parseNumero($("#total_factura_general").text()),
                },
                detalle: detalleFactura,
                // percepciones: percepcionesFactura,
                datos_proveedor: {
                    razon_social_proveedor: $("#razon_social").val(),
                    cuit_proveedor: $("#cuit_prov").val(),
                },
            },
        };
    }

    function construir_payload_factura_compra_mod() {
        return {
            backend: "modificar_factura_compra",
            datos: {
                id_factura: $("#id_factura_mod").val(),
                cabecera: {
                    nro_comprobante: $("#nro_comprobante_mod").val(),
                    tipo_factura: $("#tipo_factura_mod").val(),
                    fecha_comprobante: $("#fecha_comprobante_mod").val(),
                    fecha_vencimiento: $("#fecha_vencimiento_comprobante_mod").val(),
                    cai: $("#cai_mod").val(),
                    fecha_vencimiento_cai: $("#fecha_vencimiento_comprobante_cai_mod").val(),
                    descripcion: $("#descripcion_mod").val(),
                    id_proveedor: $("#id_proveedor_mod").val(),
                    imp_net_grav: parseNumero($("#imp_net_grav_mod").text()),
                    imp_net_no_grav: parseNumero($("#imp_net_no_grav_mod").text()),
                    iva: parseNumero($("#iva_mod").text()),
                    total_factura: parseNumero($("#total_factura_general_mod").text()),
                },
                datos_proveedor: {
                    razon_social_proveedor: $("#razon_social_mod").val(),
                    cuit_proveedor: $("#cuit_prov_mod").val(),
                },
            },
        };
    }

    function cargar_factura_compras(dataString) {
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Tesoreria/Facturas_compra_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                $("#myAlert").modal("hide");
                const success = response.success || false;
                const alertData = response.alert || null;
                const mensajeOk = response.message || "La factura de compra se registro correctamente.";
                const mensajeError = response.message || "Ocurrio un error durante el proceso.";

                if (success) {
                    mostrarAlerta({
                        title: alertData ? alertData.title : "Exito",
                        text: alertData ? alertData.message || alertData.text : mensajeOk,
                        icon: alertData ? alertData.icon : "success",
                        confirmButtonText: "Aceptar",
                        showCloseButton: true,
                        allowOutsideClick: false,
                    }).then(function (result) {
                        if (result.value || result.isConfirmed) {
                            location.reload();
                        }
                    });
                } else {
                    mostrarAlerta({
                        title: alertData ? alertData.title : "Error",
                        text: alertData ? alertData.message || alertData.text : mensajeError,
                        icon: alertData ? alertData.icon : "error",
                        confirmButtonText: "Aceptar",
                        showCloseButton: true,
                        allowOutsideClick: false,
                    });
                }
            },
            error: function () {
                $("#myAlert").modal("hide");
                mostrarAlerta({
                    title: "Error de Conexion",
                    text: "No se pudo comunicar con el servidor.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    showCloseButton: true,
                    allowOutsideClick: false,
                });
            },
        });
    }

    function guardar_cambios_factura_compra(dataString) {
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Tesoreria/Facturas_compra_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                $("#myAlert").modal("hide");

                if (response && response.success) {
                    mostrarAlerta({
                        title: response.alert ? response.alert.title : "Exito",
                        text: response.message || "La factura de compra se actualizo correctamente.",
                        icon: response.alert ? response.alert.icon : "success",
                        confirmButtonText: "Aceptar",
                        showCloseButton: true,
                        allowOutsideClick: false,
                    }).then(function () {
                        $("#modalModificarFacturaCompra").modal("hide");
                        extraer_facturas_compra();
                    });
                } else {
                    const errors = response && response.errors ? response.errors : {};
                    actualizar_estado_validacion_cabecera_duplicados_mod(errors);
                    mostrarAlerta({
                        title: response && response.alert ? response.alert.title : "Error",
                        text: response && response.message ? response.message : "No se pudo actualizar la factura.",
                        icon: response && response.alert ? response.alert.icon : "error",
                        confirmButtonText: "Aceptar",
                        showCloseButton: true,
                        allowOutsideClick: false,
                    });
                }
            },
            error: function () {
                $("#myAlert").modal("hide");
                mostrarAlerta({
                    title: "Error de Conexion",
                    text: "No se pudo comunicar con el servidor.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    showCloseButton: true,
                    allowOutsideClick: false,
                });
            },
        });
    }

    function ejecutar_accion_detalle_mod(backend, dataPayload, mensajeExito) {
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Tesoreria/Facturas_compra_backend.php",
            data: {
                backend,
                datos: dataPayload,
            },
            dataType: "json",
            success: function (response) {
                $("#myAlert").modal("hide");

                if (response && response.success) {
                    recargar_factura_en_edicion(mensajeExito);
                } else {
                    mostrarAlerta({
                        title: response && response.alert ? response.alert.title : "Error",
                        text: response && response.message ? response.message : "No se pudo actualizar el detalle.",
                        icon: response && response.alert ? response.alert.icon : "error",
                        confirmButtonText: "Aceptar",
                        showCloseButton: true,
                        allowOutsideClick: false,
                    });
                }
            },
            error: function () {
                $("#myAlert").modal("hide");
                mostrarAlerta({
                    title: "Error de Conexion",
                    text: "No se pudo comunicar con el servidor.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    showCloseButton: true,
                    allowOutsideClick: false,
                });
            },
        });
    }

    function actualizar_estado_validacion_cabecera_duplicados(errors = {}) {
        const existeNumero = Boolean(errors.numero_factura);
        const existeCai = Boolean(errors.cai);

        $("#nro_comprobante")[0].setCustomValidity(
            existeNumero ? "Ya existe una factura con ese número para el proveedor seleccionado." : "",
        );
        $("#cai")[0].setCustomValidity(existeCai ? "Ya existe una factura con ese CAI para el proveedor seleccionado." : "");

        $("#nro_comprobante").toggleClass("is-invalid", existeNumero);
        $("#cai").toggleClass("is-invalid", existeCai);
    }

    function actualizar_estado_validacion_cabecera_duplicados_mod(errors = {}) {
        const existeNumero = Boolean(errors.numero_factura);
        const existeCai = Boolean(errors.cai);

        $("#nro_comprobante_mod")[0].setCustomValidity(
            existeNumero ? "Ya existe una factura con ese número para el proveedor seleccionado." : "",
        );
        $("#cai_mod")[0].setCustomValidity(existeCai ? "Ya existe una factura con ese CAI para el proveedor seleccionado." : "");

        $("#nro_comprobante_mod").toggleClass("is-invalid", existeNumero);
        $("#cai_mod").toggleClass("is-invalid", existeCai);
    }

    function validar_disponibilidad_factura_compra(payload, callback, options = {}) {
        const modo = options.mode || "alta";
        const limpiarValidacion =
            modo === "mod" ? actualizar_estado_validacion_cabecera_duplicados_mod : actualizar_estado_validacion_cabecera_duplicados;
        const actualizarValidacion =
            modo === "mod" ? actualizar_estado_validacion_cabecera_duplicados_mod : actualizar_estado_validacion_cabecera_duplicados;

        limpiarValidacion();

        $.ajax({
            type: "POST",
            url: "app/Controllers/Tesoreria/Facturas_compra_backend.php",
            data: {
                backend: "validar_disponibilidad_factura_compra",
                datos: {
                    cabecera: payload.datos.cabecera,
                    id_factura: options.id_factura || null,
                },
            },
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    callback(true);
                    return;
                }

                const errors = response && response.errors ? response.errors : {};
                actualizarValidacion(errors);
                mostrarAlerta({
                    title: response && response.alert ? response.alert.title : "Error",
                    text: response && response.message ? response.message : "No se pudo validar la factura de compra.",
                    icon: response && response.alert ? response.alert.icon : "error",
                    confirmButtonText: "Aceptar",
                    showCloseButton: true,
                    allowOutsideClick: false,
                });
                callback(false);
            },
            error: function () {
                mostrarAlerta({
                    title: "Error de Conexion",
                    text: "No se pudo validar la disponibilidad de la factura.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    showCloseButton: true,
                    allowOutsideClick: false,
                });
                callback(false);
            },
        });
    }

    // **************************************************************************************
    // ******************************* ELIMINAR FACTURA DE COMPRA ***************************

    function eliminar_factura_compra(idFactura, estado) {
        let datatString = { backend: "eliminar_factura_compra", id_factura_compra: idFactura, estado: estado };
        $.ajax({
            url: "app/Controllers/Tesoreria/Facturas_compra_backend.php",
            type: "POST",
            data: datatString,
            dataType: "json",
            success: function (response) {
                console.log(response);
                if (response && response.success) {
                    mostrarAlerta({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    }).then(() => {
                        extraer_facturas_compra();
                    });
                } else {
                    mostrarAlerta({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    });
                }
            },
        });
    }

    // **************************************************************************************
    // ************************ PROVEEDORES Y SELECTS AUXILIARES *****************************
    function extraer_proveedores() {
        let dataString = { backend: "extraer_proveedores" };
        $("#myAlert").modal("show");
        $.ajax({
            data: dataString,
            url: "app/Controllers/Proveedores/Proveedores_backend.php",
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                $("#myAlert").modal("hide");
                cargar_select_proveedores(response.data, ["#id_proveedor", "#id_proveedor_mod"]);
            },
        });
    }

    function extraer_conceptos() {
        $.ajax({
            data: { backend: "extraer_conceptos" },
            url: "app/Controllers/Conceptos/Conceptos_backend.php",
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                cargar_select_conceptos(response && response.data ? response.data : [], ["#concepto_id_det", "#concepto_id_det_mod"]);
            },
        });
    }

    function limpiar_datos_proveedor(prefix = "") {
        $("#id_cod_proveedor" + prefix).val("");
        $("#razon_social" + prefix).val("");
        $("#cuit_prov" + prefix).val("");
    }

    function completar_datos_proveedor(idProveedor, prefix = "") {
        const proveedor = proveedoresCache.find((item) => String(item.id_proveedor) === String(idProveedor));

        if (!proveedor) {
            limpiar_datos_proveedor(prefix);
            return;
        }

        $("#id_cod_proveedor" + prefix).val(proveedor.id_proveedor || "");
        $("#razon_social" + prefix).val(proveedor.razon_social || "");
        $("#cuit_prov" + prefix).val(proveedor.cuit || "");
    }

    function cargar_select_proveedores(proveedores, selectors = "#id_proveedor") {
        proveedoresCache = Array.isArray(proveedores) ? proveedores : [];

        if (typeof selectors === "string") {
            selectors = [selectors];
        }

        selectors.forEach((sel) => {
            const $selectProveedor = $(sel);
            if ($selectProveedor.length === 0) return;

            if (choicesProveedor[sel]) {
                choicesProveedor[sel].destroy();
                choicesProveedor[sel] = null;
            }

            const previousValue = $selectProveedor.val();
            $selectProveedor.empty();
            $selectProveedor.append('<option value="">Seleccione un proveedor...</option>');

            proveedoresCache.forEach((proveedor) => {
                const option = `<option value="${proveedor.id_proveedor}">${proveedor.id_proveedor} - ${proveedor.razon_social}</option>`;
                $selectProveedor.append(option);
            });

            const valueToRestore = proveedoresCache.some((proveedor) => String(proveedor.id_proveedor) === String(previousValue))
                ? String(previousValue)
                : "";

            $selectProveedor.val(valueToRestore);

            try {
                if (typeof Choices !== "undefined") {
                    choicesProveedor[sel] = new Choices($selectProveedor[0], {
                        ...CHOICES_CONFIG,
                        searchPlaceholderValue: "Buscar proveedor...",
                        noResultsText: "No se encontraron proveedores",
                    });

                    if (valueToRestore) {
                        choicesProveedor[sel].setChoiceByValue(valueToRestore);
                    }
                }
            } catch (error) {
                console.error(`Error al inicializar Choices.js para ${sel}:`, error);
            }

            const prefix = sel === "#id_proveedor_mod" ? "_mod" : "";
            registrar_eventos_proveedor(sel, prefix);
            completar_datos_proveedor($selectProveedor.val(), prefix);

            if (prefix === "_mod") {
                actualizar_estado_visual_proveedor_mod(false);
            } else {
                actualizar_estado_visual_proveedor(false);
            }
        });
    }

    function limpiar_datos_concepto(prefix = "") {
        $("#descripcion_concepto_det" + prefix).val("");
        $("#cuenta_contable_det" + prefix).val("");
    }

    function obtener_descripcion_concepto(idConcepto) {
        const concepto = conceptosCache.find((item) => String(item.id_concepto) === String(idConcepto));
        return concepto ? concepto.descripcion || "" : "";
    }

    function obtener_texto_cuenta_concepto(concepto) {
        if (!concepto) {
            return "";
        }

        const codigo = concepto.codigo_cuenta ? String(concepto.codigo_cuenta).trim() : "";
        const nombre = concepto.nombre_cuenta ? String(concepto.nombre_cuenta).trim() : "";

        if (codigo && nombre) {
            return `${codigo} - ${nombre}`;
        }

        if (codigo) {
            return codigo;
        }

        if (nombre) {
            return nombre;
        }

        return concepto.cuenta_contable ? String(concepto.cuenta_contable) : "";
    }

    function completar_datos_concepto(idConcepto, prefix = "") {
        const concepto = conceptosCache.find((item) => String(item.id_concepto) === String(idConcepto));

        if (!concepto) {
            limpiar_datos_concepto(prefix);
            return;
        }

        $("#descripcion_concepto_det" + prefix).val(concepto.descripcion || "");
        $("#cuenta_contable_det" + prefix).val(obtener_texto_cuenta_concepto(concepto));
    }

    function cargar_select_conceptos(conceptos, selectors = "#concepto_id_det") {
        conceptosCache = Array.isArray(conceptos) ? conceptos : [];

        if (typeof selectors === "string") {
            selectors = [selectors];
        }

        selectors.forEach((sel) => {
            const $selectConcepto = $(sel);
            if ($selectConcepto.length === 0) return;

            if (choicesConcepto[sel]) {
                choicesConcepto[sel].destroy();
                choicesConcepto[sel] = null;
            }

            const previousValue = $selectConcepto.val();
            $selectConcepto.empty();
            $selectConcepto.append('<option value="">Seleccione un concepto...</option>');

            conceptosCache.forEach((concepto) => {
                const option = `<option value="${concepto.id_concepto}">${concepto.id_concepto} - ${concepto.descripcion}</option>`;
                $selectConcepto.append(option);
            });

            const valueToRestore = conceptosCache.some((concepto) => String(concepto.id_concepto) === String(previousValue))
                ? String(previousValue)
                : "";

            $selectConcepto.val(valueToRestore);

            try {
                if (typeof Choices !== "undefined") {
                    choicesConcepto[sel] = new Choices($selectConcepto[0], {
                        ...CHOICES_CONFIG,
                        searchPlaceholderValue: "Buscar concepto...",
                        noResultsText: "No se encontraron conceptos",
                    });

                    if (valueToRestore) {
                        choicesConcepto[sel].setChoiceByValue(valueToRestore);
                    }
                }
            } catch (error) {
                console.error(`Error al inicializar Choices.js para ${sel}:`, error);
            }

            const prefix = sel === "#concepto_id_det_mod" ? "_mod" : "";
            completar_datos_concepto($selectConcepto.val(), prefix);
        });
    }

    // **************************************************************************************
    // ****************************** EVENTOS Y UTILIDADES ***********************************

    $(document).on("change", "#id_proveedor", function () {
        sincronizar_proveedor_seleccionado("#id_proveedor");
    });

    $(document).on("change", "#id_proveedor_mod", function () {
        sincronizar_proveedor_seleccionado("#id_proveedor_mod", "_mod");
    });

    $(document).on("change", "#concepto_id_det", function () {
        completar_datos_concepto($(this).val());
    });

    $(document).on("change", "#concepto_id_det_mod", function () {
        completar_datos_concepto($(this).val(), "_mod");
    });

    $(document).on("input", "#nro_comprobante, #cai", function () {
        $(this)[0].setCustomValidity("");
        $(this).removeClass("is-invalid");
    });

    $(document).on("input", "#nro_comprobante_mod, #cai_mod", function () {
        $(this)[0].setCustomValidity("");
        $(this).removeClass("is-invalid");
    });

    $("#modalModificarFacturaCompra").on("hidden.bs.modal", function () {
        facturaCompraEnEdicion = null;
        formModFacturaCompra.removeClass("was-validated");
        datatable_factura_detalle_mod.DataTable().clear().draw();
        limpiar_form_detalle_mod();
        actualizar_estado_validacion_cabecera_duplicados_mod();
    });

    datatable_factura_detalle.on("click", "button[accion='eliminarDetalle']", function () {
        datatable_factura_detalle.DataTable().row($(this).closest("tr")).remove().draw();
        actualizar_totales_detalle();
    });

    datatable_factura_detalle_mod.on("click", "button[accion='editarDetalleMod']", function () {
        const row = $(this).closest("tr");
        let detalle = datatable_factura_detalle_mod.DataTable().row(row).data();

        if (!detalle && row.hasClass("child")) {
            detalle = datatable_factura_detalle_mod.DataTable().row(row.prev()).data();
        }

        if (!detalle) {
            return;
        }

        $("#id_detalle_mod").val(detalle.id_detalle || "");
        $("#concepto_id_det_mod").val(detalle.concepto_id || "");
        if (choicesConcepto["#concepto_id_det_mod"]) {
            if (detalle.concepto_id) {
                choicesConcepto["#concepto_id_det_mod"].setChoiceByValue(String(detalle.concepto_id));
            } else {
                choicesConcepto["#concepto_id_det_mod"].removeActiveItems();
            }
        }
        completar_datos_concepto(detalle.concepto_id || "", "_mod");
        $("#descripcion_det_mod").val(detalle.descripcion || "");
        $("#cantidad_mod").val(parseNumero(detalle.cantidad) || 1);
        $("#precio_unitario_mod").val(formatNumero(detalle.precio_unitario));
        $("#porc_bonif_mod").val(formatNumero(detalle.porcentaje_bonificacion));
        $("#iva_sel_mod").val(detalle.id_alicuota || detalle.Id_alicuota || "3");
        $("#observaciones_mod").val(detalle.detalle || detalle.concepto || "");
        recalcular_totales_detalle_form_mod();
        alternar_modo_edicion_detalle_mod(true);
    });

    datatable_factura_detalle_mod.on("click", "button[accion='eliminarDetalleMod']", function () {
        const row = $(this).closest("tr");
        let detalle = datatable_factura_detalle_mod.DataTable().row(row).data();

        if (!detalle && row.hasClass("child")) {
            detalle = datatable_factura_detalle_mod.DataTable().row(row.prev()).data();
        }

        if (!detalle || !detalle.id_detalle) {
            return;
        }

        mostrarAlerta({
            title: "Alerta",
            text: "¿Desea eliminar el detalle seleccionado?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            showCloseButton: true,
            allowOutsideClick: false,
        }).then(function (result) {
            if (result.value || result.isConfirmed) {
                ejecutar_accion_detalle_mod(
                    "eliminar_detalle_factura_compra",
                    {
                        id_factura: $("#id_factura_mod").val(),
                        id_detalle: detalle.id_detalle,
                    },
                    "El detalle se elimino correctamente.",
                );
            }
        });
    });

    registrarValidacionFormulario(form_agregar_detalle_mod, btnConfirmarAltaDet_mod, function () {
        ejecutar_accion_detalle_mod(
            "agregar_detalle_factura_compra",
            {
                id_factura: $("#id_factura_mod").val(),
                detalle: obtener_detalle_form_mod(),
            },
            "El detalle se agrego correctamente.",
        );
    });

    btnConfirmarEditDet_mod.on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!form_agregar_detalle_mod[0].checkValidity()) {
            form_agregar_detalle_mod.addClass("was-validated");
            return;
        }

        ejecutar_accion_detalle_mod(
            "modificar_detalle_factura_compra",
            {
                id_factura: $("#id_factura_mod").val(),
                detalle: obtener_detalle_form_mod(),
            },
            "El detalle se actualizo correctamente.",
        );
    });

    btnCancelarEdit_mod.on("click", function () {
        limpiar_form_detalle_mod();
    });

    btnGuardar_modificarFacturaCompra.on("click", function (event) {
        event.preventDefault();
        validar_relacion_fechas_mod();
        actualizar_estado_visual_proveedor_mod(true);

        if (!formModFacturaCompra[0].checkValidity()) {
            formModFacturaCompra.addClass("was-validated");
            return;
        }

        const payload = construir_payload_factura_compra_mod();

        validar_disponibilidad_factura_compra(
            payload,
            function (disponible) {
                if (!disponible) {
                    formModFacturaCompra.addClass("was-validated");
                    return;
                }

                mostrarAlerta({
                    title: "Alerta",
                    text: "¿Desea guardar los cambios de la factura de compra?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    showCloseButton: true,
                    allowOutsideClick: false,
                }).then(function (result) {
                    if (result.value || result.isConfirmed) {
                        guardar_cambios_factura_compra(payload);
                    }
                });
            },
            {
                mode: "mod",
                id_factura: $("#id_factura_mod").val(),
            },
        );
    });

    // Formateo y limpieza
    function formateoNroFactura(inputSelector) {
        const $input = $(inputSelector);

        if ($input.length === 0 || $input.data("cleaveFacturaInicializado")) {
            return;
        }

        $input.data("cleaveFacturaInicializado", true);

        let cleaveDelimiter = new Cleave(inputSelector, {
            delimiter: "-",
            blocks: [5, 8],
            uppercase: true,
        });

        // Evento blur para autocompletar con ceros al salir del campo
        $input.on("blur", function () {
            let rawValue = cleaveDelimiter.getRawValue();
            let blocks = cleaveDelimiter.properties.blocks;
            let paddedValue = "";

            // Rellenar cada bloque con ceros
            let start = 0;
            for (let i = 0; i < blocks.length; i++) {
                let end = start + blocks[i];
                let blockValue = rawValue.substring(start, end);
                paddedValue += blockValue.padStart(blocks[i], "0");
                start = end;
            }

            cleaveDelimiter.setRawValue(paddedValue);
        });
    }
    function validarNumeroInput(selector) {
        ClassFormatos.validarNumeroInput(selector);
    }

    function alternar_modo_edicion_detalle_mod(estaEditando) {
        btnConfirmarAltaDet_mod.toggleClass("d-none", estaEditando);
        btnConfirmarEditDet_mod.toggleClass("d-none", !estaEditando);
        btnCancelarEdit_mod.toggleClass("d-none", !estaEditando);
    }

    function limpiar_form_detalle_mod() {
        limpiarFormulario(form_agregar_detalle_mod, {
            porcentajeSelector: "#porc_bonif_mod",
            recalculate: function () {
                recalcular_totales_detalle_form_mod();
            },
        });
        $("#id_detalle_mod").val("");
        $("#concepto_id_det_mod").val("");
        if (choicesConcepto["#concepto_id_det_mod"]) {
            choicesConcepto["#concepto_id_det_mod"].removeActiveItems();
        }
        limpiar_datos_concepto("_mod");
        $("#cantidad_mod").val(1);
        $("#iva_sel_mod").val("3");
        recalcular_totales_detalle_form_mod();
        alternar_modo_edicion_detalle_mod(false);
    }

    function limpiarFormulario(formulario, options = {}) {
        if (!formulario || formulario.length === 0) {
            return;
        }

        formulario[0].reset();
        formulario.removeClass("was-validated");
        formulario.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");

        setTimeout(function () {
            formulario.find("input, select, textarea").removeClass("is-valid is-invalid");
        }, 0);

        $(options.porcentajeSelector || "#porc_bonif").val("0");

        if (formulario.is("#form_agregar_detalle")) {
            $("#concepto_id_det").val("");
            if (choicesConcepto["#concepto_id_det"]) {
                choicesConcepto["#concepto_id_det"].removeActiveItems();
            }
            limpiar_datos_concepto();
        }

        if (typeof options.recalculate === "function") {
            options.recalculate();
        } else {
            recalcular_totales_detalle_form();
        }
    }
});
