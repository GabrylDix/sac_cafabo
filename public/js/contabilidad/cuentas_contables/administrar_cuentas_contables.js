/** Clase para validar los formularios
 * @author Franco Falk
 * @type {Validaciones}
 */
const ClassValidaciones = window.Validaciones;

$(document).ready(function () {
    // ===================================================================================
    // 1. CONFIGURACIÓN, VARIABLES Y CONSTANTES
    // ===================================================================================
    const datatable_cuentas_contables = $("#datatable_cuentas_contables");
    const formAltaCuentaContable = $("#formAltaCuentaContable");
    const formModCuentaContable = $("#formModCuentaContable");

    const btnNuevoCuentaContable = $("#btnNuevoCuentaContable");
    const btnGuardarNuevaCuentaContable = $("#btnGuardar_nuevaCuentaContable");
    const btnGuardar_modificarCuentaContable = $("#btnGuardar_modificarCuentaContable");

    $("#modalCuentaContableAlta").on("shown.bs.modal", function () {
        var cleaveDelimiter = new Cleave("#codigo_cuenta_alta", {
            delimiter: ".",
            blocks: [1, 1, 1, 3],
            uppercase: true,
        });
    });
    $("#modalCuentaContableMod").on("shown.bs.modal", function () {
        var cleaveDelimiter = new Cleave("#codigo_cuenta_mod", {
            delimiter: ".",
            blocks: [1, 1, 1, 3],
            uppercase: true,
        });
    });

    aplicarSoloNumeros("#codigo_cuenta_alta, #codigo_cuenta_mod");

    // ===================================================================================
    // 2. INICIALIZACIÓN DE LA APP
    // ===================================================================================

    function onInit() {
        extraer_cuentas_contables();
    }

    // ===================================================================================
    // EXTRAER CUENTAS CONTABLES
    // ===================================================================================

    function extraer_cuentas_contables() {
        let dataString = { backend: "extraer_cuentas_contables" };
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                $("#myAlert").modal("hide");
                if (response.success) {
                    cargar_tabla_cuentas_contables(response.data);
                } else {
                    Swal.fire({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.text,
                    });
                }
            },
        });
    }
    function cargar_tabla_cuentas_contables(cuentas) {
        datatable_cuentas_contables.DataTable({
            destroy: true,
            data: cuentas,
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            columns: [
                {
                    title: "Código",
                    data: "codigo_cuenta",
                    className: "text-start align-middle",
                },
                {
                    title: "Nombre",
                    data: "nombre_cuenta",
                },
                {
                    title: "Estado",
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        if (data.estado == "A") {
                            return '<span class="sac-status-badge sac-status-active">Activo</span>';
                        } else {
                            return '<span class="sac-status-badge sac-status-inactive">Inactivo</span>';
                        }
                    },
                },
                {
                    title: "Fecha Alta",
                    data: "fecha_creacion",
                    className: "text-center align-middle",
                },
                {
                    title: "Acciones",
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        if (data.estado == "A") {
                            return `<div class="sac-table-actions">
                                <button accion="btnVer" class="sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver cuenta contable">
                                    <i class="ri-eye-fill"></i>
                                </button>
                                <button accion="btnEditar" class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar cuenta contable">
                                    <i class="ri-edit-2-fill"></i>
                                </button>
                                <button accion="btnBaja" class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Desactivar" aria-label="Desactivar cuenta contable">
                                    <i class="ri-close-circle-fill"></i>
                                </button>
                            </div>`;
                        } else {
                            return `<div class="sac-table-actions">
                                        <button accion="btnVer" class="sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver cuenta contable">
                                            <i class="ri-eye-fill"></i>
                                        </button>
                                        <button accion="btnAlta" class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Activar" aria-label="Activar cuenta contable">
                                            <i class="ri-check-double-line"></i>
                                        </button>
                                    </div>`;
                        }
                    },
                },
            ],
            pageLength: 25,
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: "Buscar Cuenta Contable",
                emptyTable: `<div class="text-center text-muted py-3">
                                <i class="bi bi-inbox fs-2 mb-2 d-block"></i>
                                <p class="mb-0 fw-medium">No hay cuentas contables para mostrar.</p>
                            </div>`,
            },
            lengthMenu: [
                [25, 50, 100, -1],
                [25, 50, 100, "Todos"],
            ],
            responsive: true,
            scrollX: false,
            sInfo: false,
            info: false,
            order: [[0, "asc"]],
        });
    }

    // ===================================================================================
    // EVENTOS DE BOTONES EN LA TABLA
    // ===================================================================================

    $("#datatable_cuentas_contables").on("click", "button", function () {
        let opt = $(this).attr("accion");
        let row = $(this).closest("tr");
        let cuenta_contable = datatable_cuentas_contables.DataTable().row(row).data();

        switch (opt) {
            case "btnVer":
                extraer_datos_cuenta_contable(cuenta_contable.id_cuenta, cargar_modal_detalle);
                break;
            case "btnEditar":
                extraer_datos_cuenta_contable(cuenta_contable.id_cuenta, cargar_modal_modificar);
                break;
            case "btnBaja":
                console.log("Eliminar cuenta contable:", cuenta_contable.id_cuenta);
                baja_cuenta_contable(cuenta_contable);
                break;
            case "btnAlta":
                console.log("Activar cuenta contable:", cuenta_contable.id_cuenta);
                activar_cuenta_contable(cuenta_contable);
                break;
        }
    });

    // ===================================================================================
    // NUEVA CUENTA CONTABLE
    // ===================================================================================

    btnNuevoCuentaContable.on("click", function () {
        preparar_modal_alta_cuenta_contable();
    });

    ClassValidaciones.validarFormulario(formAltaCuentaContable, btnGuardarNuevaCuentaContable, function () {
        Swal.fire({
            title: "¿Desea dar de alta esta cuenta contable?",
            text: "Se guardará la información proporcionada.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                nueva_cuenta_contable_ajax();
            }
        });
    });

    function preparar_modal_alta_cuenta_contable() {
        limpiarFormulario(formAltaCuentaContable);
        $("#tipo_cuenta_alta").val("");
        $("#modalCuentaContableAlta").modal("show");
    }

    function nueva_cuenta_contable_ajax() {
        let dataString = {
            backend: "nueva_cuenta_contable",
            datos: {
                codigo_cuenta: $("#codigo_cuenta_alta").val().trim(),
                tipo_cuenta: $("#tipo_cuenta_alta").val(),
                nombre_cuenta: $("#nombre_cuenta_alta").val().trim(),
                descripcion: $("#descripcion_cuenta_alta").val().trim(),
            },
        };

        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#modalCuentaContableAlta").modal("hide");
                    Swal.fire({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    }).then(() => {
                        extraer_cuentas_contables();
                        limpiarFormulario(formAltaCuentaContable);
                    });
                } else {
                    Swal.fire({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    });
                }
            },
            error: function () {
                $("#myAlert").modal("hide");
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexión",
                    text: "No se pudo comunicar con el servidor. Por favor, revisa tu conexión a internet.",
                });
            },
            complete: function () {
                $("#myAlert").modal("hide");
            },
        });
    }

    // ===================================================================================
    // MODIFICAR CUENTA CONTABLE
    // ===================================================================================
    function cargar_modal_modificar(data) {
        const cuenta_contable = data.datos;
        $("#id_cuenta_mod").val(cuenta_contable.id_cuenta); // Obtenido desde un input oculto
        $("#codigo_cuenta_mod").val(cuenta_contable.codigo_cuenta);
        $("#tipo_cuenta_mod").val(cuenta_contable.tipo_cuenta);
        $("#nombre_cuenta_mod").val(cuenta_contable.nombre_cuenta);
        $("#descripcion_cuenta_mod").val(cuenta_contable.descripcion);

        $("#modalCuentaContableMod").modal("show");
    }

    btnGuardar_modificarCuentaContable.on("click", function () {
        Swal.fire({
            title: "¿Desea guardar los cambios en esta cuenta contable?",
            text: "Se actualizará la información proporcionada.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                modificar_cuenta_contable_ajax();
            }
        });
    });

    function modificar_cuenta_contable_ajax() {
        let dataString = {
            backend: "modificar_cuenta_contable",
            datos: {
                id_cuenta: $("#id_cuenta_mod").val(),
                codigo_cuenta: $("#codigo_cuenta_mod").val().trim(),
                tipo_cuenta: $("#tipo_cuenta_mod").val(),
                nombre_cuenta: $("#nombre_cuenta_mod").val().trim(),
                descripcion: $("#descripcion_cuenta_mod").val().trim(),
            },
        };

        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#modalCuentaContableMod").modal("hide");
                    Swal.fire({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    }).then(() => {
                        extraer_cuentas_contables();
                        limpiarFormulario(formModCuentaContable);
                    });
                } else {
                    Swal.fire({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    });
                }
            },
            error: function () {
                $("#myAlert").modal("hide");
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexión",
                    text: "No se pudo comunicar con el servidor. Por favor, revisa tu conexión a internet.",
                });
            },
            complete: function () {
                $("#myAlert").modal("hide");
            },
        });
    }
    // ===================================================================================
    // VER DETALLE DE CUENTA CONTABLE
    // ===================================================================================
    function extraer_datos_cuenta_contable(id_cuenta_contable, callback) {
        let dataString = {
            backend: "extraer_cuenta_contable",
            id_cuenta_contable: id_cuenta_contable,
        };
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                $("#myAlert").modal("hide");
                if (response.success) {
                    if (typeof callback === "function") {
                        callback(response.data);
                    }
                } else {
                    Swal.fire({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.text,
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#myAlert").modal("hide");
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexión",
                    text: "No se pudo comunicar con el servidor. Por favor, revisa tu conexión a internet.",
                });
            },
        });
    }

    function cargar_modal_detalle(data) {
        console.log(data);

        const cuenta_contable = data.datos;

        // Cargar título en el header
        $("#id_nombre_detalle").text(cuenta_contable.nombre_cuenta || "Cuenta Contable");

        // Configurar badge de estado
        const badgeActivo = $("#id_badge_activo");
        const estadoTexto = $("#id_estado_texto");

        if (cuenta_contable.estado == "A") {
            badgeActivo.removeClass("bg-danger border-danger text-danger").addClass("bg-success border-success text-success");
            badgeActivo.find("i").removeClass("bi-x-circle").addClass("bi-check-circle");
            estadoTexto.text("Activo");
        } else {
            badgeActivo.removeClass("bg-success border-success text-success").addClass("bg-danger border-danger text-danger");
            badgeActivo.find("i").removeClass("bi-check-circle").addClass("bi-x-circle");
            estadoTexto.text("Inactivo");
        }

        // Función helper para actualizar campos
        const actualizarCampo = (selector, valor) => {
            const elemento = $(selector);
            const parent = elemento.parent();

            if (!valor || valor === "" || valor === null) {
                elemento.text("Sin información");
                parent
                    .removeClass("bg-body-secondary border-black")
                    .addClass("bg-muted bg-opacity-25 border-dashed")
                    .find("p")
                    .addClass("text-muted fst-italic");
            } else {
                elemento.text(valor);
                parent
                    .removeClass("bg-muted bg-opacity-25 border-dashed")
                    .addClass("bg-body-secondary border-black")
                    .find("p")
                    .removeClass("text-muted fst-italic")
                    .addClass("text-dark");
            }
        };

        // Datos de la cuenta
        actualizarCampo("#id_id_cuenta_detalle", cuenta_contable.id_cuenta);
        actualizarCampo("#id_codigo_cuenta_detalle", cuenta_contable.codigo_cuenta);
        actualizarCampo("#id_nombre_cuenta_detalle", cuenta_contable.nombre_cuenta);
        actualizarCampo("#id_descripcion_detalle", cuenta_contable.descripcion);

        let tipoCuentaTexto = "";
        switch (cuenta_contable.tipo_cuenta) {
            case "AC":
                tipoCuentaTexto = "Activo";
                break;
            case "PA":
                tipoCuentaTexto = "Pasivo";
                break;
            case "PN":
                tipoCuentaTexto = "Patrimonio Neto";
                break;
            case "IN":
                tipoCuentaTexto = "Ingreso";
                break;
            case "EG":
                tipoCuentaTexto = "Egreso";
                break;
            default:
                tipoCuentaTexto = cuenta_contable.tipo_cuenta || "Sin información";
        }

        actualizarCampo("#id_tipo_cuenta_detalle", tipoCuentaTexto);
        actualizarCampo("#id_estado_detalle", cuenta_contable.estado == "A" ? "Activo" : "Inactivo");

        // Auditoría
        actualizarCampo("#id_usuario_creacion_detalle", cuenta_contable.usuario_creacion);
        actualizarCampo("#id_fecha_creacion_detalle", cuenta_contable.fecha_creacion);
        actualizarCampo("#id_usuario_modificacion_detalle", cuenta_contable.usuario_modificacion);
        actualizarCampo("#id_fecha_modificacion_detalle", cuenta_contable.fecha_modificacion);
        actualizarCampo("#id_usuario_eliminacion_detalle", cuenta_contable.usuario_eliminacion);
        actualizarCampo("#id_fecha_eliminacion_detalle", cuenta_contable.fecha_eliminacion);

        $("#modalCuentaContableDetalle").modal("show");
    }

    // ===================================================================================
    // ACTIVAR/BAJA CONVENIOS
    // ===================================================================================
    function baja_cuenta_contable(cuenta_contable) {
        Swal.fire({
            title: "¿Está seguro que desea desactivar la cuenta contable?",
            text: "Podrá reactivarla posteriormente si es necesario",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Eliminar cuenta contable:", cuenta_contable.id_cuenta);
                cambiar_estado_cuenta_contable(cuenta_contable.id_cuenta, "I");
            }
        });
    }
    function activar_cuenta_contable(cuenta_contable) {
        Swal.fire({
            title: "¿Está seguro que desea activar la cuenta contable?",
            text: "Podrá reactivarla posteriormente si es necesario",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, activar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                cambiar_estado_cuenta_contable(cuenta_contable.id_cuenta, "A");
            }
        });
    }
    function cambiar_estado_cuenta_contable(id_cuenta, estado) {
        let dataString = {
            backend: "cambiar_estado_cuenta_contable",
            datos: {
                id_cuenta: id_cuenta,
                estado: estado,
            },
        };
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                console.log(response);
                $("#myAlert").modal("hide");
                if (response.success) {
                    Swal.fire({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    }).then(() => {
                        extraer_cuentas_contables();
                    });
                } else {
                    Swal.fire({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    });
                }
            },
        });
    }

    // ===================================================================================
    // FUNCIONES AUXILIARES
    // ===================================================================================

    function limpiarFormulario(from) {
        from[0].reset();
        from.removeClass("was-validated");
        // Remover clases de validación de Bootstrap de todos los campos
        from.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
    }

    // PASAR A FUNCION GENERAL, SE REPITE EN VARIOS LUGARES
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

                // Mostrar mensaje opcional (puedes comentar esta línea si no quieres el mensaje)
                // Swal.fire({
                //     icon: 'warning',
                //     title: 'Atención',
                //     text: 'Solo se permiten números en este campo',
                //     timer: 2000,
                //     showConfirmButton: false
                // });

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

    // ===================================================================================
    // PUNTO DE ENTRADA DE LA APLICACIÓN
    // ===================================================================================
    onInit();
});
