const ClassValidaciones = window.Validaciones;
const ClassFormatos = window.Formatos;
$(document).ready(function () {
    // ===================================================================================
    // 1. CONFIGURACIÓN, VARIABLES Y CONSTANTES
    // ===================================================================================
    const datatable_convenios = $("#datatable_convenios");
    const datatable_planes_mod = $("#datatable_planes_mod");
    const datatable_planes_alta = $("#datatable_planes_alta");

    const formModificarConvenio = $("#formModificarConvenio");
    const formAltaConvenio = $("#formAltaConvenio");
    const formPlanAlta = $("#formPlanAlta");
    const formPlan = $("#formPlan");

    const selectCuentaActivoAlta = $("#id_cuenta_activo_alta");
    const selectCuentaPasivoAlta = $("#id_cuenta_pasivo_alta");
    const selectCuentaActivoMod = $("#id_cuenta_activo_mod");
    const selectCuentaPasivoMod = $("#id_cuenta_pasivo_mod");

    const btnConfirmarModificarConvenio = $("#btnConfirmarModificarConvenio");
    const btnConfirmarAltaConvenio = $("#btnConfirmarAltaConvenio");
    const btnGuardarPlan_alta = $("#btnGuardarPlan_alta");
    const btnGuardarPlan = $("#btnGuardarPlan");

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

    let fila_plan_a_editar_alta = null; // Variable de estado para la tabla de alta

    let provincias_guardadas = [];
    let fila_plan_a_editar = null; // Variable para saber qué fila de la tabla estamos editando
    let choicesCuentaActivoAlta = null;
    let choicesCuentaPasivoAlta = null;
    let choicesCuentaActivoMod = null;
    let choicesCuentaPasivoMod = null;
    let timeoutsBusquedaCuentaContable = {};

    // ===================================================================================
    // 2. INICIALIZACIÓN DE LA APP
    // ===================================================================================

    function onInit() {
        inicializar_mascaras_porcentajes();
        inicializar_choices_cuentas_contables_alta();
        inicializar_choices_cuentas_contables_mod();
        extraer_convenios();
        extraer_provincias();
    }

    function inicializar_mascaras_porcentajes() {
        ClassFormatos.aplicarMascaraPorcentajeInput("#cobertura_plan_form");
        ClassFormatos.aplicarMascaraPorcentajeInput("#bonif_os_plan_form");
        ClassFormatos.aplicarMascaraPorcentajeInput("#bonif_farmacia_plan_form");

        ClassFormatos.aplicarMascaraPorcentajeInput("#cobertura_plan_form_alta");
        ClassFormatos.aplicarMascaraPorcentajeInput("#bonif_os_plan_form_alta");
        ClassFormatos.aplicarMascaraPorcentajeInput("#bonif_farmacia_plan_form_alta");
    }

    function inicializar_choices_cuentas_contables_alta() {
        if (typeof Choices === "undefined") {
            return;
        }

        choicesCuentaActivoAlta = inicializar_choice_cuenta_contable(
            selectCuentaActivoAlta,
            choicesCuentaActivoAlta,
            "Seleccione cuenta activo",
        );
        choicesCuentaPasivoAlta = inicializar_choice_cuenta_contable(
            selectCuentaPasivoAlta,
            choicesCuentaPasivoAlta,
            "Seleccione cuenta pasivo",
        );

        vincular_busqueda_cuenta_contable(selectCuentaActivoAlta, "activoAlta", function () {
            return choicesCuentaActivoAlta;
        });
        vincular_busqueda_cuenta_contable(selectCuentaPasivoAlta, "pasivoAlta", function () {
            return choicesCuentaPasivoAlta;
        });
        vincular_seleccion_cuenta_contable(selectCuentaActivoAlta);
        vincular_seleccion_cuenta_contable(selectCuentaPasivoAlta);

        buscar_cuentas_contables_alta("", selectCuentaActivoAlta, choicesCuentaActivoAlta);
        buscar_cuentas_contables_alta("", selectCuentaPasivoAlta, choicesCuentaPasivoAlta);
    }

    function inicializar_choices_cuentas_contables_mod() {
        if (typeof Choices === "undefined") {
            return;
        }

        choicesCuentaActivoMod = inicializar_choice_cuenta_contable(
            selectCuentaActivoMod,
            choicesCuentaActivoMod,
            "Seleccione cuenta activo",
        );
        choicesCuentaPasivoMod = inicializar_choice_cuenta_contable(
            selectCuentaPasivoMod,
            choicesCuentaPasivoMod,
            "Seleccione cuenta pasivo",
        );

        vincular_busqueda_cuenta_contable(selectCuentaActivoMod, "activoMod", function () {
            return choicesCuentaActivoMod;
        });
        vincular_busqueda_cuenta_contable(selectCuentaPasivoMod, "pasivoMod", function () {
            return choicesCuentaPasivoMod;
        });
        vincular_seleccion_cuenta_contable(selectCuentaActivoMod);
        vincular_seleccion_cuenta_contable(selectCuentaPasivoMod);
    }

    function inicializar_choice_cuenta_contable(selectElement, instanciaActual, placeholderValue) {
        if (!selectElement.length) {
            return null;
        }

        if (instanciaActual) {
            instanciaActual.destroy();
        }

        selectElement.empty().append('<option value="" selected>Seleccione una cuenta...</option>');
        selectElement.removeData("cuentaContableSeleccionada");
        selectElement.data("cuentasContablesDisponibles", []);

        return new Choices(selectElement[0], {
            ...CHOICES_CONFIG,
            searchChoices: false,
            placeholderValue: placeholderValue,
            searchPlaceholderValue: "Buscar cuenta...",
            noResultsText: "Escriba para buscar cuentas",
            noChoicesText: "No hay cuentas disponibles",
        });
    }

    function vincular_busqueda_cuenta_contable(selectElement, timeoutKey, obtenerInstanciaChoices) {
        selectElement.off("search.choicesCuentasAlta").on("search.choicesCuentasAlta", function (e) {
            const termino = String(e?.detail?.value || "").trim();
            const timeoutActual = timeoutsBusquedaCuentaContable[timeoutKey] || null;

            clearTimeout(timeoutActual);

            const nuevoTimeout = setTimeout(function () {
                const instanciaChoices = typeof obtenerInstanciaChoices === "function" ? obtenerInstanciaChoices() : null;
                buscar_cuentas_contables_alta(termino, selectElement, instanciaChoices);
            }, 250);

            timeoutsBusquedaCuentaContable[timeoutKey] = nuevoTimeout;
        });
    }

    function vincular_seleccion_cuenta_contable(selectElement) {
        selectElement.off("change.choicesCuentasAlta choice.choicesCuentasAlta");
        selectElement.on("change.choicesCuentasAlta choice.choicesCuentasAlta", function () {
            actualizar_cuenta_contable_seleccionada(selectElement);
        });
    }

    function buscar_cuentas_contables_alta(termino, selectElement, instanciaChoices) {
        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            data: {
                backend: "sugerencias_cuentas_contables",
                termino: termino,
            },
            dataType: "json",
            success: function (response) {
                const cuentasContables =
                    response && response.success && Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];
                cargar_select_cuentas_contables_alta(selectElement, instanciaChoices, cuentasContables, selectElement.val());
            },
            error: function () {
                cargar_select_cuentas_contables_alta(selectElement, instanciaChoices, [], "");
            },
        });
    }

    function cargar_select_cuentas_contables_alta(selectElement, instanciaChoices, cuentasContables, valorSeleccionado = "") {
        const cuentas = Array.isArray(cuentasContables) ? cuentasContables : [];
        const cuentaSeleccionadaActual = selectElement.data("cuentaContableSeleccionada") || null;
        let existeCuentaSeleccionada = cuentas.some(function (cuenta) {
            return String(cuenta.id_cuenta) === String(valorSeleccionado);
        });
        let cuentasParaOpciones = cuentas.slice();

        if (
            !existeCuentaSeleccionada &&
            cuentaSeleccionadaActual &&
            String(cuentaSeleccionadaActual.id_cuenta) === String(valorSeleccionado)
        ) {
            cuentasParaOpciones = [cuentaSeleccionadaActual].concat(
                cuentas.filter(function (cuenta) {
                    return String(cuenta.id_cuenta) !== String(cuentaSeleccionadaActual.id_cuenta);
                }),
            );
            existeCuentaSeleccionada = true;
        }

        selectElement.data("cuentasContablesDisponibles", cuentasParaOpciones);

        const opciones = [
            { value: "", label: "Seleccione una cuenta...", selected: !existeCuentaSeleccionada },
            ...cuentasParaOpciones.map(function (cuenta) {
                return {
                    value: String(cuenta.id_cuenta || ""),
                    label: cuenta.label || construir_descripcion_cuenta_contable(cuenta),
                    selected: String(cuenta.id_cuenta) === String(valorSeleccionado),
                };
            }),
        ];

        if (instanciaChoices) {
            instanciaChoices.clearChoices();
            instanciaChoices.setChoices(opciones, "value", "label", true);
            selectElement.val(existeCuentaSeleccionada ? String(valorSeleccionado) : "");
            actualizar_cuenta_contable_seleccionada(selectElement);
            return;
        }

        selectElement.empty().append('<option value="" selected>Seleccione una cuenta...</option>');

        cuentasParaOpciones.forEach(function (cuenta) {
            selectElement.append(
                `<option value="${cuenta.id_cuenta}">${cuenta.label || construir_descripcion_cuenta_contable(cuenta)}</option>`,
            );
        });

        selectElement.val(existeCuentaSeleccionada ? String(valorSeleccionado) : "");
        actualizar_cuenta_contable_seleccionada(selectElement);
    }

    function construir_descripcion_cuenta_contable(cuenta) {
        return [cuenta.codigo_cuenta, cuenta.nombre_cuenta].filter(Boolean).join(" - ");
    }

    function normalizar_porcentaje(valor) {
        if (ClassFormatos && typeof ClassFormatos.parseNumero === "function") {
            return ClassFormatos.parseNumero(valor);
        }

        const valorNormalizado = String(valor || "0")
            .replace(/\./g, "")
            .replace(/,/g, ".");
        const numero = Number.parseFloat(valorNormalizado);

        return Number.isFinite(numero) ? numero : 0;
    }

    function normalizar_datos_plan(plan) {
        return {
            ...plan,
            cobertura: normalizar_porcentaje(plan.cobertura),
            bonificacion_os: normalizar_porcentaje(plan.bonificacion_os),
            bonificacion_farmacia: normalizar_porcentaje(plan.bonificacion_farmacia),
        };
    }

    function actualizar_cuenta_contable_seleccionada(selectElement) {
        const valorSeleccionado = String(selectElement.val() || "");
        const cuentasDisponibles = selectElement.data("cuentasContablesDisponibles") || [];
        const cuentaSeleccionada = cuentasDisponibles.find(function (cuenta) {
            return String(cuenta.id_cuenta) === valorSeleccionado;
        });

        if (cuentaSeleccionada) {
            selectElement.data("cuentaContableSeleccionada", cuentaSeleccionada);
            return;
        }

        if (!valorSeleccionado) {
            selectElement.removeData("cuentaContableSeleccionada");
        }
    }

    function precargar_cuenta_contable_seleccionada(idCuenta, selectElement, instanciaChoices) {
        if (!idCuenta) {
            cargar_select_cuentas_contables_alta(selectElement, instanciaChoices, [], "");
            return;
        }

        $.ajax({
            type: "POST",
            url: "app/Controllers/Contabilidad/Cuentas_contables_backend.php",
            data: {
                backend: "extraer_cuenta_contable",
                id_cuenta_contable: idCuenta,
            },
            dataType: "json",
            success: function (response) {
                const cuenta = response && response.success && response.data ? response.data.datos || null : null;

                if (!cuenta) {
                    cargar_select_cuentas_contables_alta(selectElement, instanciaChoices, [], "");
                    return;
                }

                selectElement.data("cuentaContableSeleccionada", cuenta);
                cargar_select_cuentas_contables_alta(selectElement, instanciaChoices, [cuenta], idCuenta);
            },
            error: function () {
                cargar_select_cuentas_contables_alta(selectElement, instanciaChoices, [], "");
            },
        });
    }

    function resetear_cuentas_contables_alta() {
        cargar_select_cuentas_contables_alta(selectCuentaActivoAlta, choicesCuentaActivoAlta, [], "");
        cargar_select_cuentas_contables_alta(selectCuentaPasivoAlta, choicesCuentaPasivoAlta, [], "");
        buscar_cuentas_contables_alta("", selectCuentaActivoAlta, choicesCuentaActivoAlta);
        buscar_cuentas_contables_alta("", selectCuentaPasivoAlta, choicesCuentaPasivoAlta);
    }

    function resetear_cuentas_contables_mod() {
        cargar_select_cuentas_contables_alta(selectCuentaActivoMod, choicesCuentaActivoMod, [], "");
        cargar_select_cuentas_contables_alta(selectCuentaPasivoMod, choicesCuentaPasivoMod, [], "");
    }

    // ===================================================================================
    // EXTRAER CONVENIOS
    // ===================================================================================

    function extraer_convenios() {
        let dataString = { backend: "extraer_convenios" };
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Convenios/Convenios_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                $("#myAlert").modal("hide");
                if (response.success) {
                    cargar_tabla_convenios(response.data);
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
    function cargar_tabla_convenios(convenios) {
        datatable_convenios.DataTable({
            destroy: true,
            data: convenios,
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            columns: [
                {
                    data: "id_convenio",
                    className: "text-start align-middle",
                },
                {
                    data: "cuit",
                    className: "text-start align-middle",
                    render: render_dato_convenio,
                },
                {
                    data: "razon_social",
                    render: render_dato_convenio,
                },
                {
                    data: "nombre",
                    render: render_dato_convenio,
                },
                {
                    data: null,
                    className: "text-center",
                    render: function (data) {
                        if (data.activo == "1") {
                            return '<span class="sac-status-badge sac-status-active">Activo</span>';
                        } else {
                            return '<span class="sac-status-badge sac-status-inactive">Inactivo</span>';
                        }
                    },
                },
                {
                    data: "fecha_creacion",
                    className: "text-center align-middle",
                    render: render_dato_convenio,
                },
                {
                    data: null,
                    className: "text-center",
                    render: function (data) {
                        if (data.activo == "1") {
                            return `<div class="d-flex justify-content-center gap-2">
                                <button accion="btnVer" class="sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver convenio">
                                    <i class="ri-eye-fill"></i>
                                </button>
                                <button accion="btnEditar" class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar convenio">
                                    <i class="ri-edit-2-fill"></i>
                                </button>
                                <button accion="btnBaja" class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Desactivar" aria-label="Desactivar convenio">
                                    <i class="ri-close-circle-fill"></i>
                                </button>
                            </div>`;
                        } else {
                            return `<div class="d-flex justify-content-center gap-2">
                                        <button accion="btnVer" class="sac-btn-icon sac-btn-icon-sm sac-btn-view" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver convenio">
                                            <i class="ri-eye-fill"></i>
                                        </button>
                                        <button accion="btnAlta" class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Activar" aria-label="Activar convenio">
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
                searchPlaceholder: "Buscar Convenio",
                emptyTable: `
                <div class="text-center text-muted py-3">
                    <i class="bi bi-inbox fs-2 mb-2 d-block"></i>
                    <p class="mb-0 fw-medium">Este convenio aún no tiene planes asociados.</p>
                </div>
            `,
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

    function render_dato_convenio(data, type) {
        if (data === null || data === undefined || String(data).trim() === "") {
            return type === "display" ? '<span class="text-muted">Sin datos</span>' : "";
        }

        return data;
    }

    // ===================================================================================
    // EVENTOS DE BOTONES EN LA TABLA
    // ===================================================================================

    $("#datatable_convenios").on("click", "button", function () {
        let opt = $(this).attr("accion");
        let row = $(this).closest("tr");
        let convenios = datatable_convenios.DataTable().row(row).data();

        switch (opt) {
            case "btnVer":
                extraer_datos_convenio(convenios.id_convenio, cargar_datos_modal_convenio);
                break;
            case "btnEditar":
                extraer_datos_convenio(convenios.id_convenio, cargar_modal_modificar);
                break;
            case "btnBaja":
                baja_convenio(convenios);
                break;
            case "btnAlta":
                activar_convenio(convenios);
                break;
        }
    });

    // ===================================================================================
    // ACTIVAR/BAJA CONVENIOS
    // ===================================================================================
    function baja_convenio(convenios) {
        Swal.fire({
            title: "¿Está seguro que desea desactivar el convenio?",
            text: "Podrá reactivarlo posteriormente si es necesario",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                cambiar_estado_convenio(convenios.id_convenio, 0);
            }
        });
    }
    function activar_convenio(convenios) {
        Swal.fire({
            title: "¿Está seguro que desea activar el convenio?",
            text: "Podrá reactivarlo posteriormente si es necesario",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, activar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                cambiar_estado_convenio(convenios.id_convenio, 1);
            }
        });
    }
    function cambiar_estado_convenio(id_convenio, estado) {
        let dataString = {
            backend: "cambiar_estado_convenio",
            datos: {
                id_convenio: id_convenio,
                estado: estado,
            },
        };
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Convenios/Convenios_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                $("#myAlert").modal("hide");
                if (response.success) {
                    Swal.fire({
                        icon: response.alert.icon,
                        title: response.alert.title,
                        text: response.alert.message,
                    }).then(() => {
                        extraer_convenios();
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
    // EDITAR CONVENIOS
    // ===================================================================================
    function cargar_modal_modificar(data) {
        aplicarSoloNumeros("#id_plan_form");
        aplicarSoloNumeros("#id_cuit_mod");
        aplicarSoloNumeros("#id_telefono_mod");
        aplicarSoloNumeros("#id_codigo_postal_mod");

        const convenio = data.datos;
        const planes = data.planes || [];
        $("#formModificarConvenio").data("id_convenio", convenio.id_convenio);

        limpiarFormulario(formModificarConvenio);
        resetear_cuentas_contables_mod();

        $("#id_estado_texto").text(""); // Limpiamos específicamente el span del estado

        $("#id_nombre_mod").text(convenio.nombre || "Editar Convenio");

        $("#id_cuit_mod").val(convenio.cuit);
        $("#id_nombre_convenio_mod").val(convenio.nombre);
        $("#id_razon_social_mod").val(convenio.razon_social);
        $("#id_direccion_mod").val(convenio.direccion);
        $("#id_codigo_postal_mod").val(convenio.codigo_postal);
        $("#id_tipo_cierre_mod").val(convenio.tipo_cierre);
        $("#id_telefono_mod").val(convenio.telefono);
        $("#id_email_mod").val(convenio.email);
        $("#id_sitio_web_mod").val(convenio.sitio_web);
        $("#id_provincia_mod").val(convenio.patente);

        buscar_cuentas_contables_alta("", selectCuentaActivoMod, choicesCuentaActivoMod);
        buscar_cuentas_contables_alta("", selectCuentaPasivoMod, choicesCuentaPasivoMod);
        precargar_cuenta_contable_seleccionada(convenio.cuenta_contable_activo, selectCuentaActivoMod, choicesCuentaActivoMod);
        precargar_cuenta_contable_seleccionada(convenio.cuenta_contable_pasivo, selectCuentaPasivoMod, choicesCuentaPasivoMod);

        if (convenio.patente && convenio.localidad_id) {
            cargar_y_seleccionar_localidades(convenio.patente, $("#id_localidad_mod"), convenio.localidad_id);
        }

        cargar_tabla_planes_mod(planes);

        $("#modalConvenioModificar").modal("show");
    }
    function cargar_tabla_planes_mod(planes) {
        datatable_planes_mod.DataTable({
            destroy: true,
            data: planes,
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            columns: [
                {
                    data: "id_plan",
                    className: "text-center",
                    title: "Id Plan",
                },
                {
                    data: "nombre",
                    title: "Nombre del Plan",
                },
                {
                    data: "cobertura",
                    title: "Cobertura",
                    className: "text-center",
                    render: function (data) {
                        return `<span class="fw-medium">${data}%</span>`;
                    },
                },
                {
                    data: "bonificacion_os",
                    title: "Bonif. OS",
                    className: "text-center",
                    render: function (data) {
                        return `<span class="fw-medium">${data}%</span>`;
                    },
                },
                {
                    data: "bonificacion_farmacia",
                    title: "Bonif. Farmacia",
                    className: "text-center",
                    render: function (data) {
                        return `<span class="fw-medium">${data}%</span>`;
                    },
                },
                {
                    data: "activo",
                    title: "Estado",
                    className: "text-center",
                    render: function (data) {
                        if (data == "1") {
                            return '<span class="badge bg-success">Activo</span>';
                        } else {
                            return '<span class="badge bg-danger">Inactivo</span>';
                        }
                    },
                },
                {
                    data: null,
                    title: "Acciones",
                    className: "text-center",
                    orderable: false,
                    render: function (data) {
                        return `<div class="d-flex justify-content-center gap-2">
                                    <button accion="btnEditarPlan" class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar Plan" aria-label="Editar plan">
                                        <i class="ri-edit-2-fill"></i>
                                    </button>
                                    <button accion="btnBajaPlan" class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Desactivar Plan" aria-label="Desactivar plan">
                                        <i class="ri-close-circle-fill"></i>
                                    </button>
                                </div>`;
                    },
                },
            ],
            pageLength: 5,
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: "Buscar Plan",
            },
            lengthMenu: [
                [5, 10, 25],
                [5, 10, 25],
            ],
            responsive: true,
            info: false,
            searching: true,
        });
    }

    // Evento que se dispara al cambiar la provincia en el modal de modificación
    $("#id_provincia_mod").on("change", function () {
        const id_provincia_seleccionada = $(this).val();
        if (id_provincia_seleccionada) {
            extraer_localidades(id_provincia_seleccionada, $("#id_localidad_mod"));
        }
    });

    ClassValidaciones.validarFormulario(formModificarConvenio, btnConfirmarModificarConvenio, function () {
        Swal.fire({
            title: "¿Desea modificar el convenio?",
            text: "Los cambios se guardarán.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, modificar",
            cancelButtonText: "No, cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                modificar_convenio();
            }
        });
    });
    function modificar_convenio() {
        const datos_convenio = {
            id_convenio: $("#formModificarConvenio").data("id_convenio"),
            nombre: $("#id_nombre_convenio_mod").val(),
            razon_social: $("#id_razon_social_mod").val(),
            cuit: $("#id_cuit_mod").val(),
            cuenta_contable_activo: $("#id_cuenta_activo_mod").val() || null,
            cuenta_contable_pasivo: $("#id_cuenta_pasivo_mod").val() || null,
            tipo_cierre: $("#id_tipo_cierre_mod").val(),
            patente: $("#id_provincia_mod").val(),
            localidad_id: $("#id_localidad_mod").val(),
            codigo_postal: $("#id_codigo_postal_mod").val(),
            direccion: $("#id_direccion_mod").val(),
            telefono: $("#id_telefono_mod").val() || null,
            email: $("#id_email_mod").val(),
            sitio_web: $("#id_sitio_web_mod").val() || null,
        };

        let dataString = {
            backend: "modificar_convenio",
            datos: datos_convenio,
        };

        $.ajax({
            type: "POST",
            url: "app/Controllers/Convenios/Convenios_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Convenio modificado",
                        text: "Los cambios se han guardado correctamente.",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error al modificar",
                        text: response.error || "No se pudo modificar el convenio.",
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexión",
                    text: "No se pudo comunicar con el servidor. Por favor, revisa tu conexión a internet.",
                });
            },
        });
        extraer_convenios();
        $("#modalConvenioModificar").modal("hide");
    }

    // ===================================================================================
    // SECCION PLANES - LÓGICA DE GESTIÓN CON PANEL DESPLEGABLE
    // ===================================================================================

    // Listener para el botón "Agregar Plan" (fuera de la tabla)
    $("#btnAgregarPlan").on("click", function () {
        desplegar_formulario_nuevo_plan();
    });

    $("#datatable_planes_mod").on("click", "button", function () {
        let accion = $(this).attr("accion");
        let fila = $(this).closest("tr");

        if (fila.hasClass("child")) {
            fila = fila.prev();
        }

        fila_plan_a_editar = datatable_planes_mod.DataTable().row(fila);

        const plan_data = datatable_planes_mod.DataTable().row(fila).data();

        switch (accion) {
            case "btnEditarPlan":
                desplegar_formulario_editar_plan(plan_data);
                break;
            case "btnBajaPlan":
                Swal.fire({
                    title: `¿Desactivar el plan "${plan_data.nombre}"?`,
                    text: "Podrás reactivarlo más tarde.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Sí, desactivar",
                    cancelButtonText: "Cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire("Desactivado", "El plan ha sido desactivado.", "success");
                    }
                });
                break;
        }
    });

    /**
     * Prepara y despliega el formulario para agregar un nuevo plan.
     */
    function desplegar_formulario_nuevo_plan() {
        fila_plan_a_editar = null;
        formPlan.removeData("id_plan_original");
        $("#formPlanTitle").text("Agregar Nuevo Plan");
        limpiarFormulario(formPlan);
        $("#id_plan_form").val("");

        // Mostrar el panel
        $("#formContainerPlan").collapse("show");
    }

    /**
     * Prepara, rellena y despliega el formulario para editar un plan.
     * @param {object} plan_data - Los datos de la fila del plan.
     */
    function desplegar_formulario_editar_plan(plan_data) {
        formPlan.data("id_plan_original", plan_data.id_plan);
        $("#formPlanTitle").text(`Editando Plan: ${plan_data.nombre}`);

        const tooltipTitle = fila_plan_a_editar ? "Editar Plan" : "Nuevo Plan";
        btnGuardarPlan.attr("data-bs-original-title", tooltipTitle).tooltip("show");

        limpiarFormulario(formPlan);

        $("#id_plan_form").val(plan_data.id_plan);
        $("#nombre_plan_form").val(plan_data.nombre);
        $("#cobertura_plan_form").val(plan_data.cobertura);
        $("#bonif_os_plan_form").val(plan_data.bonificacion_os);
        $("#bonif_farmacia_plan_form").val(plan_data.bonificacion_farmacia);

        $("#formContainerPlan").collapse("show");
    }

    // Listener para el botón CANCELAR dentro del formulario desplegable
    $("#btnCancelarPlan").on("click", function () {
        $("#formContainerPlan").collapse("hide");
    });

    ClassValidaciones.validarFormulario(formPlan, btnGuardarPlan, function () {
        Swal.fire({
            title: "¿Está seguro de que desea guardar los cambios?",
            text: "Una vez guardados, no podrá deshacer los cambios.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                alta_mod_plan();
            }
        });
    });

    function alta_mod_plan() {
        const idConvenio = $("#formModificarConvenio").data("id_convenio");
        if (!idConvenio) {
            Swal.fire("Error", "No se ha podido identificar el convenio actual.", "error");
            return;
        }

        const idPlanOriginal = formPlan.data("id_plan_original") || null;
        const esNuevo = fila_plan_a_editar === null;

        const plan_data = normalizar_datos_plan({
            id_plan: $("#id_plan_form").val(),
            id_plan_original: idPlanOriginal,
            convenio_id: idConvenio,
            nombre: $("#nombre_plan_form").val(),
            cobertura: $("#cobertura_plan_form").val(),
            bonificacion_os: $("#bonif_os_plan_form").val(),
            bonificacion_farmacia: $("#bonif_farmacia_plan_form").val(),
            es_nuevo: esNuevo ? 1 : 0,
        });

        const dataString = {
            backend: esNuevo ? "nuevo_plan" : "modificar_plan",
            datos: plan_data,
        };

        $.ajax({
            type: "POST",
            url: "app/Controllers/Convenios/Convenios_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    Toastify({ text: `Plan ${esNuevo ? "agregado" : "modificado"} con éxito.`, className: "info" }).showToast();

                    $("#formContainerPlan").collapse("hide");
                    limpiarFormulario(formPlan);
                    formPlan.removeData("id_plan_original");
                    fila_plan_a_editar = null;

                    actualizar_tabla_planes();
                } else {
                    Swal.fire("Error", response.message || "No se pudo guardar el plan.", "error");
                }
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            },
        });
    }

    function actualizar_tabla_planes() {
        const idConvenio = $("#formModificarConvenio").data("id_convenio");
        if (!idConvenio) {
            return;
        }

        const dataString = {
            backend: "extraer_planes",
            id_convenio: idConvenio,
        };

        $.ajax({
            type: "POST",
            url: "app/Controllers/Convenios/Convenios_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    cargar_tabla_planes_mod(response.data);
                }
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo actualizar la tabla de planes.", "error");
            },
        });
    }

    // ===================================================================================
    // VER CONVENIOS
    // ===================================================================================

    function extraer_datos_convenio(id_convenio, callback) {
        let dataString = {
            backend: "extraer_convenio",
            id_convenio: id_convenio,
        };
        $("#myAlert").modal("show");
        $.ajax({
            type: "POST",
            url: "app/Controllers/Convenios/Convenios_backend.php",
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

    function cargar_datos_modal_convenio(data) {
        const convenio = data.datos;
        const planes = data.planes || [];

        $("#id_nombre_detalle").text(convenio.nombre || "Sin nombre");

        const badgeActivo = $("#id_badge_activo");
        const estadoTexto = $("#id_estado_texto");

        if (convenio.activo == "1") {
            badgeActivo.removeClass("bg-danger border-danger text-danger").addClass("bg-success border-success text-white");
            badgeActivo.find("i").removeClass("bi-x-circle").addClass("bi-check-circle");
            estadoTexto.text("Activo");
        } else {
            badgeActivo.removeClass("bg-success border-success text-white").addClass("bg-danger border-danger text-danger");
            badgeActivo.find("i").removeClass("bi-check-circle").addClass("bi-x-circle");
            estadoTexto.text("Inactivo");
        }

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

        // Información Fiscal
        actualizarCampo("#id_cuit_detalle", convenio.cuit);
        actualizarCampo("#id_patente_detalle", convenio.patente);
        actualizarCampo("#id_razon_social_detalle", convenio.razon_social);
        actualizarCampo("#id_nombre_convenio_detalle", convenio.nombre);

        // Ubicación
        actualizarCampo("#id_direccion_detalle", convenio.direccion);
        actualizarCampo("#id_provincia_detalle", convenio.provincia_nombre);
        actualizarCampo("#id_localidad_detalle", convenio.localidad_nombre);
        actualizarCampo("#id_codigo_postal_detalle", convenio.codigo_postal);
        actualizarCampo("#id_tipo_cierre_detalle", convenio.tipo_cierre);

        // Contacto
        actualizarCampo("#id_telefono_detalle", convenio.telefono);
        actualizarCampo("#id_email_detalle", convenio.email);
        actualizarCampo("#id_sitio_web_detalle", convenio.sitio_web);

        // Cuentas contables
        actualizarCampo("#id_cuenta_activo_detalle", convenio.cuenta_contable_activo_label || convenio.cuenta_contable_activo);
        actualizarCampo("#id_cuenta_pasivo_detalle", convenio.cuenta_contable_pasivo_label || convenio.cuenta_contable_pasivo);

        // Planes
        cargar_planes_convenio(planes);

        // Información del Sistema
        actualizarCampo("#id_fecha_creacion_detalle", convenio.fecha_creacion);
        actualizarCampo("#id_fecha_modificacion_detalle", convenio.fecha_modificacion);

        $("#modalConvenioDetalle").modal("show");
    }

    function cargar_planes_convenio(planes) {
        const container = $("#id_planes_container");

        if (!planes || planes.length === 0) {
            container.html(`
                <div class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-2 mb-2 d-block"></i>
                    <p class="mb-0">No hay planes asociados</p>
                </div>
            `);
            return;
        }

        let htmlPlanes = '<div class="row g-3">';

        planes.forEach((plan, index) => {
            const badgeClass =
                plan.activo == "1"
                    ? "bg-success bg-opacity-10 text-white border-success"
                    : "bg-secondary bg-opacity-10 text-secondary border-black";
            const estadoPlan = plan.activo == "1" ? "Activo" : "Inactivo";
            const estadoDot =
                plan.activo == "1" ? '<span class="badge rounded-circle bg-success p-1 me-1" style="width: 6px; height: 6px;"></span>' : "";

            htmlPlanes += `
                <div class="col-md-6">
                    <div class="bg-body-secondary bg-opacity-50 rounded-2 border border-black border-opacity-25 overflow-hidden">
                        <div class="d-flex align-items-center justify-content-between px-3 py-2">
                            <span class="small fw-semibold text-dark">${plan.nombre}</span>
                            <span class="badge ${badgeClass} border border-opacity-25">${estadoDot}${estadoPlan}</span>
                        </div>
                        <div class="px-3 pb-2">
                            <div class="d-flex align-items-center justify-content-between text-muted mb-1" style="font-size: 0.75rem;">
                                <span><i class="bi bi-percent me-1"></i>Cobertura</span>
                                <span class="fw-medium text-dark">${plan.cobertura}%</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between text-muted mb-1" style="font-size: 0.75rem;">
                                <span><i class="bi bi-tag me-1"></i>Bonif. OS</span>
                                <span class="fw-medium text-dark">${plan.bonificacion_os}%</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between text-muted" style="font-size: 0.75rem;">
                                <span><i class="bi bi-hospital me-1"></i>Bonif. Farmacia</span>
                                <span class="fw-medium text-dark">${plan.bonificacion_farmacia}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        htmlPlanes += "</div>";
        container.html(htmlPlanes);
    }

    // ===================================================================================
    // ALTA DE CONVENIOS - LÓGICA COMPLETA
    // ===================================================================================

    $("#btnNuevoConvenio").on("click", function () {
        abrir_modal_alta();
    });

    function abrir_modal_alta() {
        aplicarSoloNumeros("#id_conv_alta");
        aplicarSoloNumeros("#id_cuit_alta");
        aplicarSoloNumeros("#id_codigo_postal_alta");
        aplicarSoloNumeros("#id_telefono_alta");

        formAltaConvenio[0].reset();
        limpiarFormulario(formAltaConvenio);
        fila_plan_a_editar_alta = null;

        cargar_select_provincias($("#id_provincia_alta"), provincias_guardadas);
        $("#id_localidad_alta").empty().append('<option value="" disabled selected>Seleccione Localidad</option>');

        inicializar_tabla_planes_alta();

        resetear_cuentas_contables_alta();

        $("#formContainerPlan_alta").collapse("hide");
        $("#modalConvenioAlta").modal("show");
    }

    function inicializar_tabla_planes_alta() {
        datatable_planes_alta.DataTable({
            destroy: true,
            data: [],
            drawCallback: function () {
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            columns: [
                { data: "nombre", title: "Nombre" },
                { data: "cobertura", title: "Cobertura (%)", className: "text-center" },
                { data: "bonificacion_os", title: "Bonif. OS (%)", className: "text-center" },
                { data: "bonificacion_farmacia", title: "Bonif. Farmacia (%)", className: "text-center" },
                {
                    data: null,
                    title: "Acciones",
                    className: "text-center",
                    orderable: false,
                    render: function () {
                        return `<div class="sac-table-actions">
                                <button type="button" accion="btnEditarPlanAlta" class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar Plan" aria-label="Editar plan"><i class="ri-edit-2-fill"></i></button>
                                <button type="button" accion="btnEliminarPlanAlta" class="sac-btn-icon sac-btn-icon-sm sac-btn-delete" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar Plan" aria-label="Eliminar plan"><i class="ri-delete-bin-fill"></i></button>
                            </div>`;
                    },
                },
            ],
            language: { url: "public/json/Spanish.json", emptyTable: "Aún no se han agregado planes." },
            paging: false,
            info: false,
            searching: false,
        });
    }

    $("#id_provincia_alta").on("change", function () {
        const patente_provincia = $(this).val();
        if (patente_provincia) {
            extraer_localidades(patente_provincia, $("#id_localidad_alta"));
        }
    });

    $("#btnAgregarPlan_alta").on("click", function () {
        fila_plan_a_editar_alta = null;
        $("#formPlanTitle_alta").text("Agregar Nuevo Plan");
        limpiarFormulario(formPlanAlta);
        $("#id_plan_form_alta").val("");
        $("#formContainerPlan_alta").collapse("show");
    });

    $("#datatable_planes_alta").on("click", "button", function () {
        const accion = $(this).attr("accion");
        fila_plan_a_editar_alta = datatable_planes_alta.DataTable().row($(this).closest("tr"));
        const plan_data = fila_plan_a_editar_alta.data();

        switch (accion) {
            case "btnEditarPlanAlta":
                $("#formPlanTitle_alta").text(`Editando Plan: ${plan_data.nombre}`);
                limpiarFormulario(formPlanAlta);
                $("#id_plan_form_alta").val(plan_data.id_plan); // Asigna el ID temporal
                $("#nombre_plan_form_alta").val(plan_data.nombre);
                $("#cobertura_plan_form_alta").val(plan_data.cobertura);
                $("#bonif_os_plan_form_alta").val(plan_data.bonificacion_os);
                $("#bonif_farmacia_plan_form_alta").val(plan_data.bonificacion_farmacia);
                $("#formContainerPlan_alta").collapse("show");
                break;
            case "btnEliminarPlanAlta":
                fila_plan_a_editar_alta.remove().draw();
                Toastify({ text: "Plan eliminado de la lista.", className: "info" }).showToast();
                break;
        }
    });

    $("#btnCancelarPlan_alta").on("click", function () {
        $("#formContainerPlan_alta").collapse("hide");
    });

    ClassValidaciones.validarFormulario(formPlanAlta, btnGuardarPlan_alta, function () {
        alta_mod_plan_alta();
    });

    function alta_mod_plan_alta() {
        const plan_data = {
            id_plan: $("#id_plan_form_alta").val(),
            convenio_id: $("#id_conv_alta").val(),
            nombre: $("#nombre_plan_form_alta").val(),
            cobertura: $("#cobertura_plan_form_alta").val() || 0,
            bonificacion_os: $("#bonif_os_plan_form_alta").val() || 0,
            bonificacion_farmacia: $("#bonif_farmacia_plan_form_alta").val() || 0,
        };

        const esNuevo = fila_plan_a_editar_alta === null;

        if (esNuevo) {
            datatable_planes_alta.DataTable().row.add(plan_data).draw();
            Toastify({ text: "Plan agregado a la lista.", className: "info" }).showToast();
        } else if (fila_plan_a_editar_alta) {
            fila_plan_a_editar_alta.data(plan_data).draw(false);
            Toastify({ text: "Plan modificado en la lista.", className: "info" }).showToast();
        }

        $("#formContainerPlan_alta").collapse("hide");
        limpiarFormulario(formPlanAlta);
        fila_plan_a_editar_alta = null;
    }

    // 5. --- Lógica para el guardado final del NUEVO CONVENIO ---
    ClassValidaciones.validarFormulario(formAltaConvenio, btnConfirmarAltaConvenio, function () {
        if (datatable_planes_alta.DataTable().rows().count() === 0) {
            Swal.fire("Atención", "Debe agregar al menos un plan al convenio.", "warning");
            return;
        }

        Swal.fire({
            title: "¿Desea crear el nuevo convenio?",
            text: "Se guardará el convenio con los planes asociados.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, crear",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                alta_convenio();
            }
        });
    });

    function alta_convenio() {
        const datos_convenio = {
            id_convenio: $("#id_conv_alta").val(),
            nombre: $("#id_nombre_convenio_alta").val(),
            razon_social: $("#id_razon_social_alta").val(),
            cuit: $("#id_cuit_alta").val(),
            cuenta_contable_activo: $("#id_cuenta_activo_alta").val() || null,
            cuenta_contable_pasivo: $("#id_cuenta_pasivo_alta").val() || null,
            tipo_cierre: $("#id_tipo_cierre_alta").val(),
            patente: $("#id_provincia_alta").val(),
            localidad_id: $("#id_localidad_alta").val(),
            codigo_postal: $("#id_codigo_postal_alta").val(),
            direccion: $("#id_direccion_alta").val(),
            telefono: $("#id_telefono_alta").val() || null,
            email: $("#id_email_alta").val(),
            sitio_web: $("#id_sitio_web_alta").val() || null,
        };

        const planes = datatable_planes_alta
            .DataTable()
            .rows()
            .data()
            .toArray()
            .map(function (plan) {
                return normalizar_datos_plan(plan);
            });

        const dataString = {
            backend: "nuevo_convenio",
            datos: datos_convenio,
            planes: planes,
        };

        $.ajax({
            type: "POST",
            url: "app/Controllers/Convenios/Convenios_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    Swal.fire(response.alert.title, response.alert.message, response.alert.icon).then(() => {
                        $("#modalConvenioAlta").modal("hide");
                        extraer_convenios(); // Refrescar la tabla principal
                    });
                } else {
                    Swal.fire("Error", response.message || "No se pudo crear el convenio.", "error");
                }
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            },
        });
    }

    // ===================================================================================
    // PADRÓN - PROVINCIAS Y LOCALIDADES
    // ===================================================================================

    function extraer_provincias() {
        let dataString = { backend: "provincias" };
        $.ajax({
            type: "POST",
            url: "app/Controllers/Padron/Padron_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    provincias_guardadas = response.data;
                    cargar_select_provincias($("#id_provincia_mod"), provincias_guardadas);
                }
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudieron cargar las provincias. Por favor, revisa tu conexión a internet.", "error");
            },
        });
    }

    function cargar_select_provincias(select_element, provincias) {
        select_element.empty().append('<option value="" disabled selected>Seleccione Provincia</option>');
        provincias.forEach((provincia) => {
            let option = `<option value="${provincia.patente}">${provincia.nombre}</option>`;
            select_element.append(option);
        });
    }

    function extraer_localidades(patente, select_localidades) {
        select_localidades.empty().append('<option value="">Cargando...</option>').prop("disabled", true);

        let dataString = {
            backend: "localidades",
            patente: patente,
        };

        $.ajax({
            type: "POST",
            url: "app/Controllers/Padron/Padron_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    cargar_select_localidades(select_localidades, response.data);
                }
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudieron cargar las localidades. Por favor, revisa tu conexión a internet.", "error");
                select_localidades.empty().append('<option value="">Error al cargar</option>');
            },
        });
    }

    function cargar_select_localidades(select_element, localidades) {
        select_element.empty().append('<option value="" disabled selected>Seleccione Localidad</option>');
        localidades.forEach((localidad) => {
            let option = `<option value="${localidad.id_localidad}">${localidad.nombre}</option>`;
            select_element.append(option);
        });
        select_element.prop("disabled", false);
    }

    // ===================================================================================
    // FUNCIONES AUXILIARES
    // ===================================================================================

    function cargar_y_seleccionar_localidades(patente_provincia, select_localidades, id_localidad_a_seleccionar) {
        select_localidades.empty().append('<option value="">Cargando...</option>').prop("disabled", true);

        let dataString = {
            backend: "localidades",
            patente: patente_provincia,
        };

        $.ajax({
            type: "POST",
            url: "app/Controllers/Padron/Padron_backend.php",
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    cargar_select_localidades(select_localidades, response.data);
                    select_localidades.val(id_localidad_a_seleccionar);
                }
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudieron cargar las localidades. Por favor, revisa tu conexión a internet.", "error");
                select_localidades.empty().append('<option value="">Error al cargar</option>');
            },
        });
    }

    function limpiarFormulario(from) {
        from[0].reset();
        from.removeClass("was-validated");
        from.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
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

    // ===================================================================================
    // PUNTO DE ENTRADA DE LA APLICACIÓN
    // ===================================================================================
    onInit();
});
