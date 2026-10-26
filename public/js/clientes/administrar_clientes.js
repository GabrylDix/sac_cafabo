const ClassValidaciones = window.Validaciones;
$(document).ready(function () {
    
    const datatableClientes = $("#datatable_list_clientes");
    const form_nuevoCliente = $("#form_nuevoCliente");
    const form_editarCliente = $("#form_editarCliente");
    const btnNuevoCliente = $("#btnGuardarCliente");
    const btnEditarCliente= $("#btnConfirmarEditarCliente");
    const selectCuentaContableNuevoCliente = $("#cuenta_contable_nuevoCliente");
    const selectCuentaContableEditarCliente = $("#cuenta_contable_editarCliente");
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
    let datosCliente= [];
    let choicesCuentaContableNuevoCliente = null;
    let choicesCuentaContableEditarCliente = null;
    let timeoutsBusquedaCuentaContable = {};
    extraer_clientes_ajax();
    extraer_provincias_ajax();
    inicializar_choices_cuentas_contables();

    function extraer_clientes_ajax() {
        let dataString = {'backend': 'extraer_clientes'};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Clientes/Clientes_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    cargar_tabla_clientes(response.data);
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

    function cargar_tabla_clientes(clientes) {
        console.log(clientes);
        datatableClientes.DataTable({
            destroy: true,
            data: clientes,
            columns: [
                {   title: "ID",
                    data: "id_cliente",
                    className: "text-start align-middle",
                },
                {   title: "Cuit",
                    data: "cuit",
                    className: "text-start align-middle",
                    render: render_dato_cliente,
                },
                {   
                    data: null,
                    title: "Nombre",
                    render: function(data){
                        const razon_social = render_dato_cliente(data.razon_social, "display");
                        const nombre_fantasia = render_dato_cliente(data.nombre_fantasia, "display");

                        return `<div class="ubicacion-cell">
                            <strong>Razon Social: ${razon_social}</strong>
                            <small class="d-block text-muted"> ${nombre_fantasia} </small>
                        </div>`;
                    } 
                },
                {   data: null,
                    title: "Contacto",
                    render: function(data){
                        const telefono = render_dato_cliente(data.telefono, "display");
                        const email = render_dato_cliente(data.email, "display");

                        return `<div class="ubicacion-cell">
                            <strong>Tel:${telefono}</strong>
                            <small class="d-block text-muted">Email: ${email}</small>
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
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_clientes" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver cliente">
                                    <i class="ri-eye-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" id="btnEditar_clientes" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar cliente">
                                    <i class="ri-edit-2-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" id="btnBaja_clientes" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Desactivar" aria-label="Desactivar cliente">
                                    <i class="ri-close-circle-fill"></i>
                                </button>
                            </div>`;
                        } else {
                            return `<div class="sac-table-actions">
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_clientes" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver cliente">
                                    <i class="ri-eye-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" id="btnAlta_clientes" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Activar" aria-label="Activar cliente">
                                    <i class="ri-check-double-line"></i>
                                </button>
                            </div>`;
                        }
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Clientes...'
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

    function render_dato_cliente(data, type) {
        if (data === null || data === undefined || String(data).trim() === "") {
            return type === "display" ? '<span class="text-muted">Sin datos</span>' : "";
        }

        return data;
    }

    $("#datatable_list_clientes tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");
        datosCliente = datatableClientes.DataTable().row(row).data();

        switch (opt) {
            case "btnVer_clientes":
                extraer_datos_cliente_ajax(datosCliente['id_cliente']);
                break;
            case "btnEditar_clientes":
                cargar_modal_editarCliente(datosCliente);
                break;
            case "btnBaja_clientes":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas desactivar este Cliente?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, desactivar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_cliente(datosCliente['id_cliente'], datosCliente['estado']);
                    }
                });
                
                break;
            case "btnAlta_ctaBancaria":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas activar este Cliente?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, activar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_cliente(datosCliente['id_cliente'], datosCliente['estado']);
                    }
                });
                break;
        }
    });

    $("#btnNuevoCliente").on("click", function (e) {
        abrir_modal_nuevoCliente();
    });

    function abrir_modal_nuevoCliente() {
        aplicarSoloNumeros("#cuit_nuevoCliente");
        aplicarSoloNumeros("#telf_nuevoCliente");
        form_nuevoCliente[0].reset();
        limpiarFormulario(form_nuevoCliente);
        resetear_cuenta_contable_nuevo_cliente();
        $('#modalNuevoCliente').modal("show");
    }

    function extraer_datos_cliente_ajax(id_cliente) {
        let dataString = {'backend': 'extraer_cliente','id_cliente':id_cliente};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Clientes/Clientes_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    cargar_modal_detalleCliente(response.data);
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

    function cargar_modal_detalleCliente(cliente){
         // Cargar título en el header
        $("#nombreCliente_detalleCliente").text(cliente.razon_social || "Cliente Sin nombre");
        const badgeActivo = $("#badge_estado_detalleCliente");
        const estadoTexto = $("#estado_texto_detalleCliente");

        if (cliente.estado == "A") {
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
        actualizarCampo("#nombreFantasia_detalleCliente", cliente.nombre_fantasia);
        actualizarCampo("#cuit_detalleCliente", cliente.cuit);
        actualizarCampo("#cuentaContable_detalleCliente", cliente.cuenta_contable_label || null);
        
        // Ubicación
        actualizarCampo("#cod_prov_detalleCliente", cliente.nombre_provincia);
        actualizarCampo("#cod_localidad_detalleCliente", cliente.nombre_localidad);
        actualizarCampo("#observ_detalleCliente", cliente.observaciones);
        
        // Contacto
        actualizarCampo("#telf_detalleCliente", cliente.telefono);
        actualizarCampo("#email_detalleCliente", cliente.email);
    
        $('#modalDetalleCliente').modal("show");
    }

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
            $("#cod_prov_nuevoCliente"),
            $("#cod_prov_editarCliente")
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
            $("#cod_localidad_nuevoCliente"),
            $("#cod_localidad_editarCliente")
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

    function inicializar_choices_cuentas_contables() {
        if (typeof Choices === "undefined") {
            return;
        }

        choicesCuentaContableNuevoCliente = inicializar_choice_cuenta_contable_cliente(
            selectCuentaContableNuevoCliente,
            choicesCuentaContableNuevoCliente,
            "Seleccione cuenta contable",
        );
        choicesCuentaContableEditarCliente = inicializar_choice_cuenta_contable_cliente(
            selectCuentaContableEditarCliente,
            choicesCuentaContableEditarCliente,
            "Seleccione cuenta contable",
        );

        vincular_busqueda_cuenta_contable_cliente(
            selectCuentaContableNuevoCliente,
            "cuentaNuevoCliente",
            function () {
                return choicesCuentaContableNuevoCliente;
            },
        );
        vincular_busqueda_cuenta_contable_cliente(
            selectCuentaContableEditarCliente,
            "cuentaEditarCliente",
            function () {
                return choicesCuentaContableEditarCliente;
            },
        );
        vincular_seleccion_cuenta_contable_cliente(selectCuentaContableNuevoCliente);
        vincular_seleccion_cuenta_contable_cliente(selectCuentaContableEditarCliente);

        buscar_cuentas_contables_cliente("", selectCuentaContableNuevoCliente, choicesCuentaContableNuevoCliente);
        buscar_cuentas_contables_cliente("", selectCuentaContableEditarCliente, choicesCuentaContableEditarCliente);
    }

    function inicializar_choice_cuenta_contable_cliente(selectElement, instanciaActual, placeholderValue) {
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

    function vincular_busqueda_cuenta_contable_cliente(selectElement, timeoutKey, obtenerInstanciaChoices) {
        selectElement.off("search.choicesCuentaCliente").on("search.choicesCuentaCliente", function (e) {
            const termino = String(e?.detail?.value || "").trim();
            const timeoutActual = timeoutsBusquedaCuentaContable[timeoutKey] || null;

            clearTimeout(timeoutActual);

            timeoutsBusquedaCuentaContable[timeoutKey] = setTimeout(function () {
                const instanciaChoices = typeof obtenerInstanciaChoices === "function" ? obtenerInstanciaChoices() : null;
                buscar_cuentas_contables_cliente(termino, selectElement, instanciaChoices);
            }, 250);
        });
    }

    function vincular_seleccion_cuenta_contable_cliente(selectElement) {
        selectElement.off("change.choicesCuentaCliente choice.choicesCuentaCliente");
        selectElement.on("change.choicesCuentaCliente choice.choicesCuentaCliente", function () {
            actualizar_cuenta_contable_seleccionada_cliente(selectElement);
        });
    }

    function buscar_cuentas_contables_cliente(termino, selectElement, instanciaChoices) {
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
                cargar_select_cuentas_contables_cliente(selectElement, instanciaChoices, cuentasContables, selectElement.val());
            },
            error: function () {
                cargar_select_cuentas_contables_cliente(selectElement, instanciaChoices, [], "");
            },
        });
    }

    function cargar_select_cuentas_contables_cliente(selectElement, instanciaChoices, cuentasContables, valorSeleccionado = "") {
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
            actualizar_cuenta_contable_seleccionada_cliente(selectElement);
            return;
        }

        selectElement.empty().append('<option value="" selected>Seleccione una cuenta...</option>');

        cuentasParaOpciones.forEach(function (cuenta) {
            selectElement.append(
                `<option value="${cuenta.id_cuenta}">${cuenta.label || construir_descripcion_cuenta_contable(cuenta)}</option>`,
            );
        });

        selectElement.val(existeCuentaSeleccionada ? String(valorSeleccionado) : "");
        actualizar_cuenta_contable_seleccionada_cliente(selectElement);
    }

    function construir_descripcion_cuenta_contable(cuenta) {
        return [cuenta.codigo_cuenta, cuenta.nombre_cuenta].filter(Boolean).join(" - ");
    }

    function actualizar_cuenta_contable_seleccionada_cliente(selectElement) {
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

    function precargar_cuenta_contable_seleccionada_cliente(idCuenta, selectElement, instanciaChoices) {
        if (!idCuenta) {
            cargar_select_cuentas_contables_cliente(selectElement, instanciaChoices, [], "");
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
                    cargar_select_cuentas_contables_cliente(selectElement, instanciaChoices, [], "");
                    return;
                }

                selectElement.data("cuentaContableSeleccionada", cuenta);
                cargar_select_cuentas_contables_cliente(selectElement, instanciaChoices, [cuenta], idCuenta);
                buscar_cuentas_contables_cliente("", selectElement, instanciaChoices);
            },
            error: function () {
                cargar_select_cuentas_contables_cliente(selectElement, instanciaChoices, [], "");
            },
        });
    }

    function resetear_cuenta_contable_nuevo_cliente() {
        cargar_select_cuentas_contables_cliente(selectCuentaContableNuevoCliente, choicesCuentaContableNuevoCliente, [], "");
        buscar_cuentas_contables_cliente("", selectCuentaContableNuevoCliente, choicesCuentaContableNuevoCliente);
    }

    function resetear_cuenta_contable_editar_cliente() {
        cargar_select_cuentas_contables_cliente(selectCuentaContableEditarCliente, choicesCuentaContableEditarCliente, [], "");
        buscar_cuentas_contables_cliente("", selectCuentaContableEditarCliente, choicesCuentaContableEditarCliente);
    }

    function nuevo_cliente() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            razon_social: $("#razonSocial_nuevoCliente").val(),
            nombre_fantasia: $("#nombreFantasia_nuevoCliente").val(),
            cuit: $('#cuit_nuevoCliente').val(),
            cuenta_contable: $("#cuenta_contable_nuevoCliente").val() || null,
            provincia: $("#cod_prov_nuevoCliente").val(),
            localidad: $("#cod_localidad_nuevoCliente").val(),
            telefono: $("#telf_nuevoCliente").val(),
            email: $("#email_nuevoCliente").val()
        }
        //CAMPOS NO OBLIGATORIOS
        dataString.observaciones= $("#observ_nuevoCliente").val();

        $("#modalNuevoCliente").modal('hide');
        nuevo_cliente_ajax(dataString);
    }

    function editar_cliente() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            id_cliente: datosCliente['id_cliente'],
            razon_social: $("#razonSocial_editarCliente").val(),
            nombre_fantasia: $("#nombreFantasia_editarCliente").val(),
            cuit: $('#cuit_editarCliente').val(),
            cuenta_contable: $("#cuenta_contable_editarCliente").val() || null,
            provincia: $("#cod_prov_editarCliente").val(),
            localidad: $("#cod_localidad_editarCliente").val(),
            telefono: $("#telf_editarCliente").val(),
            email: $("#email_editarCliente").val()
        }
        //CAMPOS NO OBLIGATORIOS
        dataString.observaciones= $("#observ_editarCliente").val();

        $("#modalEditarCliente").modal('hide');
        editar_cliente_ajax(dataString);
    }

    function nuevo_cliente_ajax(dataCliente){
        let dataString = {'backend': 'nuevo_cliente', 'datos': dataCliente};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Clientes/Clientes_backend.php',
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
                           $("#modalNuevoCliente").modal('show');
                        }
                    }
                });    
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }

    function editar_cliente_ajax(dataCliente){
        let dataString = {'backend': 'modificar_cliente', 'datos': dataCliente};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Clientes/Clientes_backend.php',
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
                           $("#modalEditarCliente").modal('show');
                        }
                    }
                });
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }

    function cargar_modal_editarCliente(cliente){
        const badgeActivo = $("#badge_estado_editarCliente");
        const estadoTexto = $("#estado_texto_editarCliente");

        if (cliente.estado == "A") {
            badgeActivo.removeClass("bg-danger border-danger text-danger").addClass("bg-success border-success text-success");
            badgeActivo.find("i").removeClass("bi-x-circle").addClass("bi-check-circle");
            estadoTexto.text("Activo");
        } else {
            badgeActivo.removeClass("bg-success border-success text-success").addClass("bg-danger border-danger text-danger");
            badgeActivo.find("i").removeClass("bi-check-circle").addClass("bi-x-circle");
            estadoTexto.text("Inactivo");
        }
        aplicarSoloNumeros("#cuit_editarCliente");
        aplicarSoloNumeros("#codPostal_editarCliente");
        aplicarSoloNumeros("#telf_editarCliente");
        resetear_cuenta_contable_editar_cliente();
        //extraer_condicIVA_ajax();
        //CAMPOS OBLIGATORIOS
        $("#razonSocial_editarCliente").val(cliente.razon_social);
        $("#nombreFantasia_editarCliente").val(cliente.nombre_fantasia);
        $('#cuit_editarCliente').val(cliente.cuit);
        $("#cod_prov_editarCliente").val(cliente.provincia);
        $("#telf_editarCliente").val(cliente.telefono);
        $("#email_editarCliente").val(cliente.email);
        $("#observ_editarCliente").val(cliente.observaciones);
        precargar_cuenta_contable_seleccionada_cliente(
            cliente.cuenta_contable,
            selectCuentaContableEditarCliente,
            choicesCuentaContableEditarCliente,
        );
        // LLAMADA ASÍNCRONA CON CALLBACK:
        extraer_localidad_ajax(cliente.provincia, function() {
            // ESTE CÓDIGO SE EJECUTA DESPUÉS de que las localidades estén cargadas
            $("#cod_localidad_editarCliente").val(cliente.localidad);
            // $("#cod_localidad_editarCliente").attr("disabled", false);
        });
        $("#modalEditarCliente").modal("show");
    }
    $("#cod_prov_nuevoCliente").on("change", function (e) {
        var cod_prov = $(this).val();
        
        if(cod_prov === "" || cod_prov === null){
            $("#cod_localidad_nuevoCliente").val("");
            $("#cod_localidad_nuevoCliente").prop('disabled',true);   
        }else{
            extraer_localidad_ajax(cod_prov);
            $('#cod_localidad_nuevoCliente').prop('disabled', false);
        }
    });
     function cambiar_estado_cliente(id_cliente, estado){
        let dataString= {backend: "actualizar_estado",
            datos: {'id_cliente': id_cliente, 'estado': estado}
        }
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Clientes/Clientes_backend.php',
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
    ClassValidaciones.validarFormulario(form_nuevoCliente, btnNuevoCliente, function () {
        Swal.fire({
            title: "¿Desea dar de alta un Nuevo Cliente?",
            text: "Se guardará la informacion proporcionada.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                nuevo_cliente();
            }
        });
    });

    ClassValidaciones.validarFormulario(form_editarCliente, btnEditarCliente, function () {
        Swal.fire({
            title: "¿Desea modificar los datos del Cliente?",
            text: "Se actualizara la informacion.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                editar_cliente();
            }
        });
    });
});
