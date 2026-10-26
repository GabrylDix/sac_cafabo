const ClassValidaciones = window.Validaciones;
$(document).ready(function () {
    const datatableCuentasBancarias = $("#datatable_list_cuentas_bancarias");
    const datatable_movimientos_CtaBancarias = $("#datatable_movimientosFinancieros_ctaBancaria");
    const form_nuevaCtaBancaria = $("#form_nuevaCtaBancaria");
    const form_editarCtaBancaria= $("#form_editarCtaBancaria");
    const btnNuevaCuenta = $("#btnGuardarCtaBancaria");
    const btnEditarCuenta= $("#btnConfirmarEditarCtaBancaria");
    const selectCuentaContableNuevaCtaBancaria = $("#cuenta_contable_nuevaCtaBancaria");
    const selectCuentaContableEditarCtaBancaria = $("#cuenta_contable_editarCtaBancaria");
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
    let datosCuenta= [];
    let choicesCuentaContableNuevaCtaBancaria = null;
    let choicesCuentaContableEditarCtaBancaria = null;
    let timeoutsBusquedaCuentaContable = {};
    let configFecha =
    {
        dateFormat: "Y-m-d",
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],         
            }, 
            months: {
                shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Оct', 'Nov', 'Dic'],
                longhand: ['Enero', 'Febrero', 'Мarzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            }
        },
        altInput: true,              // Crea un input secundario visible más estético
        altFormat: "d/m/Y",          // El formato que ve el usuario (ej. 01/01/2026)
        disableMobile: "true",       // Evita que en celulares salga la rueda nativa que rompe el diseño
        animate: true
    }
    let pickerDesde, pickerHasta;

    pickerDesde = flatpickr("#fecha_desde_ctaBancaria", {
    ...configFecha,
        onChange: function(selectedDates, dateStr, instance) {
            // Al cambiar "Desde", bloqueamos las fechas anteriores en "Hasta"
            if (pickerHasta) {
                pickerHasta.set("minDate", dateStr);
            }
        }
    });
    pickerHasta = flatpickr("#fecha_hasta_ctaBancaria", {
    ...configFecha,
        onChange: function(selectedDates, dateStr, instance) {
            // Al cambiar "Hasta", bloqueamos las fechas posteriores en "Desde"
            if (pickerDesde) {
                pickerDesde.set("maxDate", dateStr);
            }
        }
    });
    if (pickerDesde.selectedDates[0]) {
        pickerHasta.set("minDate", pickerDesde.selectedDates[0]);
    }
    if (pickerHasta.selectedDates[0]) {
        pickerDesde.set("maxDate", pickerHasta.selectedDates[0]);
    }
    //$("#fecha_hasta_ctaBancaria").flatpickr(configFecha);
    extraer_ctas_bancarias_ajax();
    extraer_bancos_ajax();
    inicializar_choices_cuentas_contables();

    function extraer_ctas_bancarias_ajax() {
        let dataString = {'backend': 'extraer_cuentas_bancarias'};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Tesoreria/Cuentas_bancarias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    cargar_tabla_cuentas_bancarias(response.data);
                }else{
                    Swal.fire({
                        title: response.alert.title,
                        text: response.alert.message,
                        icon: response.alert.icon,
                        allowOutsideClick: false,
                        confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                        confirmButtonText: "Aceptar"
                    })
                }
            }
        });
    }

    function extraer_movimientos_bancarios_ajax(fechaDesde, fechaHasta) {
        let dataString = {'backend': 'extraer_movimientos', datos: {
            'id_cuenta': datosCuenta['id_cuenta'],
            'fecha_desde': fechaDesde,
            'fecha_hasta': fechaHasta
        }};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Tesoreria/Cuentas_bancarias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    cargar_tabla_movimientosFinancieros(response.data);
                }else{
                    Swal.fire({
                        title: response.alert.title,
                        text: response.alert.message,
                        icon: response.alert.icon,
                        allowOutsideClick: false,
                        confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                        confirmButtonText: "Aceptar"
                    })
                }
            }
        });
    }

    function cargar_tabla_cuentas_bancarias(cuentas_bancarias) {
        datatableCuentasBancarias.DataTable({
            destroy: true,
            data: cuentas_bancarias,
            columns: [
                {   title: "Banco",
                    data: "nombre_banco",
                    className: "text-left",
                },
                {   title: "Nro. Cuenta",
                    data: "numero_cuenta",
                    className: "text-left",
                },
                {   title: "Nombre ",
                    data: "nombre_cuenta",
                    className: "text-left",
                },
                {   title: "CBU/Alias",
                    data: null,
                    className: "text-left",
                    render: function (data) {
                        return `<div class="ubicacion-cell">
                            <strong>Alias: ${data.alias}</strong>
                            <small class="d-block text-muted"> CBU: ${data.cbu} </small>
                        </div>`;
                    }
                },
                {   title: "Carga",
                    data: null,
                    className: "text-left",
                    render: function (data) {
                        return `<div class="ubicacion-cell">
                            <strong>Usuario: ${data.usuario_creacion}</strong>
                            <small class="d-block text-muted"> Fecha: ${data.fecha_creacion} </small>
                        </div>`;
                    }
                },
                {   title: "Estado",
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        if (data.estado == 'A') {
                            return '<span class="sac-status-badge sac-status-active">Activo</span>';
                        } else {
                            return '<span class="sac-status-badge sac-status-inactive">Inactivo</span>';
                        }
                    },
                },
                {   title: "Acciones",
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        if (data.estado == 'A') {
                            return `<div class="sac-table-actions">
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_ctaBancaria" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver cuenta bancaria">
                                    <i class="ri-eye-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" id="btnEditar_ctaBancaria" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar cuenta bancaria">
                                    <i class="ri-edit-2-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnMovimientos_ctaBancaria" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Movimientos Financieros" aria-label="Ver movimientos financieros">
                                    <i class="ri-exchange-dollar-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" id="btnBaja_ctaBancaria" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Desactivar" aria-label="Desactivar cuenta bancaria">
                                    <i class="ri-close-circle-fill"></i>
                                </button>
                            </div>`;
                        } else {
                            return `<div class="sac-table-actions">
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_ctaBancaria" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver cuenta bancaria">
                                    <i class="ri-eye-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnMovimientos_ctaBancaria" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Movimientos Financieros" aria-label="Ver movimientos financieros">
                                    <i class="ri-exchange-dollar-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" id="btnAlta_ctaBancaria" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Activar" aria-label="Activar cuenta bancaria">
                                    <i class="ri-check-double-line"></i>
                                </button>
                            </div>`;
                        }
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Cuenta Bancaria...'
            },
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
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

    $("#datatable_list_cuentas_bancarias tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");
        if (row.hasClass("child")) {
            // Si es hija, apuntamos a la fila anterior (la fila padre real)
            row = row.prev();
        }
        datosCuenta = datatableCuentasBancarias.DataTable().row(row).data();

        switch (opt) {
            case "btnVer_ctaBancaria":
                extraer_datos_ctaBancaria_ajax(datosCuenta['id_cuenta']);
                break;
            case "btnEditar_ctaBancaria":
                cargar_modal_editarCtaBancaria(datosCuenta);
                break;
            case "btnMovimientos_ctaBancaria":
                extraer_movimientosFinancieros_ctaBancaria_ajax(datosCuenta['id_cuenta']);
                break;
            case "btnBaja_ctaBancaria":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas desactivar esta cuenta bancaria?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, desactivar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_ctaBancaria(datosCuenta['id_cuenta'], datosCuenta['estado']);
                    }
                });
                
                break;
            case "btnAlta_ctaBancaria":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas activar esta cuenta bancaria?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, activar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_ctaBancaria(datosCuenta['id_cuenta'], datosCuenta['estado']);
                    }
                });
                break;
        }
    });

    function cargar_tabla_movimientosFinancieros(movimientos){
        $("#div_datatable_movimientos").show();
        datatable_movimientos_CtaBancarias.DataTable({
            destroy: true,
            data: movimientos,
            dom: "<'row mb-3'<'col-sm-12 col-md-6 d-flex align-items-center justify-content-start'B><'col-sm-12 col-md-6 d-flex align-items-center justify-content-end'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row pt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<i class="bi bi-file-earmark-excel me-1"></i> Excel',
                    className: 'btn btn-outline-success',
                    title: 'Movimientos_Cuenta_' + datosCuenta.numero_cuenta, // Nombre del archivo
                    exportOptions: {
                        columns: ':visible' // Solo exporta las columnas que se están viendo
                    }
                },
                {
                    extend: 'pdfHtml5',
                    text: '<i class="bi bi-file-earmark-pdf me-1"></i> PDF',
                    className: 'btn btn-outline-danger ms-2',
                    title: 'Movimientos_Cuenta_' + datosCuenta.numero_cuenta, // Nombre del archivo
                    orientation: 'landscape', // Apaisado porque son 8 columnas
                    pageSize: 'A4',
                    exportOptions: {
                        columns: ':visible'
                    }
                }
            ],
            columns: [
                {   title: "Banco",
                    data: null,
                    className: "text-left",
                    render: function (data) {
                        return `<div class="ubicacion-cell">
                            <strong>Nro. Cuenta: ${datosCuenta.numero_cuenta}</strong>
                            <small class="d-block text-muted"> Nombre: ${datosCuenta.nombre_cuenta} </small>
                        </div>`;
                    }
                },
                {   title: "Fecha",
                    data: "fecha",
                    className: "text-center",
                },
                {   title: "Tipo de Transacción", 
                    data: "tipo",
                    className: "text-left",
                },
                {   title: "Origen", 
                    data: null,
                    className: "text-left",
                    render: function (data) {
                        return `<div class="ubicacion-cell">
                            <strong>Origen: ${data.origen}</strong>
                            <small class="d-block text-muted"> ID: ${data.id_origen} </small>
                        </div>`;
                    }
                },
                {   title: "Ingresa", 
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        if(data.tipo == 'INGRESO'){
                            return Formatos.formatoMoneda(data.importe || 0);
                        }else{
                            return Formatos.formatoMoneda(0);
                        }
                    }
                },
                {   title: "Egresa",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        if(data.tipo == 'EGRESO'){
                            return Formatos.formatoMoneda(data.importe || 0);
                        }else{
                            return Formatos.formatoMoneda(0);
                        }
                    }
                },
                {   title: "Saldo", 
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.saldo || 0);
                    }
                },
                {   title: "Descripción", 
                    data: "descripcion",
                    className: "text-left",
                }
            ],
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Movimiento Bancario...'
            },
            responsive: true,
            iDisplayLength: 10,
            lengthMenu: [
                [10, 20, 50, -1],
                [10, 20, 50, "Todos"],
            ],
        });
        
    }

    $("#btnNuevaCuentaBancaria").on("click", function (e) {
        abrir_modal_nuevaCuentaBancaria();
    });

    function abrir_modal_nuevaCuentaBancaria() {
        aplicarSoloNumeros("#cbu_nuevaCtaBancaria");
        form_nuevaCtaBancaria[0].reset();
        limpiarFormulario(form_nuevaCtaBancaria);
        resetear_cuenta_contable_nueva_cta_bancaria();
        $('#modalNuevaCuentaBancaria').modal("show");
    }
  
    function extraer_bancos_ajax(){
        let dataString = {'backend': 'extraer_bancos'};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Padron/Padron_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                cargar_select_bancos(response.data);
            }
        });
    }

    function cargar_select_bancos(bancos){
        let $selects = [
            $("#banco_nuevaCtaBancaria"),
            $("#banco_editarCtaBancaria")
            //$("#cod_prov_detalleFarmacia")
        ];
    
        $selects.forEach($select => {
            if ($select.length) { // Asegura que el selector existe en el DOM
                $select.empty();
                $select.append("<option value=''>-- Seleccione Banco --</option>");
                
                for (var i = 0; i < bancos.length; i++) {
                    $select.append(`<option value='${bancos[i]["id_banco"]}'>${bancos[i]["nombre"]}</option>`);
                }
            }
        });
    }

    function inicializar_choices_cuentas_contables() {
        if (typeof Choices === "undefined") {
            return;
        }

        choicesCuentaContableNuevaCtaBancaria = inicializar_choice_cuenta_contable_cta_bancaria(
            selectCuentaContableNuevaCtaBancaria,
            choicesCuentaContableNuevaCtaBancaria,
            "Seleccione cuenta contable",
        );
        choicesCuentaContableEditarCtaBancaria = inicializar_choice_cuenta_contable_cta_bancaria(
            selectCuentaContableEditarCtaBancaria,
            choicesCuentaContableEditarCtaBancaria,
            "Seleccione cuenta contable",
        );

        vincular_busqueda_cuenta_contable_cta_bancaria(
            selectCuentaContableNuevaCtaBancaria,
            "cuentaNuevaCtaBancaria",
            function () {
                return choicesCuentaContableNuevaCtaBancaria;
            },
        );
        vincular_busqueda_cuenta_contable_cta_bancaria(
            selectCuentaContableEditarCtaBancaria,
            "cuentaEditarCtaBancaria",
            function () {
                return choicesCuentaContableEditarCtaBancaria;
            },
        );
        vincular_seleccion_cuenta_contable_cta_bancaria(selectCuentaContableNuevaCtaBancaria);
        vincular_seleccion_cuenta_contable_cta_bancaria(selectCuentaContableEditarCtaBancaria);

        buscar_cuentas_contables_cta_bancaria("", selectCuentaContableNuevaCtaBancaria, choicesCuentaContableNuevaCtaBancaria);
        buscar_cuentas_contables_cta_bancaria("", selectCuentaContableEditarCtaBancaria, choicesCuentaContableEditarCtaBancaria);
    }

    function inicializar_choice_cuenta_contable_cta_bancaria(selectElement, instanciaActual, placeholderValue) {
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

    function vincular_busqueda_cuenta_contable_cta_bancaria(selectElement, timeoutKey, obtenerInstanciaChoices) {
        selectElement.off("search.choicesCuentaBancaria").on("search.choicesCuentaBancaria", function (e) {
            const termino = String(e?.detail?.value || "").trim();
            const timeoutActual = timeoutsBusquedaCuentaContable[timeoutKey] || null;

            clearTimeout(timeoutActual);

            timeoutsBusquedaCuentaContable[timeoutKey] = setTimeout(function () {
                const instanciaChoices = typeof obtenerInstanciaChoices === "function" ? obtenerInstanciaChoices() : null;
                buscar_cuentas_contables_cta_bancaria(termino, selectElement, instanciaChoices);
            }, 250);
        });
    }

    function vincular_seleccion_cuenta_contable_cta_bancaria(selectElement) {
        selectElement.off("change.choicesCuentaBancaria choice.choicesCuentaBancaria");
        selectElement.on("change.choicesCuentaBancaria choice.choicesCuentaBancaria", function () {
            actualizar_cuenta_contable_seleccionada_cta_bancaria(selectElement);
        });
    }

    function buscar_cuentas_contables_cta_bancaria(termino, selectElement, instanciaChoices) {
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
                cargar_select_cuentas_contables_cta_bancaria(selectElement, instanciaChoices, cuentasContables, selectElement.val());
            },
            error: function () {
                cargar_select_cuentas_contables_cta_bancaria(selectElement, instanciaChoices, [], "");
            },
        });
    }

    function cargar_select_cuentas_contables_cta_bancaria(selectElement, instanciaChoices, cuentasContables, valorSeleccionado = "") {
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
            actualizar_cuenta_contable_seleccionada_cta_bancaria(selectElement);
            return;
        }

        selectElement.empty().append('<option value="" selected>Seleccione una cuenta...</option>');

        cuentasParaOpciones.forEach(function (cuenta) {
            selectElement.append(
                `<option value="${cuenta.id_cuenta}">${cuenta.label || construir_descripcion_cuenta_contable(cuenta)}</option>`,
            );
        });

        selectElement.val(existeCuentaSeleccionada ? String(valorSeleccionado) : "");
        actualizar_cuenta_contable_seleccionada_cta_bancaria(selectElement);
    }

    function construir_descripcion_cuenta_contable(cuenta) {
        return [cuenta.codigo_cuenta, cuenta.nombre_cuenta].filter(Boolean).join(" - ");
    }

    function actualizar_cuenta_contable_seleccionada_cta_bancaria(selectElement) {
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

    function precargar_cuenta_contable_seleccionada_cta_bancaria(idCuenta, selectElement, instanciaChoices) {
        if (!idCuenta) {
            cargar_select_cuentas_contables_cta_bancaria(selectElement, instanciaChoices, [], "");
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
                    cargar_select_cuentas_contables_cta_bancaria(selectElement, instanciaChoices, [], "");
                    return;
                }

                selectElement.data("cuentaContableSeleccionada", cuenta);
                cargar_select_cuentas_contables_cta_bancaria(selectElement, instanciaChoices, [cuenta], idCuenta);
                buscar_cuentas_contables_cta_bancaria("", selectElement, instanciaChoices);
            },
            error: function () {
                cargar_select_cuentas_contables_cta_bancaria(selectElement, instanciaChoices, [], "");
            },
        });
    }

    function resetear_cuenta_contable_nueva_cta_bancaria() {
        cargar_select_cuentas_contables_cta_bancaria(selectCuentaContableNuevaCtaBancaria, choicesCuentaContableNuevaCtaBancaria, [], "");
        buscar_cuentas_contables_cta_bancaria("", selectCuentaContableNuevaCtaBancaria, choicesCuentaContableNuevaCtaBancaria);
    }

    function resetear_cuenta_contable_editar_cta_bancaria() {
        cargar_select_cuentas_contables_cta_bancaria(selectCuentaContableEditarCtaBancaria, choicesCuentaContableEditarCtaBancaria, [], "");
        buscar_cuentas_contables_cta_bancaria("", selectCuentaContableEditarCtaBancaria, choicesCuentaContableEditarCtaBancaria);
    }
    
    function extraer_datos_ctaBancaria_ajax(id_cuenta) {
        let dataString = {'backend': 'extraer_cuenta_bancaria','id_cuenta_bancaria':id_cuenta};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Tesoreria/Cuentas_bancarias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    cargar_modal_detalleCtaBancaria(response.data);
                }else{
                    Swal.fire({
                        title: response.alert.title,
                        text: response.alert.message,
                        icon: response.alert.icon,
                        allowOutsideClick: false,
                        confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                        confirmButtonText: "Aceptar"
                    })
                }
            }
        });
    }
    function extraer_movimientosFinancieros_ctaBancaria_ajax(id_cuenta) {
        let dataString = {'backend': 'extraer_cuenta_bancaria','id_cuenta_bancaria':id_cuenta};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Tesoreria/Cuentas_bancarias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    cargar_modal_movimientosFinancieros_CtaBancaria(response.data);
                }else{
                    Swal.fire({
                        title: response.alert.title,
                        text: response.alert.message,
                        icon: response.alert.icon,
                        allowOutsideClick: false,
                        confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                        confirmButtonText: "Aceptar"
                    })
                }
            }
        });
    }
    function cargar_modal_detalleCtaBancaria(cuentaBancaria) {
         // Cargar título en el header
        $("#nombreCtaBancaria_detalleCtaBancaria").text(cuentaBancaria.nombre_cuenta || "Banco Sin nombre");
        const badgeActivo = $("#badge_estado_detalleCtaBancaria");
        const estadoTexto = $("#estado_texto_detalleCtaBancaria");

        if (cuentaBancaria.estado == "A") {
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
                    .addClass("bg-muted bg-opacity-25")
                    .find("p")
                    .addClass("text-muted fst-italic");
            } else {
                elemento.text(valor);
                parent
                    .removeClass("bg-muted bg-opacity-25")
                    .addClass("bg-body-secondary border-black")
                    .find("p")
                    .removeClass("text-muted fst-italic")
                    .addClass("text-dark");
            }
        };
    
        // Información Principal
        actualizarCampo("#nombrebanco_detalleCtaBancaria", cuentaBancaria.nombre_banco);
        actualizarCampo("#nroCta_detalleCtaBancaria", cuentaBancaria.numero_cuenta);
        actualizarCampo("#cbuCta_detalleCtaBancaria", cuentaBancaria.cbu);
        actualizarCampo("#aliasCta_detalleCtaBancaria", cuentaBancaria.alias);
        actualizarCampo("#cuentaContable_detalleCtaBancaria", cuentaBancaria.cuenta_contable_label || cuentaBancaria.cuenta_contable);
        
        // Auditoria
        actualizarCampo("#usuario_creacion_detalleCtaBancaria", cuentaBancaria.usuario_creacion);
        actualizarCampo("#fecha_creacion_detalleCtaBancaria", cuentaBancaria.fecha_creacion);
    
        $('#modalDetalleCtaBancaria').modal("show");
    }
    function cargar_modal_movimientosFinancieros_CtaBancaria(cuentaBancaria) {
         // Cargar título en el header
        $("#subtituloCuenta_movimientos").text(`Cuenta ${cuentaBancaria.numero_cuenta} - ${cuentaBancaria.nombre_banco}`);
        //$("#saldoMonto_ctaBancaria").text(`$${cuentaBancaria.saldo_actual}`);
        animarSaldoCtaBancaria(cuentaBancaria.saldo_actual);
        $("#nroCuentaInput_ctaBancaria").text(cuentaBancaria.numero_cuenta);
        $("#cbuInput_ctaBancaria").val(cuentaBancaria.cbu);
        $("#aliasInput_ctaBancaria").val(cuentaBancaria.alias);
        $("#descripcionInput_ctaBancaria").text(cuentaBancaria.nombre_banco);
        
        $('#movimientosFinancierosModal').modal("show");
    }
    
    function cargar_modal_editarCtaBancaria(cuentaBancaria){
        const badgeActivo = $("#badge_estado_editarCtaBancaria");
        const estadoTexto = $("#estado_texto_editarCtaBancaria");
        //$("#nombreCtaBancaria_editarCtaBancaria").text(cuentaBancaria.nombre_cuenta || "Banco Sin nombre");
        if (cuentaBancaria.estado == "A") {
            badgeActivo.removeClass("bg-danger border-danger text-danger").addClass("bg-success border-success text-white");
            badgeActivo.find("i").removeClass("bi-x-circle").addClass("bi-check-circle");
            estadoTexto.text("Activo");
        } else {
            badgeActivo.removeClass("bg-success border-success text-white").addClass("bg-danger border-danger text-danger");
            badgeActivo.find("i").removeClass("bi-check-circle").addClass("bi-x-circle");
            estadoTexto.text("Inactivo");
        }
        aplicarSoloNumeros("#cbuCta_editarCtaBancaria");
        resetear_cuenta_contable_editar_cta_bancaria();
        $("#banco_editarCtaBancaria").val(cuentaBancaria.banco);
        $("#nombreCta_editarCtaBancaria").val(cuentaBancaria.nombre_cuenta);
        $("#nroCta_editarCtaBancaria").val(cuentaBancaria.numero_cuenta);
        $("#cbuCta_editarCtaBancaria").val(cuentaBancaria.cbu);
        $("#aliasCta_editarCtaBancaria").val(cuentaBancaria.alias);
        precargar_cuenta_contable_seleccionada_cta_bancaria(
            cuentaBancaria.cuenta_contable,
            selectCuentaContableEditarCtaBancaria,
            choicesCuentaContableEditarCtaBancaria,
        );
        $('#modalEditarCtaBancaria').modal("show");
    }
    //#### INICIO: VALIDACIONES FORMULARIOS #####
    ClassValidaciones.validarFormulario(form_nuevaCtaBancaria, btnNuevaCuenta, function () {
        Swal.fire({
            title: "¿Desea dar de alta esta Cuenta Bancaria?",
            text: "Se guardará la informacion proporcionada.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                nueva_cuenta_bancaria();
            }
        });
    });
    ClassValidaciones.validarFormulario(form_editarCtaBancaria, btnEditarCuenta, function () {
        Swal.fire({
            title: "¿Desea modificar los datos de la cuenta bancaria?",
            text: "Se actualizara la informacion.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                editar_cuenta_bancaria();
            }
        });
    });

    function nueva_cuenta_bancaria() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            banco: $("#banco_nuevaCtaBancaria").val(),
            numero_cuenta: $("#nroCuenta_nuevaCtaBancaria").val(),
            nombre_cuenta: $('#nombreCuenta_nuevaCtaBancaria').val(),
            cbu: $("#cbu_nuevaCtaBancaria").val(),
            alias: $("#alias_nuevaCtaBancaria").val(),
            cuenta_contable: $("#cuenta_contable_nuevaCtaBancaria").val() || null,
        }
        $("#modalNuevaCuentaBancaria").modal('hide');
        nueva_cuenta_bancaria_ajax(dataString);
    }

    function nueva_cuenta_bancaria_ajax(dataCuenta){
        let dataString = {'backend': 'nueva_cuenta_bancaria', 'datos': dataCuenta};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Tesoreria/Cuentas_bancarias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                Swal.fire({
                    title: response.alert.title,
                    text: response.alert.message,
                    icon: response.alert.icon,
                    allowOutsideClick: false,
                    confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                    confirmButtonText: "Aceptar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        if(response.success){
                           location.reload();
                        }else{
                           $("#modalNuevaCuentaBancaria").modal('show');
                        }
                    }
                });
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }
    function editar_cuenta_bancaria() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            id_cuenta: datosCuenta['id_cuenta'],
            banco: $("#banco_editarCtaBancaria").val(),
            numero_cuenta: $("#nroCta_editarCtaBancaria").val(),
            nombre_cuenta: $('#nombreCta_editarCtaBancaria').val(),
            cbu: $("#cbuCta_editarCtaBancaria").val(),
            alias: $("#aliasCta_editarCtaBancaria").val(),
            cuenta_contable: $("#cuenta_contable_editarCtaBancaria").val() || null,
        }

        $("#modalEditarCtaBancaria").modal('hide');
        editar_cuenta_bancaria_ajax(dataString);
    }
    function editar_cuenta_bancaria_ajax(dataCuenta){
        let dataString = {'backend': 'modificar_cuenta_bancaria', 'datos': dataCuenta};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Tesoreria/Cuentas_bancarias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                Swal.fire({
                    title: response.alert.title,
                    text: response.alert.message,
                    icon: response.alert.icon,
                    allowOutsideClick: false,
                    confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                    confirmButtonText: "Aceptar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        if(response.success){
                           location.reload();
                        }else{
                           $("#modalEditarCtaBancaria").modal('show');
                        }
                    }
                });      
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }
    function cambiar_estado_ctaBancaria(id_cuenta, estado){
        let dataString= {backend: "actualizar_estado",
            datos: {'id_cuenta_bancaria': id_cuenta, 'estado': estado}
        }
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Tesoreria/Cuentas_bancarias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                Swal.fire({
                    title: response.alert.title,
                    text: response.alert.message,
                    icon: response.alert.icon,
                    allowOutsideClick: false,
                    confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                    confirmButtonText: "Aceptar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        if(response.success){
                           location.reload();
                        }
                    }
                });
            }
        });
    }
    //#### FUNCIONES AUXILIARES #####
    function limpiarFormulario(from) {
        from[0].reset();
        from.removeClass("was-validated");
        // Remover clases de validación de Bootstrap de todos los campos
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
    }
    function copyToClipboard(text, button) {
        // Intentamos copiar el texto al portapapeles
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = button.innerHTML; 
            //Reemplazamos el HTML por el ícono de "Check" de Bootstrap 5
            button.innerHTML = '<i class="bi bi-check-lg"></i> Copiado'; 
            //Le agregamos el color verde de Bootstrap para indicar éxito
            button.classList.add('text-success');
            //Esperamos 2 segundos y lo regresamos a la normalidad
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('text-success');
            }, 2000);
            
        }).catch(err => {
            console.error('Error al copiar al portapapeles: ', err);
        });
    }
    function animarSaldoCtaBancaria(montoFinal) {
        const elemento = document.getElementById("saldoMonto_ctaBancaria");
        
        if (!elemento) return; 

        let montoActual = 0;
        // Dividimos en 60 pasos para que la animación dure más o menos 1 segundo
        let incremento = montoFinal / 60; 

        function actualizar() {
            montoActual += incremento;

            if (montoActual < montoFinal) {
                // Formateamos como moneda de Argentina (puntos para miles, comas para decimales)
                elemento.innerText = Formatos.formatoMoneda(montoActual || 0);
                
                // requestAnimationFrame es más suave
                requestAnimationFrame(actualizar); 
            } else {
                // Nos aseguramos de que el número final sea exacto y no quede con decimales raros por la división
                elemento.innerText = Formatos.formatoMoneda(montoFinal || 0);
            }
        }
        // Iniciamos la animación
        actualizar();
    }
    $('#copyCbu_ctaBancaria').on('click', function() {
        let cbu = $("#cbuInput_ctaBancaria").val().replace(/[^0-9\-\/]/g, '');
        copyToClipboard(cbu, this);
    });
    $('#copyAlias_ctaBancaria').on('click', function() {
        let alias = $("#aliasInput_ctaBancaria").val();
        copyToClipboard(alias, this);
    });
    //Valores que permite el input nroCuenta: números, guiones y diagonales
    $('#nroCuenta_nuevaCtaBancaria').on('input', function() {
        let valorLimpio = $(this).val().replace(/[^0-9\-\/]/g, '');
        $(this).val(valorLimpio);
    });
    $('#nroCta_editarCtaBancaria').on('input', function() {
        let valorLimpio = $(this).val().replace(/[^0-9\-\/]/g, '');
        $(this).val(valorLimpio);
    });
    $('#btnFiltrar_movimientos_ctaBancaria').on('click', function() {
        let fechaDesde = $("#fecha_desde_ctaBancaria").val();
        let fechaHasta = $("#fecha_hasta_ctaBancaria").val();
        extraer_movimientos_bancarios_ajax(fechaDesde, fechaHasta);
    });
    
});
