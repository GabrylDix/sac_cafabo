/** Clase para validar los formularios
 * @author Franco Falk
 * @type {Validaciones}
 */
const ClassValidaciones = window.Validaciones;
const ClassFormatos = window.Formatos;

$(document).ready(function () {
    // ******************************* REFERENCIAS DOM ***************************************
    // Datatable
    const datatable_asientos_contables = $("#datatable_asientos_contables");
    const datatable_asiento_detalle_modal = $("#datatable_asiento_detalle_modal");
    const datatable_asiento_detalle = $("#datatable_asiento_detalle");
    const datatable_asiento_detalle_mod = $("#datatable_asiento_detalle_mod");
    // Forms
    const form_cargar_asiento_contable = $("#form_cargar_asiento_contable");
    const form_agregar_detalle_asiento = $("#form_agregar_detalle_asiento");
    const formDetalleMod = $("#form_agregar_detalle_asiento_mod");
    const formModAsientoContable = $("#formModAsientoContable");
    // Btns
    const btnAgregarDetalleAsiento = $("#btnAgregarDetalleAsiento");
    const btnAgregarAsientoContable = $("#btnAgregarAsientoContable");
    const btnGuardarModificar = $("#btnGuardar_modificarAsientoContable");
    // Selects
    const selectCuentaContableAlta = $("#id_cuenta_contable_alta");
    const selectCuentaContableMod = $("#id_cuenta_contable_det_mod");

    // Alertas
    const alertaEstadoAsientoAlta = $("#alerta_estado_asiento_alta");
    const iconoAlertaEstadoAsientoAlta = $("#icono_alerta_estado_asiento_alta");
    const mensajeAlertaEstadoAsientoAlta = $("#mensaje_alerta_estado_asiento_alta");
    const diferenciaGeneral = $("#diferencia_general");

    // Choices
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
    };

    // Variables de estado
    let choicesCuentaContableAlta = null;
    let timeoutBusquedaCuentaContableAlta = null;
    let cuentasContablesCache = [];
    let choicesCuentaContableMod = null;
    let timeoutBusquedaCuentaContableMod = null;
    let cuentasContablesCacheMod = [];
    let cuentaSeleccionadaMod = null;
    let filaDetalleMod = null;
    let numeroBusquedaCuentaMod = 0;
    let fechaAplicacionOriginalMod = null;

    // ******************************* INICIALIZACION ****************************************
    extraer_asientos_contables();
    inicializar_choices_cuenta_contable_alta();
    buscar_cuentas_contables_alta("");
    inicializar_tabla_detalle_asiento();
    inicializar_mascaras_importes_alta();
    validar_importes_detalle_asiento();
    actualizar_estado_boton_confirmar_asiento();
    inicializar_validacion_form_detalle_asiento();
    inicializar_validacion_form_asiento();
    inicializar_choices_cuenta_contable_mod();
    buscar_cuentas_contables_mod("");
    inicializar_mascaras_importes_mod();

    // **************************************************************************************
    // ******************************* DATOS PRINCIPALES ************************************
    // *************************************************************************************
    function extraer_asientos_contables() {
        $.ajax({
            url: "app/Controllers/Contabilidad/Asientos_contables_backend.php",
            type: "POST",
            data: { backend: "extraer_asientos_contables" },
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    cargar_tabla_asientos_contables(response.data);
                }
            },
        });
    }

    function cargar_tabla_asientos_contables(asientos) {
        datatable_asientos_contables.DataTable({
            destroy: true,
            data: asientos,
            columns: [
                {
                    title: "Asiento",
                    data: null,
                    className: "text-start",
                    orderData: [6],
                    render: function (data) {
                        const numero = data.id_asiento || "-";
                        const ejercicio = data.ejercicio || "-";
                        const fechaAplicacion = formatFecha(data.fecha_aplicacion);

                        return `<div class="data-doble-cell">
                                    <div>${numero}</div>
                                    <small>Ejercicio: ${ejercicio} | Fecha: ${fechaAplicacion}</small>
                                </div>`;
                    },
                },
                {
                    title: "Origen",
                    data: null,
                    className: "text-start",
                    render: function (data) {
                        const tipoOrigen = obtener_texto_tipo_origen(data.tipo_origen);
                        let relacionAsiento = "";

                        if (data.id_asiento_original != null) {
                            relacionAsiento = `Asiento original: ${data.id_asiento_original}`;
                        } else if (data.id_asiento_reverso != null) {
                            relacionAsiento = `Asiento reverso: ${data.id_asiento_reverso}`;
                        }

                        return `<div class="data-doble-cell">
                                    <div>Tipo: ${tipoOrigen}</div>
                                    ${relacionAsiento ? `<small>${relacionAsiento}</small>` : ""}
                                </div>`;
                    },
                },
                {
                    title: "Detalle",
                    data: null,
                    className: "text-start",
                    render: function (data) {
                        const descripcion = data.descripcion || "-";
                        const nota = data.nota || "";

                        return `<div class="data-doble-cell">
                                    <div>${descripcion}</div>
                                    ${nota ? `<small>${nota}</small>` : ""}
                                </div>`;
                    },
                },
                {
                    title: "Alta",
                    data: null,
                    className: "text-start",
                    render: function (data) {
                        const usuarioCreacion = data.usuario_creacion || "-";
                        const fechaCreacion = formatFecha(data.fecha_creacion);

                        return `<div class="data-doble-cell">
                                    <div>Alta: ${usuarioCreacion}</div>
                                    <small>${fechaCreacion}</small>
                                </div>`;
                    },
                },
                {
                    title: "Estado",
                    data: "estado",
                    className: "text-center align-middle",
                    defaultContent: "AC",
                    render: function (data) {
                        switch (data) {
                            case "B":
                                return '<span class="sac-status-badge sac-status-active">Balanceado</span>';
                            case "I":
                            case "AN":
                                return '<span class="sac-status-badge sac-status-inactive">Inactivo</span>';
                            default:
                                return `<span class="sac-status-badge sac-status-neutral">${data || "Sin definir"}</span>`;
                        }
                    },
                },
                {
                    title: "Acciones",
                    data: null,
                    className: "text-center",
                    orderable: false,
                    render: function (data) {
                        if (data.id_asiento_original != null || data.tiene_reverso == 1) {
                            return `<div class="sac-table-actions">
                                        <button accion="btnVer" class="btn sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver asiento">
                                            <i class="ri-eye-fill"></i>
                                        </button>
                                    </div>`;
                        } else {
                            return `<div class="sac-table-actions">
                                        <button accion="btnVer" class="btn sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver asiento">
                                            <i class="ri-eye-fill"></i>
                                        </button>
                                        <button accion="btnModificar" class="btn sac-btn-icon sac-btn-icon-sm sac-btn-modify" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Modificar" aria-label="Modificar asiento">
                                            <i class="ri-edit-2-line"></i>
                                        </button>
                                        <button accion="btnReverso" class="btn sac-btn-icon sac-btn-icon-sm sac-btn-revert" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Reverso" aria-label="Generar asiento de reverso">
                                            <i class="ri-arrow-go-back-line"></i>
                                        </button>
                                    </div>`;
                        }
                    },
                },
                {
                    title: "_id_orden",
                    data: "id_asiento",
                    visible: false,
                    searchable: false,
                },
            ],
            order: [[6, "desc"]],
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: "Buscar Asientos...",
            },
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            responsive: true,
            iDisplayLength: 20,
            lengthMenu: [
                [10, 20, 50, -1],
                [10, 20, 50, "Todos"],
            ],
        });
    }

    $("#datatable_asientos_contables").on("click", "button", async function () {
        let opt = $(this).attr("accion");
        let row = $(this).closest("tr");
        let asiento = datatable_asientos_contables.DataTable().row(row).data();

        switch (opt) {
            case "btnVer":
                try {
                    cargar_modal_detalle(await extraer_datos_asiento(asiento.id_asiento));
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error al obtener el asiento",
                        text: error.message || "Ocurrió un error al obtener los datos del asiento.",
                    });
                }
                break;
            case "btnModificar":
                try {
                    cargar_modal_modificar(await extraer_datos_asiento(asiento.id_asiento));
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error al obtener el asiento",
                        text: error.message || "Ocurrió un error al obtener los datos del asiento.",
                    });
                }
                break;
            case "btnReverso":
                Swal.fire({
                    title: "Se va a generar un asiento de reverso",
                    text: "¿Desea confirmar esta operación?",
                    icon: "question",
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonText: "Confirmar",
                    cancelButtonText: "Cancelar",
                }).then(function (result) {
                    if (result.isConfirmed) {
                        revertir_asiento_contable(asiento.id_asiento);
                    }
                });
                break;
        }
    });

    async function extraer_datos_asiento(id_asiento) {
        const response = await $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Asientos_contables_backend.php",
            data: { backend: "extraer_asiento_contable", id_asiento },
            dataType: "json",
        });

        if (!response?.success) {
            throw new Error(response?.message || "No se pudo obtener el asiento.");
        }

        return response.data;
    }

    // ***************************************************************************************
    // ******************************* MODAL VER DETALLE ASIENTO CONTABLE ********************
    // ***************************************************************************************

    function cargar_modal_detalle(data) {
        cargar_cabecera_modal_detalle(data.cabecera);
        cargar_tabla_detalle_asiento_contable(data.detalle);
        actualizar_totales_modal_detalle(data.detalle);
        $("#modalDetalleAsientoContable").modal("show");
    }
    function cargar_cabecera_modal_detalle(cabecera) {
        $("#nro_asiento_detalle").text(cabecera.id_asiento || "-");
        $("#fecha_asiento_detalle").text(formatFecha(cabecera.fecha_aplicacion || cabecera.fecha || ""));
        $("#estado_asiento_detalle").text(obtener_texto_estado(cabecera.estado || "A"));
        $("#descripcion_asiento_detalle").text(cabecera.descripcion || "-");
        $("#observaciones_asiento_detalle").text(cabecera.observaciones || cabecera.nota || "-");
    }
    function cargar_tabla_detalle_asiento_contable(detalle) {
        datatable_asiento_detalle_modal.DataTable({
            destroy: true,
            data: detalle,
            columns: [
                {
                    title: "Cod. Cuenta",
                    data: "codigo_cuenta",
                    defaultContent: "-",
                    className: "text-center",
                },
                {
                    title: "Cuenta",
                    data: "nombre_cuenta",
                    defaultContent: "-",
                    className: "text-start",
                },
                {
                    title: "Descripción",
                    data: "descripcion",
                    defaultContent: "-",
                    render: function (descripcion, tipo) {
                        return tipo === "display"
                            ? $("<span>")
                                  .text(descripcion || "-")
                                  .html()
                            : descripcion;
                    },
                },
                {
                    title: "Debe",
                    data: "debe",
                    className: "text-end",
                    defaultContent: 0,
                    render: function (data) {
                        return formatMoneda(data);
                    },
                },
                {
                    title: "Haber",
                    data: "haber",
                    className: "text-end",
                    defaultContent: 0,
                    render: function (data) {
                        return formatMoneda(data);
                    },
                },
            ],
        });
    }

    // ******************* TOTALES *******************
    function actualizar_totales_modal_detalle(detalle) {
        const totales = calcular_totales_desde_items(detalle);

        $("#total_debe_detalle").text(formatMoneda(totales.totalDebe));
        $("#total_haber_detalle").text(formatMoneda(totales.totalHaber));
        $("#total_saldo_detalle").text(formatMoneda(totales.saldo));
    }

    function calcular_totales_desde_items(items) {
        let totalDebe = 0;
        let totalHaber = 0;

        (items || []).forEach(function (item) {
            totalDebe += parseNumero(item.debe);
            totalHaber += parseNumero(item.haber);
        });

        return {
            totalDebe: totalDebe,
            totalHaber: totalHaber,
            saldo: totalDebe - totalHaber,
        };
    }

    // ***************************************************************************************
    // ******************************* NUEVO ASIENTO CONTABLE ********************************
    // **************************************************************************************

    // NUEVO ASIENTO CONTABLE
    $("#btnNuevoAsientoContable").on("click", function () {
        limpiar_form_asiento_contable();
        actualizar_estado_boton_confirmar_asiento();
        $("#modalAgregarAsientoContable").modal("show");
    });

    // **********  EXTRAER CUENTAS PARA SELECCIONAR EN DETALLE ASIENTO CONTABLE  **********
    selectCuentaContableAlta.on("change", function () {
        completar_datos_cuenta_contable_alta($(this).val());
    });

    selectCuentaContableAlta.on("choice", function (e) {
        completar_datos_cuenta_contable_alta(e?.detail?.choice?.value || "");
    });

    selectCuentaContableAlta.on("search", function buscarCuentasContablesConDelay(e) {
        const termino = String(e?.detail?.value || "").trim();
        clearTimeout(timeoutBusquedaCuentaContableAlta);
        timeoutBusquedaCuentaContableAlta = setTimeout(function () {
            buscar_cuentas_contables_alta(termino);
        }, 250);
    });

    // **********   MANEJO DE DETALLE EN MODAL NUEVO ASIENTO CONTABLE  **********
    function inicializar_tabla_detalle_asiento() {
        datatable_asiento_detalle.DataTable({
            destroy: true,
            data: [],
            columns: obtener_columnas_detalle_asiento(),
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

    function obtener_columnas_detalle_asiento() {
        return [
            {
                title: "Cuenta Contable",
                data: "nombre_cuenta",
                defaultContent: "-",
            },
            {
                title: "Codigo",
                data: "codigo_cuenta",
                defaultContent: "-",
                className: "text-center",
            },
            {
                title: "Descripcion",
                data: "descripcion",
                defaultContent: "-",
                render: function (descripcion, tipo) {
                    return tipo === "display"
                        ? $("<span>")
                              .text(descripcion || "-")
                              .html()
                        : descripcion;
                },
            },
            {
                title: "Debe",
                data: "debe",
                className: "text-end",
                defaultContent: 0,
                render: function (data) {
                    return formatMoneda(data);
                },
            },
            {
                title: "Haber",
                data: "haber",
                className: "text-end",
                defaultContent: 0,
                render: function (data) {
                    return formatMoneda(data);
                },
            },
            {
                title: "Nota / Detalle",
                data: "detalle",
                defaultContent: "-",
            },
            {
                title: "Acciones",
                data: null,
                className: "text-center",
                orderable: false,
                render: function () {
                    return '<button type="button" class="btn sac-btn-delete sac-btn-icon sac-btn-icon-sm" accion="eliminarDetalle" title="Eliminar detalle" aria-label="Eliminar detalle"><i class="ri-delete-bin-fill"></i></button>';
                },
            },
        ];
    }

    function agregar_linea_dt_asiento() {
        datatable_asiento_detalle
            .DataTable()
            .row.add({
                id_cuenta: $("#id_cuenta_contable_alta").val(),
                codigo_cuenta: $("#codigo_cuenta_contable_alta").val(),
                nombre_cuenta: obtener_nombre_cuenta_contable_alta($("#id_cuenta_contable_alta").val()),
                descripcion: $("#descripcion_asiento").val().trim(),
                debe: parseNumero($("#debe_alta").val()),
                haber: parseNumero($("#haber_alta").val()),
                detalle: $("#detalle_alta").val(),
            })
            .draw();

        actualizar_totales_detalle_alta();
        limpiar_form_detalle_asiento();
    }

    $("#descripcion_asiento").on("input", function () {
        const descripcion = $(this).val().trim();
        datatable_asiento_detalle
            .DataTable()
            .rows()
            .every(function () {
                const detalle = this.data();
                this.data({ ...detalle, descripcion });
            });
        datatable_asiento_detalle.DataTable().draw(false);
    });

    datatable_asiento_detalle.on("click", "button", function () {
        const row = $(this).closest("tr");
        datatable_asiento_detalle.DataTable().row(row).remove().draw();
        actualizar_totales_detalle_alta();
    });

    // **********  ALTA ASIENTO CONTABLE  **********
    function inicializar_validacion_form_asiento() {
        if (ClassValidaciones && typeof ClassValidaciones.validarFormulario === "function") {
            ClassValidaciones.validarFormulario(form_cargar_asiento_contable, btnAgregarAsientoContable, function () {
                confirmar_alta_asiento_contable();
            });
            return;
        }

        btnAgregarAsientoContable.on("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!form_cargar_asiento_contable.length) {
                return;
            }

            if (!form_cargar_asiento_contable[0].checkValidity()) {
                form_cargar_asiento_contable.addClass("was-validated");
                return;
            }

            confirmar_alta_asiento_contable();
            form_cargar_asiento_contable.addClass("was-validated");
        });
    }

    function confirmar_alta_asiento_contable() {
        if (!asiento_contable_esta_balanceado()) {
            Swal.fire({
                icon: "error",
                title: "Asiento no balanceado",
                text: "El asiento contable debe estar balanceado para poder confirmarlo.",
            });
            return;
        }

        Swal.fire({
            title: "Se va a dar de alta el asiento contable",
            text: "¿Desea confirmar esta operación?",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        }).then(function (result) {
            if (result.isConfirmed) {
                insertar_asiento_contable_ajax();
            }
        });
    }

    function insertar_asiento_contable_ajax() {
        const dataString = {
            backend: "insertar_asiento_contable",
            datos: construir_payload_asiento_contable(),
        };

        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Asientos_contables_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                $("#myAlert").modal("hide");

                if (response && response.success) {
                    $("#modalAgregarAsientoContable").modal("hide");
                    Swal.fire({
                        icon: response.alert ? response.alert.icon : "success",
                        title: response.alert ? response.alert.title : "Exito",
                        text: response.message || "Se registro el asiento contable.",
                    }).then(function () {
                        limpiar_form_asiento_contable();
                        extraer_asientos_contables();
                    });
                } else {
                    Swal.fire({
                        icon: response && response.alert ? response.alert.icon : "error",
                        title: response && response.alert ? response.alert.title : "Error",
                        text: response && response.message ? response.message : "Ocurrio un error durante el proceso.",
                    });
                }
            },
            error: function () {
                $("#myAlert").modal("hide");
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexion",
                    text: "No se pudo comunicar con el servidor. Por favor, revisa tu conexion a internet.",
                });
            },
            complete: function () {
                $("#myAlert").modal("hide");
            },
        });
    }

    function construir_payload_asiento_contable() {
        return {
            cabecera: {
                ejercicio: obtener_ejercicio_asiento(),
                fecha_asiento: $("#fecha_asiento").val(),
                fecha_aplicacion: $("#fecha_aplicacion").val(),
                tipo_origen: "MAN",
                id_origen: 0,
                descripcion: $("#descripcion_asiento").val().trim(),
                nota: $("#observaciones_asiento").val().trim(),
            },
            detalle: obtener_detalle_asiento_contable(),
        };
    }

    function obtener_detalle_asiento_contable() {
        if (!$.fn.DataTable || !$.fn.DataTable.isDataTable(datatable_asiento_detalle)) {
            return [];
        }

        return datatable_asiento_detalle
            .DataTable()
            .rows()
            .data()
            .toArray()
            .map(function (detalle) {
                return {
                    id_cuenta: detalle.id_cuenta || "",
                    descripcion: $("#descripcion_asiento").val().trim(),
                    debe: parseNumero(detalle.debe),
                    haber: parseNumero(detalle.haber),
                };
            });
    }

    function obtener_ejercicio_asiento() {
        const fechaAplicacion = $("#fecha_aplicacion").val();

        if (fechaAplicacion) {
            return parseInt(String(fechaAplicacion).split("-")[0], 10) || new Date().getFullYear();
        }

        return new Date().getFullYear();
    }

    function obtener_fecha_actual_input() {
        return new Date().toISOString().split("T")[0];
    }

    function asiento_contable_esta_balanceado() {
        return obtener_resumen_asiento_alta().balanceado;
    }

    function obtener_resumen_asiento_alta() {
        let cantidadDetalles = 0;
        let totales = calcular_totales_desde_items([]);

        if ($.fn.DataTable && $.fn.DataTable.isDataTable(datatable_asiento_detalle)) {
            cantidadDetalles = datatable_asiento_detalle.DataTable().rows().count();
            totales = calcular_totales_desde_items(datatable_asiento_detalle.DataTable().rows().data().toArray());
        }

        return {
            cantidadDetalles: cantidadDetalles,
            totales: totales,
            balanceado: cantidadDetalles > 0 && Math.abs(totales.saldo) < 0.000001,
        };
    }

    function actualizar_alerta_estado_asiento(resumen) {
        if (!alertaEstadoAsientoAlta.length) {
            return;
        }

        let estadoClase = "estado-asiento-card--info";
        let iconoClase = "bi-info-circle";
        let mensaje = "Agrega detalles para habilitar Confirmar.";
        let colorDiferencia = "var(--dark)";

        if (resumen.cantidadDetalles > 0 && !resumen.balanceado) {
            estadoClase = "estado-asiento-card--warning";
            iconoClase = "bi-exclamation-triangle";
            mensaje = `Confirmar bloqueado: la diferencia debe ser $ 0,00. Actual: ${formatMoneda(resumen.totales.saldo)}.`;
            colorDiferencia = "var(--danger)";
        }

        if (resumen.balanceado) {
            estadoClase = "estado-asiento-card--success";
            iconoClase = "bi-check-circle";
            mensaje = "Asiento balanceado. Listo para confirmar.";
            colorDiferencia = "var(--success)";
        }

        alertaEstadoAsientoAlta
            .removeClass("estado-asiento-card--info estado-asiento-card--warning estado-asiento-card--success")
            .addClass(estadoClase);
        iconoAlertaEstadoAsientoAlta.removeClass("bi-info-circle bi-exclamation-triangle bi-check-circle").addClass(iconoClase);
        mensajeAlertaEstadoAsientoAlta.text(mensaje);
        diferenciaGeneral.css("color", colorDiferencia);
        btnAgregarAsientoContable.attr("aria-label", mensaje);
    }

    // ***************************************************************************************
    // ******************************* MODIFICAR ASIENTO CONTABLE ****************************
    // ***************************************************************************************

    function cargar_modal_modificar(data) {
        if (!data?.cabecera || !Array.isArray(data.detalle)) {
            throw new Error("Los datos del asiento están incompletos.");
        }

        const cabecera = data.cabecera;
        limpiarFormulario(formModAsientoContable);
        cerrar_editor_detalle_mod();

        fechaAplicacionOriginalMod = String(cabecera.fecha_aplicacion || "").slice(0, 10);
        $("#id_asiento_mod").val(cabecera.id_asiento);
        $("#nro_asiento_mod").text(cabecera.id_asiento);
        $("#fecha_aplicacion_mod").val(fechaAplicacionOriginalMod);
        $("#descripcion_asiento_mod").val(cabecera.descripcion || "");
        $("#observaciones_asiento_mod").val(cabecera.nota || "");

        datatable_asiento_detalle_mod.DataTable({
            destroy: true,
            data: data.detalle.map(function (detalle) {
                return {
                    ...detalle,
                    descripcion: cabecera.descripcion || "",
                    cuenta_origin: detalle.id_cuenta,
                    debe_original: parseNumero(detalle.debe),
                    haber_original: parseNumero(detalle.haber),
                    fecha_aplicacion_orig_det: String(detalle.fecha_aplicacion || cabecera.fecha_aplicacion || "").slice(0, 10),
                    accion_detalle: "sin_cambios",
                };
            }),
            columns: [
                {
                    title: "Cuenta Contable",
                    data: "nombre_cuenta",
                    defaultContent: "-",
                    render: function (nombre, tipo, detalle) {
                        if (tipo !== "display") {
                            return nombre || "-";
                        }

                        const nombreSeguro = $("<span>")
                            .text(nombre || "-")
                            .html();
                        const estado = detalle.accion_detalle;
                        const etiquetas = {
                            alta: '<span class="sac-status-badge sac-status-active"><i class="bi bi-plus-circle me-1" aria-hidden="true"></i>Nuevo</span>',
                            modificacion:
                                '<span class="sac-status-badge sac-status-modify"><i class="bi bi-pencil me-1" aria-hidden="true"></i>Modificado</span>',
                            baja: '<span class="sac-status-badge sac-status-inactive"><i class="bi bi-trash me-1" aria-hidden="true"></i>Por eliminar</span>',
                        };

                        return `<div class="d-flex align-items-center flex-wrap gap-2">
                                    <span class="${estado === "baja" ? "text-decoration-line-through text-muted" : ""}">${nombreSeguro}</span>
                                    ${etiquetas[estado] || ""}
                                </div>`;
                    },
                },
                ...obtener_columnas_detalle_asiento().slice(1, 6),
                {
                    title: "Acciones",
                    data: null,
                    className: "text-center",
                    orderable: false,
                    render: function (detalle) {
                        if (detalle.accion_detalle === "baja") {
                            return '<button type="button" class="btn sac-btn-icon sac-btn-icon-sm sac-btn-revert" accion="deshacerEliminacionDetalle" title="Deshacer eliminación" aria-label="Deshacer eliminación del detalle"><i class="ri-arrow-go-back-line"></i></button>';
                        }

                        return `<div class="sac-table-actions">
                                    <button type="button" class="btn sac-btn-icon sac-btn-icon-sm sac-btn-modify" accion="modificarDetalle" title="Modificar detalle" aria-label="Modificar detalle"><i class="ri-edit-2-line"></i></button>
                                    <button type="button" class="btn sac-btn-icon sac-btn-icon-sm sac-btn-delete" accion="eliminarDetalleMod" title="Marcar para eliminar" aria-label="Marcar detalle para eliminar"><i class="ri-delete-bin-fill"></i></button>
                                </div>`;
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                emptyTable: "Este asiento no tiene detalles.",
            },
            paging: false,
            info: false,
            searching: false,
            ordering: false,
            autoWidth: false,
        });

        actualizar_totales_detalle_mod();

        $("#modalModificarAsientoContable").modal("show");
    }

    $("#descripcion_asiento_mod").on("input", function () {
        const descripcion = $(this).val().trim();
        if (!$.fn.DataTable.isDataTable(datatable_asiento_detalle_mod)) {
            return;
        }
        datatable_asiento_detalle_mod
            .DataTable()
            .rows()
            .every(function () {
                const detalle = this.data();
                this.data({ ...detalle, descripcion });
            });
        datatable_asiento_detalle_mod.DataTable().draw(false);
    });

    $("#modalModificarAsientoContable").on("shown.bs.modal", function () {
        datatable_asiento_detalle_mod.DataTable().columns.adjust();
    });

    $("#btnAgregarDetalleAsiento_mod").on("click", function () {
        abrir_editor_detalle_mod();
    });

    datatable_asiento_detalle_mod.on("click", 'button[accion="modificarDetalle"]', function () {
        const fila = datatable_asiento_detalle_mod.DataTable().row($(this).closest("tr"));
        const detalle = fila.data();

        if (detalle) {
            abrir_editor_detalle_mod(detalle, fila);
        }
    });

    datatable_asiento_detalle_mod.on("click", 'button[accion="eliminarDetalleMod"]', function () {
        const fila = datatable_asiento_detalle_mod.DataTable().row($(this).closest("tr"));
        const detalle = fila.data();

        if (!detalle) {
            return;
        }

        if (filaDetalleMod && filaDetalleMod.index() === fila.index()) {
            cerrar_editor_detalle_mod();
        }

        if (detalle.accion_detalle === "alta") {
            fila.remove().draw();
            if ($("#editor_detalle_asiento_mod").hasClass("d-none")) {
                $("#btnAgregarDetalleAsiento_mod").trigger("focus");
            } else {
                $("#debe_det_mod").trigger("focus");
            }
        } else {
            fila.data({ ...detalle, accion_anterior: detalle.accion_detalle, accion_detalle: "baja" }).draw();
            $(fila.node()).find('button[accion="deshacerEliminacionDetalle"]').trigger("focus");
        }

        actualizar_totales_detalle_mod();
    });

    datatable_asiento_detalle_mod.on("click", 'button[accion="deshacerEliminacionDetalle"]', function () {
        const fila = datatable_asiento_detalle_mod.DataTable().row($(this).closest("tr"));
        const detalle = fila.data();

        if (!detalle || detalle.accion_detalle !== "baja") {
            return;
        }

        const { accion_anterior, ...detalleRestaurado } = detalle;
        fila.data({ ...detalleRestaurado, accion_detalle: accion_anterior || "sin_cambios" }).draw();
        $(fila.node()).find('button[accion="eliminarDetalleMod"]').trigger("focus");
        actualizar_totales_detalle_mod();
    });

    $("#btnCancelarDetalleAsientoMod").on("click", function () {
        cerrar_editor_detalle_mod();
        $("#btnAgregarDetalleAsiento_mod").trigger("focus");
    });

    btnGuardarModificar.on("click", function () {
        formModAsientoContable.addClass("was-validated");

        if (!formModAsientoContable[0].checkValidity()) {
            return;
        }

        if (!$("#editor_detalle_asiento_mod").hasClass("d-none")) {
            Swal.fire({
                icon: "info",
                title: "Detalle sin confirmar",
                text: "Agrega, modifica o cancela el detalle antes de guardar el asiento.",
            });
            return;
        }

        const detalles = datatable_asiento_detalle_mod
            .DataTable()
            .rows()
            .data()
            .toArray()
            .filter(function (detalle) {
                return detalle.accion_detalle !== "baja";
            });

        if (!detalles.length || Math.abs(calcular_totales_desde_items(detalles).saldo) >= 0.000001) {
            Swal.fire({
                icon: "error",
                title: "Asiento no balanceado",
                text: "El asiento debe tener al menos un detalle y una diferencia de $ 0,00.",
            });
            return;
        }

        Swal.fire({
            title: "Se va a modificar el asiento contable N° " + $("#id_asiento_mod").val(),
            text: "¿Desea confirmar esta operación?",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        }).then(function (result) {
            if (result.isConfirmed) {
                preparar_modificacion_asiento_contable();
            }
        });
    });

    function preparar_modificacion_asiento_contable() {
        const fechaAplicacion = $("#fecha_aplicacion_mod").val();
        const dataString = {
            backend: "modificar_asiento_contable",
            datos: {
                cabecera: {
                    id_asiento: $("#id_asiento_mod").val(),
                    ejercicio: Number(fechaAplicacion.slice(0, 4)),
                    fecha_aplicacion: fechaAplicacionOriginalMod,
                    fecha_aplicacion_new: fechaAplicacion,
                    descripcion: $("#descripcion_asiento_mod").val().trim(),
                    nota: $("#observaciones_asiento_mod").val().trim(),
                },
                detalle: datatable_asiento_detalle_mod
                    .DataTable()
                    .rows()
                    .data()
                    .toArray()
                    .map(function (detalle) {
                        return {
                            accion_detalle: detalle.accion_detalle,
                            id_detalle: detalle.id_detalle || null,
                            cuenta_origin: detalle.cuenta_origin ?? null,
                            debe_original: detalle.debe_original ?? null,
                            haber_original: detalle.haber_original ?? null,
                            fecha_aplicacion_orig_det: detalle.fecha_aplicacion_orig_det ?? null,
                            id_cuenta: detalle.id_cuenta,
                            id_cuenta_new: detalle.id_cuenta,
                            fecha_aplicacion_new: fechaAplicacion,
                            descripcion: $("#descripcion_asiento_mod").val().trim(),
                            debe: parseNumero(detalle.debe),
                            haber: parseNumero(detalle.haber),
                            detalle: detalle.detalle || "",
                        };
                    }),
            },
        };

        btnGuardarModificar.prop("disabled", true);
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Asientos_contables_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    $("#modalModificarAsientoContable").modal("hide");
                    Swal.fire({
                        icon: response.alert ? response.alert.icon : "success",
                        title: response.alert ? response.alert.title : "Éxito",
                        text: response.message || "Se modificó el asiento contable.",
                    }).then(function () {
                        extraer_asientos_contables();
                    });
                } else {
                    Swal.fire({
                        icon: response && response.alert ? response.alert.icon : "error",
                        title: response && response.alert ? response.alert.title : "Error",
                        text: response?.errors?.error || response?.message || "Ocurrió un error durante el proceso.",
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo comunicar con el servidor. Por favor, revisa tu conexión a internet.",
                });
            },
            complete: function () {
                $("#myAlert").modal("hide");
                btnGuardarModificar.prop("disabled", false);
            },
        });
    }

    formDetalleMod.on("submit", function (event) {
        event.preventDefault();
        validar_importes_detalle_mod();
        formDetalleMod.addClass("was-validated");

        if (!formDetalleMod[0].checkValidity()) {
            return;
        }

        const cuenta =
            cuentasContablesCacheMod.find(function (item) {
                return String(item.id_cuenta) === String(selectCuentaContableMod.val());
            }) ||
            (cuentaSeleccionadaMod && String(cuentaSeleccionadaMod.id_cuenta) === String(selectCuentaContableMod.val())
                ? cuentaSeleccionadaMod
                : null);

        if (!cuenta) {
            selectCuentaContableMod[0].setCustomValidity("Seleccione una cuenta contable.");
            return;
        }

        const detalleAnterior = filaDetalleMod ? filaDetalleMod.data() : {};
        const detalle = {
            ...detalleAnterior,
            id_cuenta: selectCuentaContableMod.val(),
            codigo_cuenta: cuenta.codigo_cuenta,
            nombre_cuenta: cuenta.nombre_cuenta,
            descripcion: $("#descripcion_asiento_mod").val().trim(),
            debe: parseNumero($("#debe_det_mod").val()),
            haber: parseNumero($("#haber_det_mod").val()),
            detalle: $("#detalle_det_mod").val(),
            accion_detalle: !filaDetalleMod || detalleAnterior.accion_detalle === "alta" ? "alta" : "modificacion",
        };

        if (filaDetalleMod) {
            filaDetalleMod.data(detalle).draw();
        } else {
            datatable_asiento_detalle_mod.DataTable().row.add(detalle).draw();
        }

        actualizar_totales_detalle_mod();
        cerrar_editor_detalle_mod();
        $("#btnAgregarDetalleAsiento_mod").trigger("focus");
    });

    function abrir_editor_detalle_mod(detalle = null, fila = null) {
        limpiar_form_detalle_mod();
        filaDetalleMod = fila;

        $("#btnAgregarDetalleAsiento_mod").addClass("d-none").attr("aria-expanded", "true");
        $("#editor_detalle_asiento_mod").removeClass("d-none");
        $("#btnGuardarDetalleAsientoMod").text(detalle ? "Modificar detalle" : "Agregar detalle");

        if (detalle) {
            cuentaSeleccionadaMod = {
                id_cuenta: detalle.id_cuenta,
                codigo_cuenta: detalle.codigo_cuenta,
                nombre_cuenta: detalle.nombre_cuenta,
            };
            cargar_select_cuentas_mod(cuentasContablesCacheMod, String(detalle.id_cuenta));
            $("#id_detalle_mod").val(detalle.id_detalle || "");
            $("#descripcion_det_mod").val(detalle.nombre_cuenta || "");
            $("#debe_det_mod").val(formatNumero(detalle.debe));
            $("#haber_det_mod").val(formatNumero(detalle.haber));
            $("#detalle_det_mod").val(detalle.detalle || "");
        }

        validar_importes_detalle_mod();
        $("#debe_det_mod").trigger("focus");
    }

    function cerrar_editor_detalle_mod() {
        limpiar_form_detalle_mod();
        $("#editor_detalle_asiento_mod").addClass("d-none");
        $("#btnAgregarDetalleAsiento_mod").removeClass("d-none").attr("aria-expanded", "false");
    }

    function limpiar_form_detalle_mod() {
        filaDetalleMod = null;
        cuentaSeleccionadaMod = null;
        limpiarFormulario(formDetalleMod);
        selectCuentaContableMod[0].setCustomValidity("");
        if (choicesCuentaContableMod) {
            choicesCuentaContableMod.removeActiveItems();
        }
        cargar_select_cuentas_mod(cuentasContablesCacheMod, "");
        $("#codigo_cuenta_contable_det_mod, #descripcion_det_mod").val("");
        $("#debe_det_mod, #haber_det_mod").each(function () {
            this.setCustomValidity("");
        });
    }

    function actualizar_totales_detalle_mod() {
        const filas = datatable_asiento_detalle_mod.DataTable().rows().data().toArray();
        const detalles = filas.filter(function (detalle) {
            return detalle.accion_detalle !== "baja";
        });
        const totales = calcular_totales_desde_items(detalles);
        const balanceado = detalles.length > 0 && Math.abs(totales.saldo) < 0.000001;
        let mensaje = "Asiento balanceado.";

        if (detalles.length === 0) {
            mensaje =
                filas.length > 0
                    ? "Todos los detalles están marcados para eliminar. Deshaz una eliminación o agrega uno."
                    : "Agrega detalles al asiento.";
        } else if (!balanceado) {
            mensaje = "El asiento debe quedar balanceado antes de guardarse.";
        }

        $("#total_debe_general_mod").text(formatMoneda(totales.totalDebe));
        $("#total_haber_general_mod").text(formatMoneda(totales.totalHaber));
        $("#diferencia_general_mod").text(formatMoneda(totales.saldo));

        $("#alerta_estado_asiento_mod")
            .removeClass("estado-asiento-card--info estado-asiento-card--warning estado-asiento-card--success")
            .addClass(
                detalles.length === 0
                    ? "estado-asiento-card--info"
                    : balanceado
                      ? "estado-asiento-card--success"
                      : "estado-asiento-card--warning",
            );
        $("#icono_alerta_estado_asiento_mod")
            .removeClass("bi-info-circle bi-exclamation-triangle bi-check-circle")
            .addClass(detalles.length === 0 ? "bi-info-circle" : balanceado ? "bi-check-circle" : "bi-exclamation-triangle");
        $("#mensaje_alerta_estado_asiento_mod").text(mensaje);
    }

    function inicializar_choices_cuenta_contable_mod() {
        if (typeof Choices === "undefined" || !selectCuentaContableMod.length) {
            return;
        }

        choicesCuentaContableMod = new Choices(selectCuentaContableMod[0], {
            ...CHOICES_CONFIG,
            searchChoices: false,
            placeholderValue: "Seleccione una cuenta",
            searchPlaceholderValue: "Buscar cuenta...",
        });
    }

    selectCuentaContableMod.on("change", function () {
        completar_datos_cuenta_contable_mod($(this).val());
    });

    selectCuentaContableMod.on("choice", function (e) {
        completar_datos_cuenta_contable_mod(e?.detail?.choice?.value || "");
    });

    selectCuentaContableMod.on("search", function (e) {
        const termino = String(e?.detail?.value || "").trim();
        clearTimeout(timeoutBusquedaCuentaContableMod);
        timeoutBusquedaCuentaContableMod = setTimeout(function () {
            buscar_cuentas_contables_mod(termino);
        }, 250);
    });

    function buscar_cuentas_contables_mod(termino) {
        const numeroBusqueda = ++numeroBusquedaCuentaMod;
        $.ajax({
            data: { backend: "sugerencias_cuentas_contables", termino },
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (numeroBusqueda !== numeroBusquedaCuentaMod) {
                    return;
                }

                cuentasContablesCacheMod =
                    response && response.success && Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];
                cargar_select_cuentas_mod(cuentasContablesCacheMod, selectCuentaContableMod.val());
            },
            error: function () {
                if (numeroBusqueda === numeroBusquedaCuentaMod) {
                    cuentasContablesCacheMod = [];
                    cargar_select_cuentas_mod([], selectCuentaContableMod.val());
                }
            },
        });
    }

    function cargar_select_cuentas_mod(cuentas, idSeleccionado = "") {
        const opciones = [...cuentas];
        if (
            cuentaSeleccionadaMod &&
            !opciones.some(function (cuenta) {
                return String(cuenta.id_cuenta) === String(cuentaSeleccionadaMod.id_cuenta);
            })
        ) {
            opciones.push(cuentaSeleccionadaMod);
        }

        const items = [
            { value: "", label: "Seleccione una cuenta...", selected: !idSeleccionado },
            ...opciones.map(function (cuenta) {
                return {
                    value: String(cuenta.id_cuenta),
                    label: construir_descripcion_cuenta_contable(cuenta),
                    selected: String(cuenta.id_cuenta) === String(idSeleccionado),
                };
            }),
        ];

        if (choicesCuentaContableMod) {
            choicesCuentaContableMod.clearChoices();
            choicesCuentaContableMod.setChoices(items, "value", "label", true);
        } else {
            selectCuentaContableMod.empty();
            items.forEach(function (item) {
                selectCuentaContableMod.append($("<option>").val(item.value).text(item.label));
            });
            selectCuentaContableMod.val(idSeleccionado);
        }
    }

    function completar_datos_cuenta_contable_mod(idCuenta) {
        const cambioCuenta = String(cuentaSeleccionadaMod?.id_cuenta || "") !== String(idCuenta || "");
        const cuenta =
            cuentasContablesCacheMod.find(function (item) {
                return String(item.id_cuenta) === String(idCuenta);
            }) || (cuentaSeleccionadaMod && String(cuentaSeleccionadaMod.id_cuenta) === String(idCuenta) ? cuentaSeleccionadaMod : null);

        cuentaSeleccionadaMod = cuenta;
        selectCuentaContableMod[0].setCustomValidity("");
        $("#codigo_cuenta_contable_det_mod").val(cuenta ? cuenta.codigo_cuenta || "" : "");
        if (cambioCuenta || !cuenta) {
            $("#descripcion_det_mod").val(cuenta ? cuenta.nombre_cuenta || "" : "");
        }
    }

    function inicializar_mascaras_importes_mod() {
        if (ClassFormatos && typeof ClassFormatos.aplicarMascaraMonedaInput === "function") {
            ClassFormatos.aplicarMascaraMonedaInput("#debe_det_mod", function (valor) {
                sincronizar_importes_detalle_mod("debe", valor);
            });
            ClassFormatos.aplicarMascaraMonedaInput("#haber_det_mod", function (valor) {
                sincronizar_importes_detalle_mod("haber", valor);
            });
        } else {
            formDetalleMod.on("input", "#debe_det_mod, #haber_det_mod", function () {
                sincronizar_importes_detalle_mod(this.id === "debe_det_mod" ? "debe" : "haber", $(this).val());
            });
        }
    }

    function sincronizar_importes_detalle_mod(tipo, valor) {
        if (parseNumero(valor) > 0) {
            $(tipo === "debe" ? "#haber_det_mod" : "#debe_det_mod").val("0,00");
        }
        validar_importes_detalle_mod();
    }

    function validar_importes_detalle_mod() {
        const debe = parseNumero($("#debe_det_mod").val());
        const haber = parseNumero($("#haber_det_mod").val());
        const mensaje = debe >= 0 && haber >= 0 && debe > 0 !== haber > 0 ? "" : "Debe ingresar un importe positivo en Debe o Haber.";
        $("#debe_det_mod")[0].setCustomValidity(mensaje);
        $("#haber_det_mod")[0].setCustomValidity(mensaje);
    }

    // ***************************************************************************************
    // ******************************* ASIENTO DE REVERSO ************************************
    // ***************************************************************************************
    function revertir_asiento_contable(id_asiento) {
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Asientos_contables_backend.php",
            data: {
                backend: "revertir_asiento_contable",
                id_asiento: id_asiento,
            },
            dataType: "json",
            success: function (response) {
                if (response) {
                    Swal.fire({
                        icon: response.alert ? response.alert.icon : "success",
                        title: response.alert ? response.alert.title : "Exito",
                        text: response.message || "Se genero el asiento de reverso.",
                    }).then(function () {
                        extraer_asientos_contables();
                    });
                } else {
                    Swal.fire({
                        icon: response && response.alert ? response.alert.icon : "error",
                        title: response && response.alert ? response.alert.title : "Error",
                        text: response && response.message ? response.message : "Ocurrio un error durante el proceso.",
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexion",
                    text: "No se pudo comunicar con el servidor. Por favor, revisa tu conexion a internet.",
                });
            },
            complete: function () {
                $("#myAlert").modal("hide");
            },
        });
    }

    // **************************************************************************************
    // ******************************* AUXILIARES *******************************************

    function parseNumero(value) {
        if (ClassFormatos && typeof ClassFormatos.parseNumero === "function") {
            return ClassFormatos.parseNumero(value);
        }

        if (value === null || value === undefined || value === "") {
            return 0;
        }

        if (typeof value === "number") {
            return value;
        }

        const normalizado = String(value).replace(/\$/g, "").replace(/\s/g, "").replace(/\./g, "").replace(/,/g, ".");
        return Number(normalizado) || 0;
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

    function obtener_texto_estado(estado) {
        switch (estado) {
            case "I":
            case "AN":
                return "Inactivo";
            case "AC":
            case "A":
            default:
                return "Activo";
        }
    }

    function formatFecha(value) {
        if (!value) {
            return "-";
        }

        const valor = String(value).trim();
        const partes = valor.split(" ");
        const fecha = partes[0] || "";
        const hora = partes[1] || "";

        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            const segmentos = fecha.split("-");
            return `${segmentos[2]}/${segmentos[1]}/${segmentos[0]}${hora ? ` ${hora}` : ""}`;
        }

        return valor;
    }

    function inicializar_choices_cuenta_contable_alta() {
        if (typeof Choices === "undefined" || !selectCuentaContableAlta.length) {
            return;
        }

        if (choicesCuentaContableAlta) {
            choicesCuentaContableAlta.destroy();
        }

        choicesCuentaContableAlta = new Choices(selectCuentaContableAlta[0], {
            ...CHOICES_CONFIG,
            searchChoices: false,
            placeholderValue: "Seleccione una cuenta",
            searchPlaceholderValue: "Buscar cuenta...",
            noResultsText: "Escriba para buscar cuentas",
        });
    }

    function buscar_cuentas_contables_alta(termino) {
        $.ajax({
            data: {
                backend: "sugerencias_cuentas_contables",
                termino: termino,
            },
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                cuentasContablesCache =
                    response && response.success && Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];

                cargar_select_cuentas_contables_alta(cuentasContablesCache, selectCuentaContableAlta.val());
            },
            error: function () {
                cuentasContablesCache = [];
                cargar_select_cuentas_contables_alta([], "");
            },
        });
    }

    function cargar_select_cuentas_contables_alta(cuentasContables, valorSeleccionado = "") {
        const cuentas = Array.isArray(cuentasContables) ? cuentasContables : [];
        const existeCuentaSeleccionada = cuentas.some(function (cuenta) {
            return String(cuenta.id_cuenta) === String(valorSeleccionado);
        });

        if (choicesCuentaContableAlta) {
            choicesCuentaContableAlta.clearChoices();
            choicesCuentaContableAlta.setChoices(
                [
                    { value: "", label: "Seleccione una cuenta...", selected: !existeCuentaSeleccionada },
                    ...cuentas.map(function (cuenta) {
                        return {
                            value: String(cuenta.id_cuenta),
                            label: cuenta.label || construir_descripcion_cuenta_contable(cuenta),
                            selected: String(cuenta.id_cuenta) === String(valorSeleccionado),
                        };
                    }),
                ],
                "value",
                "label",
                true,
            );

            completar_datos_cuenta_contable_alta(existeCuentaSeleccionada ? valorSeleccionado : "");
            return;
        }

        selectCuentaContableAlta.empty().append('<option value="" selected>Seleccione una cuenta...</option>');

        cuentas.forEach(function (cuenta) {
            selectCuentaContableAlta.append(
                `<option value="${cuenta.id_cuenta}">${cuenta.label || construir_descripcion_cuenta_contable(cuenta)}</option>`,
            );
        });

        selectCuentaContableAlta.val(existeCuentaSeleccionada ? String(valorSeleccionado) : "");
        completar_datos_cuenta_contable_alta(selectCuentaContableAlta.val());
    }

    function construir_descripcion_cuenta_contable(cuenta) {
        return [cuenta.codigo_cuenta, cuenta.nombre_cuenta].filter(Boolean).join(" - ");
    }

    function limpiar_datos_cuenta_contable_alta() {
        $("#codigo_cuenta_contable_alta").val("");
        $("#descripcion_alta").val("");
    }

    function obtener_nombre_cuenta_contable_alta(idCuenta) {
        const cuentaContable = cuentasContablesCache.find(function (cuenta) {
            return String(cuenta.id_cuenta) === String(idCuenta);
        });

        return cuentaContable ? cuentaContable.nombre_cuenta || "" : "";
    }

    function completar_datos_cuenta_contable_alta(idCuenta) {
        const cuentaContable = cuentasContablesCache.find(function (cuenta) {
            return String(cuenta.id_cuenta) === String(idCuenta);
        });

        if (!cuentaContable) {
            limpiar_datos_cuenta_contable_alta();
            return;
        }

        $("#codigo_cuenta_contable_alta").val(cuentaContable.codigo_cuenta || "");
        $("#descripcion_alta").val(cuentaContable.nombre_cuenta || "");
    }

    function inicializar_mascaras_importes_alta() {
        if (!ClassFormatos || typeof ClassFormatos.aplicarMascaraMonedaInput !== "function") {
            return;
        }

        ClassFormatos.aplicarMascaraMonedaInput("#debe_alta", function (valor) {
            sincronizar_importes_asiento_alta("debe", valor);
            validar_importes_detalle_asiento();
        });

        ClassFormatos.aplicarMascaraMonedaInput("#haber_alta", function (valor) {
            sincronizar_importes_asiento_alta("haber", valor);
            validar_importes_detalle_asiento();
        });
    }

    function sincronizar_importes_asiento_alta(tipoImporte, valor) {
        const debe = $("#debe_alta");
        const haber = $("#haber_alta");
        const importe = Math.max(parseNumero(valor), 0);

        if (tipoImporte === "debe") {
            if (importe > 0) {
                haber.val(typeof ClassFormatos.mascaraMoneda === "function" ? ClassFormatos.mascaraMoneda("0") : "0,00");
            }

            return;
        }

        if (importe > 0) {
            debe.val(typeof ClassFormatos.mascaraMoneda === "function" ? ClassFormatos.mascaraMoneda("0") : "0,00");
        }
    }

    function validar_importes_detalle_asiento() {
        const debe = parseNumero($("#debe_alta").val());
        const haber = parseNumero($("#haber_alta").val());
        const mensaje = debe <= 0 && haber <= 0 ? "Debe ingresar un importe en Debe o Haber." : "";

        $("#debe_alta")[0].setCustomValidity(mensaje);
        $("#haber_alta")[0].setCustomValidity(mensaje);
    }

    function actualizar_totales_detalle_alta() {
        let totales = calcular_totales_desde_items([]);

        if ($.fn.DataTable && $.fn.DataTable.isDataTable(datatable_asiento_detalle)) {
            totales = calcular_totales_desde_items(datatable_asiento_detalle.DataTable().rows().data().toArray());
        }

        $("#total_debe_general").text(formatMoneda(totales.totalDebe));
        $("#total_haber_general").text(formatMoneda(totales.totalHaber));
        $("#diferencia_general").text(formatMoneda(totales.saldo));
        actualizar_estado_boton_confirmar_asiento();
    }

    function actualizar_estado_boton_confirmar_asiento() {
        const resumen = obtener_resumen_asiento_alta();

        btnAgregarAsientoContable.prop("disabled", !resumen.balanceado);
        actualizar_alerta_estado_asiento(resumen);
    }

    function inicializar_validacion_form_detalle_asiento() {
        if (ClassValidaciones && typeof ClassValidaciones.validarFormulario === "function") {
            ClassValidaciones.validarFormulario(form_agregar_detalle_asiento, btnAgregarDetalleAsiento, function () {
                agregar_linea_dt_asiento();
            });
            return;
        }

        btnAgregarDetalleAsiento.on("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!form_agregar_detalle_asiento.length) {
                return;
            }

            if (!form_agregar_detalle_asiento[0].checkValidity()) {
                form_agregar_detalle_asiento.addClass("was-validated");
                return;
            }

            agregar_linea_dt_asiento();
            form_agregar_detalle_asiento.addClass("was-validated");
        });
    }

    function limpiar_form_detalle_asiento() {
        limpiarFormulario(form_agregar_detalle_asiento);
        selectCuentaContableAlta.val("");

        if (choicesCuentaContableAlta) {
            choicesCuentaContableAlta.removeActiveItems();
        }

        limpiar_datos_cuenta_contable_alta();
        $("#debe_alta").val("");
        $("#haber_alta").val("");
        validar_importes_detalle_asiento();

        setTimeout(function () {
            form_agregar_detalle_asiento.removeClass("was-validated");
            form_agregar_detalle_asiento.find("#debe_alta, #haber_alta").removeClass("is-valid is-invalid");
        }, 0);
    }

    function limpiar_form_asiento_contable() {
        limpiarFormulario(form_cargar_asiento_contable);
        $("#fecha_asiento").val(obtener_fecha_actual_input());
        $("#fecha_aplicacion").val(obtener_fecha_actual_input());
        limpiar_form_detalle_asiento();

        if ($.fn.DataTable && $.fn.DataTable.isDataTable(datatable_asiento_detalle)) {
            datatable_asiento_detalle.DataTable().clear().draw();
        }

        actualizar_totales_detalle_alta();
    }

    function limpiarFormulario(form) {
        form[0].reset();
        form.removeClass("was-validated");
        form.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
    }

    function obtener_texto_tipo_origen(tipoOrigen) {
        switch (tipoOrigen) {
            case "FAC":
                return "Factura de compra";
            case "MAN":
                return "Manual";
            case "PRE":
                return "Presentación";
            case "ORP":
                return "Orden de pago";
            case "REC":
                return "Recibo de cobranza";
            default:
                return tipoOrigen || "-";
        }
    }
});
