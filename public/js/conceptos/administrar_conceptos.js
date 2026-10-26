const ClassValidaciones = window.Validaciones;

$(document).ready(function () {
    // ===================================================================================
    // 1. CONFIGURACION, VARIABLES Y CONSTANTES
    // ===================================================================================
    const datatableConceptos = $("#datatable_conceptos");
    const modalConceptoAlta = $("#modalConceptoAlta");
    const modalConceptoDetalle = $("#modalConceptoDetalle");
    const modalConceptoMod = $("#modalConceptoMod");

    const formAltaConcepto = $("#formAltaConcepto");
    const formModConcepto = $("#formModConcepto");

    const btnNuevoConcepto = $("#btnNuevoConcepto");
    const btnConfirmarAltaConcepto = $("#btnConfirmarAltaConcepto");
    const btnGuardarConceptoMod = $("#btnGuardarConceptoMod");

    const inputDescripcionConceptoAlta = $("#descripcion_concepto_alta");
    const selectCuentaContableAlta = $("#cuenta_contable_concepto_alta");
    const inputDescripcionConceptoMod = $("#descripcion_concepto_mod");
    const selectCuentaContableMod = $("#cuenta_contable_concepto_mod");

    let cuentasContablesCache = [];

    // ===================================================================================
    // 2. INICIALIZACION DE LA APP
    // ===================================================================================
    extraerConceptos();
    extraerCuentasContables();

    // ===================================================================================
    // 3. EVENTOS PRINCIPALES
    // ===================================================================================
    btnNuevoConcepto.on("click", function () {
        abrirModalAltaConcepto();
    });

    modalConceptoAlta.on("hidden.bs.modal", function () {
        limpiarFormulario(formAltaConcepto);
    });

    modalConceptoMod.on("hidden.bs.modal", function () {
        limpiarFormulario(formModConcepto);
    });

    datatableConceptos.on("click", "button", function () {
        const accion = $(this).attr("accion");
        let row = $(this).closest("tr");
        let concepto = datatableConceptos.DataTable().row(row).data();

        if (!concepto && row.hasClass("child")) {
            concepto = datatableConceptos.DataTable().row(row.prev()).data();
        }

        if (!concepto) {
            return;
        }

        switch (accion) {
            case "btnVerConcepto":
                extraerConcepto(concepto.id_concepto, cargarModalDetalleConcepto);
                break;
            case "btnEditarConcepto":
                extraerConcepto(concepto.id_concepto, cargarModalModificarConcepto);
                break;
            case "btnEliminarConcepto":
            case "btnActivarConcepto":
                confirmarCambioEstadoConcepto(concepto);
                break;
        }
    });

    ClassValidaciones.validarFormulario(formAltaConcepto, btnConfirmarAltaConcepto, function () {
        confirmarGuardadoConcepto();
    });

    ClassValidaciones.validarFormulario(formModConcepto, btnGuardarConceptoMod, function () {
        confirmarModificacionConcepto();
    });

    // ===================================================================================
    // 4. LISTADO Y EXTRACCION DE DATOS
    // ===================================================================================
    function extraerConceptos() {
        $.ajax({
            data: { backend: "extraer_conceptos" },
            url: "app/Controllers/Conceptos/Conceptos_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                const conceptos = response && response.success && Array.isArray(response.data) ? response.data : [];
                cargarTablaConceptos(conceptos);
            },
            error: function () {
                cargarTablaConceptos([]);
                mostrarErrorConexion("No se pudo obtener el listado de conceptos.");
            },
        });
    }

    function extraerConcepto(idConcepto, callback) {
        $.ajax({
            type: "POST",
            url: "app/Controllers/Conceptos/Conceptos_backend.php",
            data: {
                backend: "extraer_concepto",
                id_concepto: idConcepto,
            },
            dataType: "json",
            success: function (response) {
                if (response && response.success && typeof callback === "function") {
                    callback(response.data || {});
                }
            },
            error: function () {
                mostrarErrorConexion("No se pudo obtener la información del concepto.");
            },
        });
    }

    function extraerCuentasContables() {
        $.ajax({
            data: { backend: "extraer_cuentas_contables" },
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                cuentasContablesCache = response && response.success && Array.isArray(response.data) ? response.data : [];
                cargarSelectCuentasContables(selectCuentaContableAlta, cuentasContablesCache);
                cargarSelectCuentasContables(selectCuentaContableMod, cuentasContablesCache);
            },
        });
    }

    function cargarTablaConceptos(conceptos) {
        datatableConceptos.DataTable({
            destroy: true,
            data: conceptos,
            columns: [
                { data: "id_concepto", title: "ID", className: "text-start align-middle", defaultContent: "-" },
                { data: "descripcion", title: "DESCRIPCION", defaultContent: "-" },
                {
                    data: null,
                    title: "CUENTA CONTABLE",
                    defaultContent: "-",
                    render: function (data, type, row) {
                        return obtenerDescripcionCuentaContable(row);
                    },
                },
                {
                    data: "estado",
                    title: "ESTADO",
                    className: "text-center align-middle",
                    defaultContent: "A",
                    render: function (data) {
                        return renderizarEstadoConcepto(data);
                    },
                },
                {
                    data: null,
                    title: "ACCIONES",
                    className: "text-center",
                    orderable: false,
                    render: function (data, type, row) {
                        return renderizarAccionesConcepto(row);
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: "Buscar concepto...",
                emptyTable: `<div class="text-center text-muted py-3">
                                <i class="bi bi-inbox fs-2 mb-2 d-block"></i>
                                <p class="mb-0 fw-medium">No hay conceptos para mostrar.</p>
                             </div>`,
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
        });
    }

    // ===================================================================================
    // 5. ALTA DE CONCEPTOS
    // ===================================================================================
    function abrirModalAltaConcepto() {
        limpiarFormulario(formAltaConcepto);
        cargarSelectCuentasContables(selectCuentaContableAlta, cuentasContablesCache);
        modalConceptoAlta.modal("show");
        setTimeout(function () {
            inputDescripcionConceptoAlta.trigger("focus");
        }, 200);
    }

    function cargarSelectCuentasContables(select, cuentas) {
        select.empty().append('<option value="" selected disabled>Seleccione una cuenta contable</option>');

        (cuentas || []).forEach(function (cuenta) {
            if (cuenta.estado !== "A") {
                return;
            }

            select.append(`<option value="${cuenta.id_cuenta}">${construirDescripcionCuentaContable(cuenta)}</option>`);
        });
    }

    function confirmarGuardadoConcepto() {
        Swal.fire({
            title: "Confirmar alta",
            text: "¿Desea guardar el concepto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false,
            confirmButtonClass: "btn btn-success w-xs me-2 mt-2",
            cancelButtonClass: "btn btn-danger w-xs mt-2",
        }).then(function (result) {
            if (result.value || result.isConfirmed) {
                guardarConcepto();
            }
        });
    }

    function guardarConcepto() {
        $.ajax({
            type: "POST",
            url: "app/Controllers/Conceptos/Conceptos_backend.php",
            data: {
                backend: "nuevo_concepto",
                datos: {
                    descripcion: inputDescripcionConceptoAlta.val().trim(),
                    cuenta_contable: selectCuentaContableAlta.val(),
                },
            },
            dataType: "json",
            success: function (response) {
                mostrarRespuestaServidor(response, function () {
                    modalConceptoAlta.modal("hide");
                    extraerConceptos();
                });
            },
            error: function () {
                mostrarErrorConexion("No se pudo comunicar con el servidor para guardar el concepto.");
            },
        });
    }

    // ===================================================================================
    // 6. DETALLE DE CONCEPTOS
    // ===================================================================================
    function cargarModalDetalleConcepto(concepto) {
        actualizarBadgeEstadoConcepto(concepto.estado);
        actualizarCampoDetalle("#concepto_detalle_titulo", concepto.descripcion || "Concepto");
        actualizarCampoDetalle("#detalle_id_concepto", concepto.id_concepto);
        actualizarCampoDetalle("#detalle_estado_concepto", concepto.estado === "A" ? "Activo" : "Inactivo");
        actualizarCampoDetalle("#detalle_descripcion_concepto", concepto.descripcion);
        actualizarCampoDetalle("#detalle_codigo_cuenta_concepto", concepto.codigo_cuenta);
        actualizarCampoDetalle("#detalle_nombre_cuenta_concepto", concepto.nombre_cuenta);
        actualizarCampoDetalle("#detalle_usuario_creacion_concepto", concepto.usuario_creacion);
        actualizarCampoDetalle("#detalle_fecha_creacion_concepto", concepto.fecha_creacion);
        actualizarCampoDetalle("#detalle_usuario_modificacion_concepto", concepto.usuario_modificacion);
        actualizarCampoDetalle("#detalle_fecha_modificacion_concepto", concepto.fecha_modificacion);
        actualizarCampoDetalle("#detalle_usuario_eliminacion_concepto", concepto.usuario_eliminacion);
        actualizarCampoDetalle("#detalle_fecha_eliminacion_concepto", concepto.fecha_eliminacion);
        modalConceptoDetalle.modal("show");
    }

    // ===================================================================================
    // 7. MODIFICACION DE CONCEPTOS
    // ===================================================================================
    function cargarModalModificarConcepto(concepto) {
        limpiarFormulario(formModConcepto);
        cargarSelectCuentasContables(selectCuentaContableMod, cuentasContablesCache);
        $("#id_concepto_mod").val(concepto.id_concepto);
        inputDescripcionConceptoMod.val(concepto.descripcion || "");
        selectCuentaContableMod.val(concepto.cuenta_contable || "");
        modalConceptoMod.modal("show");
    }

    function confirmarModificacionConcepto() {
        Swal.fire({
            title: "Confirmar modificación",
            text: "¿Desea guardar los cambios del concepto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false,
            confirmButtonClass: "btn btn-success w-xs me-2 mt-2",
            cancelButtonClass: "btn btn-danger w-xs mt-2",
        }).then(function (result) {
            if (result.value || result.isConfirmed) {
                modificarConcepto();
            }
        });
    }

    function modificarConcepto() {
        $.ajax({
            type: "POST",
            url: "app/Controllers/Conceptos/Conceptos_backend.php",
            data: {
                backend: "modificar_concepto",
                datos: {
                    id_concepto: $("#id_concepto_mod").val(),
                    descripcion: inputDescripcionConceptoMod.val().trim(),
                    cuenta_contable: selectCuentaContableMod.val(),
                },
            },
            dataType: "json",
            success: function (response) {
                mostrarRespuestaServidor(response, function () {
                    modalConceptoMod.modal("hide");
                    extraerConceptos();
                });
            },
            error: function () {
                mostrarErrorConexion("No se pudo comunicar con el servidor para modificar el concepto.");
            },
        });
    }

    // ===================================================================================
    // 8. ACTUALIZACION DE ESTADO
    // ===================================================================================
    function confirmarCambioEstadoConcepto(concepto) {
        const activar = concepto.estado === "I";

        Swal.fire({
            title: activar ? "¿Desea activar el concepto?" : "¿Desea desactivar el concepto?",
            text: activar ? "El concepto volverá a estar disponible." : "Podrá reactivarlo posteriormente si es necesario.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: activar ? "Sí, activar" : "Sí, desactivar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false,
            confirmButtonClass: "btn btn-success w-xs me-2 mt-2",
            cancelButtonClass: "btn btn-danger w-xs mt-2",
        }).then(function (result) {
            if (result.value || result.isConfirmed) {
                actualizarEstadoConcepto(concepto.id_concepto, concepto.estado);
            }
        });
    }

    function actualizarEstadoConcepto(idConcepto, estadoActual) {
        $.ajax({
            type: "POST",
            url: "app/Controllers/Conceptos/Conceptos_backend.php",
            data: {
                backend: "actualizar_estado",
                datos: {
                    id_concepto: idConcepto,
                    estado: estadoActual,
                },
            },
            dataType: "json",
            success: function (response) {
                mostrarRespuestaServidor(response, function () {
                    extraerConceptos();
                });
            },
            error: function () {
                mostrarErrorConexion("No se pudo comunicar con el servidor para actualizar el estado del concepto.");
            },
        });
    }

    // ===================================================================================
    // 9. RENDERIZADO Y PRESENTACION
    // ===================================================================================
    function renderizarEstadoConcepto(estado) {
        const estados = {
            A: { label: "Activo", className: "sac-status-active" },
            I: { label: "Inactivo", className: "sac-status-inactive" },
        };

        const estadoConfig = estados[estado] || { label: estado || "Sin definir", className: "sac-status-neutral" };
        return `<span class="sac-status-badge ${estadoConfig.className}">${estadoConfig.label}</span>`;
    }

    function renderizarAccionesConcepto(concepto) {
        const botones = [
            `<button accion="btnVerConcepto" class="sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver concepto"><i class="ri-eye-fill"></i></button>`,
            `<button accion="btnEditarConcepto" class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar concepto"><i class="ri-edit-2-fill"></i></button>`,
        ];

        if ((concepto && concepto.estado) === "I") {
            botones.push(
                `<button accion="btnActivarConcepto" class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Activar" aria-label="Activar concepto"><i class="ri-check-double-line"></i></button>`,
            );
        } else {
            botones.push(
                `<button accion="btnEliminarConcepto" class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Desactivar" aria-label="Desactivar concepto"><i class="ri-close-circle-fill"></i></button>`,
            );
        }

        return `<div class="sac-table-actions">${botones.join("")}</div>`;
    }

    function obtenerDescripcionCuentaContable(concepto) {
        if (concepto.codigo_cuenta || concepto.nombre_cuenta) {
            return [concepto.codigo_cuenta, concepto.nombre_cuenta].filter(Boolean).join(" - ") || "-";
        }

        const cuenta = cuentasContablesCache.find(function (item) {
            return String(item.id_cuenta) === String(concepto.cuenta_contable);
        });

        return cuenta ? construirDescripcionCuentaContable(cuenta) : concepto.cuenta_contable || "-";
    }

    function construirDescripcionCuentaContable(cuenta) {
        return [cuenta.codigo_cuenta, cuenta.nombre_cuenta].filter(Boolean).join(" - ");
    }

    function actualizarBadgeEstadoConcepto(estado) {
        const badge = $("#concepto_detalle_badge");
        const texto = $("#concepto_detalle_estado_badge");
        const icono = badge.find("i");

        if (estado === "I") {
            badge.removeClass("bg-success border-success text-success").addClass("bg-danger border-danger text-danger");
            icono.removeClass("bi-check-circle").addClass("bi-x-circle");
            texto.text("Inactivo");
        } else {
            badge.removeClass("bg-danger border-danger text-danger").addClass("bg-success border-success text-success");
            icono.removeClass("bi-x-circle").addClass("bi-check-circle");
            texto.text("Activo");
        }
    }

    function actualizarCampoDetalle(selector, valor) {
        const elemento = $(selector);

        if (!valor || valor === "" || valor === null) {
            elemento.text("Sin información");
        } else {
            elemento.text(valor);
        }
    }

    // ===================================================================================
    // 10. ALERTAS Y FUNCIONES AUXILIARES
    // ===================================================================================
    function mostrarRespuestaServidor(response, onSuccess) {
        const alert = response && response.alert ? response.alert : {};

        Swal.fire({
            title: alert.title || (response && response.success ? "Éxito" : "Error"),
            text: alert.message || response.message || "Operación finalizada.",
            icon: alert.icon || (response && response.success ? "success" : "error"),
            allowOutsideClick: false,
            confirmButtonText: "Aceptar",
            confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
        }).then(function () {
            if (response && response.success && typeof onSuccess === "function") {
                onSuccess();
            }
        });
    }

    function mostrarErrorConexion(mensaje) {
        Swal.fire({
            icon: "error",
            title: "Error de Conexion",
            text: mensaje,
            allowOutsideClick: false,
            confirmButtonText: "Aceptar",
            confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
        });
    }

    function limpiarFormulario(formulario) {
        if (!formulario || !formulario.length) {
            return;
        }

        formulario[0].reset();
        formulario.removeClass("was-validated");
        formulario.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
    }
});
