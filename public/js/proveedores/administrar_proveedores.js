const ClassValidaciones = window.Validaciones;
$(document).ready(function () {
    const datatableProveedores = $("#datatable_list_proveedores");
    const form_nuevoProveedor = $("#form_nuevoProveedor");
    const form_editarProveedor = $("#form_editarProveedor");
    const btnNuevoProveedor = $("#btnGuardarProveedor");
    const btnEditarProveedor = $("#btnConfirmarEditarProveedor");
    const selectCuentaContableNuevoProveedor = $("#cuenta_contable_nuevoProveedor");
    const selectCuentaContableEditarProveedor = $("#cuenta_contable_editarProveedor");

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

    let choicesCuentaContableNuevoProveedor = null;
    let choicesCuentaContableEditarProveedor = null;
    let timeoutsBusquedaCuentaContable = {};
    //const btnConfirmarEditarProveedor = $("#btnConfirmarEditarProveedor");
    extraer_proveedores_ajax();
    extraer_provincias_ajax();
    extraer_condicIVA_ajax();
    inicializar_choices_cuentas_contables();

    function extraer_provincias_ajax(){
        let dataString = {'backend': 'provincias'};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Padron/Padron_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                cargar_select_provincia(response.data);
            }
        });
    }
    
    function cargar_select_provincia(provincias){
        let $selects = [
            $("#cod_prov_nuevoProveedor"),
            $("#cod_prov_editarProveedor")
            //$("#cod_prov_detalleFarmacia")
        ];
    
        $selects.forEach($select => {
            if ($select.length) { // Asegura que el selector existe en el DOM
                $select.empty();
                $select.append("<option value=''>-- Seleccione Provincia --</option>");
                
                for (var i = 0; i < provincias.length; i++) {
                    $select.append(`<option value='${provincias[i]["patente"]}'>${provincias[i]["nombre"]}</option>`);
                }
            }
        });
    }
    
    function extraer_localidad_ajax(cod_patente,callback){
        let dataString = {'backend': 'localidades', 'patente': cod_patente};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Padron/Padron_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                cargar_select_localidad(response.data);
                if (typeof callback === 'function') {
                    callback(); 
                }
            }
        });
    }
    
    function cargar_select_localidad(localidades){
        let $selects = [
            $("#cod_localidad_nuevoProveedor"),
            $("#cod_localidad_editarProveedor")
            //$("#cod_localidad_detalleFarmacia")
        ];
    
        $selects.forEach($select => {

            if ($select.length) { // Asegura que el selector existe en el DOM
                $select.empty();
                $select.append("<option value=''>-- Seleccione Localidad --</option>");
                
                for (var i = 0; i < localidades.length; i++) {
                    $select.append(`<option value='${localidades[i]["id_localidad"]}'>${localidades[i]["nombre"]}</option>`);
                }
            }
        });
    }
    
    function extraer_condicIVA_ajax(){
        let dataString = {'backend': 'condiciones_iva'};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Padron/Padron_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                cargar_select_condicIVA(response.data);
            }
        });
    }
    
    function cargar_select_condicIVA(condicionesIVA){
        let $selects = [
            $("#codicionIva_nuevoProveedor"),
            $("#codicionIva_editarProveedor")
            //$("#cod_localidad_detalleFarmacia")
        ];
    
        $selects.forEach($select => {

            if ($select.length) { // Asegura que el selector existe en el DOM
                $select.empty();
                $select.append("<option value=''>-- Seleccione Condición IVA --</option>");
                
                for (var i = 0; i < condicionesIVA.length; i++) {
                    $select.append(`<option value='${condicionesIVA[i]["id"]}'>${condicionesIVA[i]["descripcion"]}</option>`);
                }
            }
        });
    }

    function inicializar_choices_cuentas_contables() {
        if (typeof Choices === "undefined") {
            return;
        }

        choicesCuentaContableNuevoProveedor = inicializar_choice_cuenta_contable_proveedor(
            selectCuentaContableNuevoProveedor,
            choicesCuentaContableNuevoProveedor,
            "Seleccione cuenta contable",
        );
        choicesCuentaContableEditarProveedor = inicializar_choice_cuenta_contable_proveedor(
            selectCuentaContableEditarProveedor,
            choicesCuentaContableEditarProveedor,
            "Seleccione cuenta contable",
        );

        vincular_busqueda_cuenta_contable_proveedor(
            selectCuentaContableNuevoProveedor,
            "cuentaNuevoProveedor",
            function () {
                return choicesCuentaContableNuevoProveedor;
            },
        );
        vincular_busqueda_cuenta_contable_proveedor(
            selectCuentaContableEditarProveedor,
            "cuentaEditarProveedor",
            function () {
                return choicesCuentaContableEditarProveedor;
            },
        );
        vincular_seleccion_cuenta_contable_proveedor(selectCuentaContableNuevoProveedor);
        vincular_seleccion_cuenta_contable_proveedor(selectCuentaContableEditarProveedor);

        buscar_cuentas_contables_proveedor("", selectCuentaContableNuevoProveedor, choicesCuentaContableNuevoProveedor);
        buscar_cuentas_contables_proveedor("", selectCuentaContableEditarProveedor, choicesCuentaContableEditarProveedor);
    }

    function inicializar_choice_cuenta_contable_proveedor(selectElement, instanciaActual, placeholderValue) {
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

    function vincular_busqueda_cuenta_contable_proveedor(selectElement, timeoutKey, obtenerInstanciaChoices) {
        selectElement.off("search.choicesCuentaProveedor").on("search.choicesCuentaProveedor", function (e) {
            const termino = String(e?.detail?.value || "").trim();
            const timeoutActual = timeoutsBusquedaCuentaContable[timeoutKey] || null;

            clearTimeout(timeoutActual);

            timeoutsBusquedaCuentaContable[timeoutKey] = setTimeout(function () {
                const instanciaChoices = typeof obtenerInstanciaChoices === "function" ? obtenerInstanciaChoices() : null;
                buscar_cuentas_contables_proveedor(termino, selectElement, instanciaChoices);
            }, 250);
        });
    }

    function vincular_seleccion_cuenta_contable_proveedor(selectElement) {
        selectElement.off("change.choicesCuentaProveedor choice.choicesCuentaProveedor");
        selectElement.on("change.choicesCuentaProveedor choice.choicesCuentaProveedor", function () {
            actualizar_cuenta_contable_seleccionada_proveedor(selectElement);
        });
    }

    function buscar_cuentas_contables_proveedor(termino, selectElement, instanciaChoices) {
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
                cargar_select_cuentas_contables_proveedor(selectElement, instanciaChoices, cuentasContables, selectElement.val());
            },
            error: function () {
                cargar_select_cuentas_contables_proveedor(selectElement, instanciaChoices, [], "");
            },
        });
    }

    function cargar_select_cuentas_contables_proveedor(selectElement, instanciaChoices, cuentasContables, valorSeleccionado = "") {
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
            actualizar_cuenta_contable_seleccionada_proveedor(selectElement);
            return;
        }

        selectElement.empty().append('<option value="" selected>Seleccione una cuenta...</option>');

        cuentasParaOpciones.forEach(function (cuenta) {
            selectElement.append(
                `<option value="${cuenta.id_cuenta}">${cuenta.label || construir_descripcion_cuenta_contable(cuenta)}</option>`,
            );
        });

        selectElement.val(existeCuentaSeleccionada ? String(valorSeleccionado) : "");
        actualizar_cuenta_contable_seleccionada_proveedor(selectElement);
    }

    function construir_descripcion_cuenta_contable(cuenta) {
        return [cuenta.codigo_cuenta, cuenta.nombre_cuenta].filter(Boolean).join(" - ");
    }

    function actualizar_cuenta_contable_seleccionada_proveedor(selectElement) {
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

    function precargar_cuenta_contable_seleccionada_proveedor(idCuenta, selectElement, instanciaChoices) {
        if (!idCuenta) {
            cargar_select_cuentas_contables_proveedor(selectElement, instanciaChoices, [], "");
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
                    cargar_select_cuentas_contables_proveedor(selectElement, instanciaChoices, [], "");
                    return;
                }

                selectElement.data("cuentaContableSeleccionada", cuenta);
                cargar_select_cuentas_contables_proveedor(selectElement, instanciaChoices, [cuenta], idCuenta);
                buscar_cuentas_contables_proveedor("", selectElement, instanciaChoices);
            },
            error: function () {
                cargar_select_cuentas_contables_proveedor(selectElement, instanciaChoices, [], "");
            },
        });
    }

    function resetear_cuenta_contable_nuevo_proveedor() {
        cargar_select_cuentas_contables_proveedor(selectCuentaContableNuevoProveedor, choicesCuentaContableNuevoProveedor, [], "");
        buscar_cuentas_contables_proveedor("", selectCuentaContableNuevoProveedor, choicesCuentaContableNuevoProveedor);
    }

    function resetear_cuenta_contable_editar_proveedor() {
        cargar_select_cuentas_contables_proveedor(selectCuentaContableEditarProveedor, choicesCuentaContableEditarProveedor, [], "");
        buscar_cuentas_contables_proveedor("", selectCuentaContableEditarProveedor, choicesCuentaContableEditarProveedor);
    }
    
    function extraer_proveedores_ajax() {
        let dataString = {'backend': 'extraer_proveedores'};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Proveedores/Proveedores_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    cargar_tabla_proveedores(response.data);
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
    
    function extraer_datos_proveedor_ajax(id_proveedor) {
        let dataString = {'backend': 'extraer_proveedor','id_proveedor':id_proveedor};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Proveedores/Proveedores_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    cargar_modal_detalleProveedor(response.data);
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

    function cargar_tabla_proveedores(proveedores) {
        datatableProveedores.DataTable({
            destroy: true,
            data: proveedores,
            columns: [
                {   title: "ID",
                    data: "id_proveedor",
                    className: "text-start align-middle",
                },
                {   title: "Cuit",
                    data: "cuit",
                    className: "text-start align-middle",
                },
                {   title: "Razón Social",
                    data: "razon_social",
                    className: "text-left",
                },
                {   title: "Nombre",
                    data: "nombre_fantasia",
                    className: "text-left",
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
                {   title: "Fecha Carga",
                    data: "fecha_creacion",
                    className: "text-center align-middle",
                },
                {   title: "Acciones",
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        if (data.estado == 'A') {
                            return `<div class="sac-table-actions">
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_proveedor" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver proveedor">
                                    <i class="ri-eye-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" id="btnEditar_proveedor" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar proveedor">
                                    <i class="ri-edit-2-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" id="btnBaja_proveedor" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Desactivar" aria-label="Desactivar proveedor">
                                    <i class="ri-close-circle-fill"></i>
                                </button>
                            </div>`;
                        } else {
                            return `<div class="sac-table-actions">
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_proveedor" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver proveedor">
                                    <i class="ri-eye-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" id="btnAlta_proveedor" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Activar" aria-label="Activar proveedor">
                                    <i class="ri-check-double-line"></i>
                                </button>
                            </div>`;
                        }
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Proveedor...'
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

    $("#datatable_list_proveedores tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");
        let proveedor = datatableProveedores.DataTable().row(row).data();

        switch (opt) {
            case "btnVer_proveedor":
                extraer_datos_proveedor_ajax(proveedor['id_proveedor']);
                break;
            case "btnEditar_proveedor":
                cargar_modal_editarProveedor(proveedor);
                break;
            case "btnBaja_proveedor":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas desactivar este proveedor?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, desactivar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_proveedor(proveedor['id_proveedor'], proveedor['estado']);
                    }
                });
                
                break;
            case "btnAlta_proveedor":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas activar este proveedor?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, activar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_proveedor(proveedor['id_proveedor'], proveedor['estado']);
                    }
                });
                break;
        }
    });
    
    function abrir_modal_nuevoProveedor() {
        aplicarSoloNumeros("#cuit_nuevoProveedor");
        aplicarSoloNumeros("#codPostal_nuevoProveedor");
        aplicarSoloNumeros("#telf_nuevoProveedor");
        aplicarSoloNumeros("#cbu_nuevoProveedor");
        aplicarSoloNumeros("#cvu_nuevoProveedor");
        // Limpiar formulario y variables de estado
        form_nuevoProveedor[0].reset();
        limpiarFormulario(form_nuevoProveedor);
        resetear_cuenta_contable_nuevo_proveedor();

        //cargar_select_provincias($("#id_provincia_alta"), provincias_guardadas);
        // Mostrar el modal
        $('#modalNuevoProveedor').modal("show");
    }
    
    function nuevo_proveedor() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            razon_social: $("#razonSocial_nuevoProveedor").val(),
            nombre_fantasia: $("#nombreFantasia_nuevoProveedor").val(),
            cuit: $('#cuit_nuevoProveedor').val(),
            condicion_iva: $("#codicionIva_nuevoProveedor").val(),
            cuenta_contable: $("#cuenta_contable_nuevoProveedor").val() || null,
            provincia: $("#cod_prov_nuevoProveedor").val(),
            localidad: $("#cod_localidad_nuevoProveedor").val(),
            codigo_postal: $("#codPostal_nuevoProveedor").val(),
            telefono: $("#telf_nuevoProveedor").val(),
            email: $("#email_nuevoProveedor").val(),
            direccion: $("#direccion_nuevoProveedor").val()
        }
        // CAMPOS NO OBLIGATORIOS (Si están vacíos, se asigna null)
        dataString.cbu = $("#cbu_nuevoProveedor").val().trim() || null;
        dataString.alias_cbu = $("#aliascbu_nuevoProveedor").val().trim() || null;
        dataString.cvu = $("#cvu_nuevoProveedor").val().trim() || null;
        dataString.alias_cvu = $("#aliascvu_nuevoProveedor").val().trim() || null;
        dataString.observaciones = $("#observ_nuevoProveedor").val().trim() || null;

        $("#modalNuevoProveedor").modal('hide');
        nuevo_proveedor_ajax(dataString);
    }
    
    function editar_proveedor() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            id_proveedor: $("#id_proveedor_editarProveedor").val(),
            razon_social: $("#razonSocial_editarProveedor").val(),
            nombre_fantasia: $("#nombreFantasia_editarProveedor").val(),
            cuit: $('#cuit_editarProveedor').val(),
            condicion_iva: $("#codicionIva_editarProveedor").val(),
            cuenta_contable: $("#cuenta_contable_editarProveedor").val() || null,
            provincia: $("#cod_prov_editarProveedor").val(),
            localidad: $("#cod_localidad_editarProveedor").val(),
            codigo_postal: $("#codPostal_editarProveedor").val(),
            telefono: $("#telf_editarProveedor").val(),
            email: $("#email_editarProveedor").val(),
            direccion: $("#direccion_editarProveedor").val()
        }
        //CAMPOS NO OBLIGATORIOS
        dataString.cbu = $("#cbu_editarProveedor").val().trim() || null;
        dataString.alias_cbu = $("#aliascbu_editarProveedor").val().trim() || null;
        dataString.cvu = $("#cvu_editarProveedor").val().trim() || null;
        dataString.alias_cvu = $("#aliascvu_editarProveedor").val().trim() || null;
        dataString.observaciones= $("#observ_editarProveedor").val().trim() || null;

        $("#modalEditarProveedor").modal('hide');
        editar_proveedor_ajax(dataString);
    }
    
    function nuevo_proveedor_ajax(dataProveedor){
        let dataString = {'backend': 'nuevo_proveedor', 'datos': dataProveedor};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Proveedores/Proveedores_backend.php',
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
                           $("#modalNuevoProveedor").modal('show');
                        }
                    }
                });
                
                
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }
    
    function editar_proveedor_ajax(dataProveedor){
        let dataString = {'backend': 'modificar_proveedor', 'datos': dataProveedor};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Proveedores/Proveedores_backend.php',
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
                           $("#modalEditarProveedor").modal('show');
                        }
                    }
                });
                
                
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }
    
    $("#btnNuevoProveedor").on("click", function (e) {
        abrir_modal_nuevoProveedor();
    });
    
    $("#cod_prov_nuevoProveedor").on("change", function (e) {
        var cod_prov = $(this).val();
        
        if(cod_prov === "" || cod_prov === null){
            $("#cod_localidad_nuevoProveedor").val("");
            $("#cod_localidad_nuevoProveedor").prop('disabled',true);   
        }else{
            extraer_localidad_ajax(cod_prov);
            $('#cod_localidad_nuevoProveedor').prop('disabled', false);
        }
    });
    
    function cargar_modal_editarProveedor(proveedor){
        const badgeActivo = $("#badge_estado_editarProveedor");
        const estadoTexto = $("#estado_texto_editarProveedor");

        if (proveedor.estado == "A") {
            badgeActivo.removeClass("bg-danger border-danger text-danger").addClass("bg-success border-success text-success");
            badgeActivo.find("i").removeClass("bi-x-circle").addClass("bi-check-circle");
            estadoTexto.text("Activo");
        } else {
            badgeActivo.removeClass("bg-success border-success text-success").addClass("bg-danger border-danger text-danger");
            badgeActivo.find("i").removeClass("bi-check-circle").addClass("bi-x-circle");
            estadoTexto.text("Inactivo");
        }
        aplicarSoloNumeros("#cuit_editarProveedor");
        aplicarSoloNumeros("#codPostal_editarProveedor");
        aplicarSoloNumeros("#telf_editarProveedor");
        aplicarSoloNumeros("#cbu_editarProveedor");
        aplicarSoloNumeros("#cvu_editarProveedor");
        resetear_cuenta_contable_editar_proveedor();
        //extraer_condicIVA_ajax();
        //CAMPOS OBLIGATORIOS
        $("#id_proveedor_editarProveedor").val(proveedor.id_proveedor);
        $("#razonSocial_editarProveedor").val(proveedor.razon_social);
        $("#nombreFantasia_editarProveedor").val(proveedor.nombre_fantasia);
        $('#cuit_editarProveedor').val(proveedor.cuit);
        $("#codicionIva_editarProveedor").val(proveedor.condicion_iva);
        $("#cod_prov_editarProveedor").val(proveedor.provincia);
        $("#codPostal_editarProveedor").val(proveedor.codigo_postal);
        $("#cbu_editarProveedor").val(proveedor.cbu || "");
        $("#aliascbu_editarProveedor").val(proveedor.alias_cbu || "");
        $("#cvu_editarProveedor").val(proveedor.cvu || "");
        $("#aliascvu_editarProveedor").val(proveedor.alias_cvu || "");
        $("#telf_editarProveedor").val(proveedor.telefono);
        $("#email_editarProveedor").val(proveedor.email);
        $("#direccion_editarProveedor").val(proveedor.direccion);
        $("#observ_editarProveedor").val(proveedor.observaciones);
        precargar_cuenta_contable_seleccionada_proveedor(
            proveedor.cuenta_contable,
            selectCuentaContableEditarProveedor,
            choicesCuentaContableEditarProveedor,
        );
        // LLAMADA ASÍNCRONA CON CALLBACK:
        extraer_localidad_ajax(proveedor.provincia, function() {
            // ESTE CÓDIGO SE EJECUTA DESPUÉS de que las localidades estén cargadas
            $("#cod_localidad_editarProveedor").val(proveedor.localidad);
            $("#cod_localidad_editarProveedor").attr("disabled", false);
        });
        $("#modalEditarProveedor").modal("show");
    }

    function cargar_modal_detalleProveedor(proveedor){
         // Cargar título en el header
        $("#nombreProveedor_detalleProveedor").text(proveedor.razon_social || "Proveedor Sin nombre");
        const badgeActivo = $("#badge_estado_detalleProveedor");
        const estadoTexto = $("#estado_texto_detalleProveedor");

        if (proveedor.estado == "A") {
            badgeActivo.removeClass("bg-danger border-danger text-danger").addClass("bg-success border-success text-success");
            badgeActivo.find("i").removeClass("bi-x-circle").addClass("bi-check-circle");
            estadoTexto.text("Activo");
        } else {
            badgeActivo.removeClass("bg-success border-success text-success").addClass("bg-danger border-danger text-danger");
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
        actualizarCampo("#nombreFantasia_detalleProveedor", proveedor.nombre_fantasia);
        actualizarCampo("#cuit_detalleProveedor", proveedor.cuit);
        actualizarCampo("#codicionIva_detalleProveedor", proveedor.nombre_categoria_iva);
        actualizarCampo("#cuentaContable_detalleProveedor", proveedor.cuenta_contable_label || proveedor.cuenta_contable);
        
        // Ubicación
        actualizarCampo("#cod_prov_detalleProveedor", proveedor.nombre_provincia);
        actualizarCampo("#cod_localidad_detalleProveedor", proveedor.nombre_localidad);
        actualizarCampo("#codPostal_detalleProveedor", proveedor.codigo_postal);
        actualizarCampo("#direccion_detalleProveedor", proveedor.direccion);
        actualizarCampo("#observ_detalleProveedor", proveedor.observaciones);

        // Bancos
        actualizarCampo("#cbu_detalleProveedor", proveedor.cbu);
        actualizarCampo("#aliascbu_detalleProveedor", proveedor.alias_cbu);
        actualizarCampo("#cvu_detalleProveedor", proveedor.cvu);
        actualizarCampo("#aliascvu_detalleProveedor", proveedor.alias_cvu);
        
        // Contacto
        actualizarCampo("#telf_detalleProveedor", proveedor.telefono);
        actualizarCampo("#email_detalleProveedor", proveedor.email);
    
        $('#modalDetalleProveedor').modal("show");
    }
    
    function cambiar_estado_proveedor(id_proveedor, estado){
        let dataString= {backend: "actualizar_estado",
            datos: {'id_proveedor': id_proveedor, 'estado': estado}
        }
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Proveedores/Proveedores_backend.php',
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
    //#### INICIO: VALIDACIONES FORMULARIOS #####
    ClassValidaciones.validarFormulario(form_nuevoProveedor, btnNuevoProveedor, function () {
        Swal.fire({
            title: "¿Desea dar de alta este proveedor?",
            text: "Se guardará la informacion proporcionada.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                nuevo_proveedor();
            }
        });
    });
    
    ClassValidaciones.validarFormulario(form_editarProveedor, btnEditarProveedor, function () {
        Swal.fire({
            title: "¿Desea modificar los datos del proveedor?",
            text: "Se actualizara la informacion.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                editar_proveedor();
            }
        });
    });
});
