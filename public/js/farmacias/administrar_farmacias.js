const ClassValidaciones = window.Validaciones;
$(document).ready(function () {
    var listado_farmacias_tabla= $('#datatable_list_farmacias');
    var listado_convenios_tabla= $('#datatable_farmaciaConvenios_detalleFarmacia');
    var listado_convenios_editarFarmacia= $('#datatable_farmaciaConvenios_editarFarmacia');
    const form_nuevaFarmacia = $("#form_nuevaFarmacia");
    const form_editarFarmacia = $("#form_editarFarmacia");
    const btnNuevaFarmacia= $("#btnConfirmarNuevaFarmacia");
    const btnEditarFarmacia= $("#btnConfirmarEditarFarmacia");
    let choicesConvenios = null; // Buscador de sugerencias
    let timerBusqueda = null;
    let farmaDatos = null; 
    extraer_farmacias_ajax();
    extraer_provincias_ajax();
    function cargar_select_provincia(provincia){
        let $selects = [
            $("#cod_prov_nuevaFarmacia"),
            $("#cod_prov_editarFarmacia")
            //$("#cod_prov_detalleFarmacia")
        ];
    
        $selects.forEach($select => {
            if ($select.length) { // Asegura que el selector existe en el DOM
                $select.empty();
                $select.append("<option value=''>-- Seleccione Provincia --</option>");
                
                for (var i = 0; i < provincia.length; i++) {
                    $select.append(`<option value='${provincia[i]["patente"]}'>${provincia[i]["nombre"]}</option>`);
                }
            }
        });
    }
    function cargar_select_localidad(localidad){
        
        let $selects = [
            $("#cod_localidad_nuevaFarmacia"),
            $("#cod_localidad_editarFarmacia"),
            //$("#cod_localidad_detalleFarmacia")
        ];
    
        $selects.forEach($select => {

            if ($select.length) { // Asegura que el selector existe en el DOM
                $select.empty();
                $select.append("<option value=''>-- Seleccione Localidad --</option>");
                
                for (var i = 0; i < localidad.length; i++) {
                    $select.append(`<option value='${localidad[i]["id_localidad"]}'>${localidad[i]["nombre"]}</option>`);
                }
            }
        });
    }
    function cargar_tabla_farmacias(farmacias){
      
        listado_farmacias_tabla.DataTable({
            destroy: true,
            data:farmacias,
            pageLength: 25, // Mostrar 25 registros por página
            columns: [
                {
                    data: "id_farmacia",
                    className: "text-start align-middle",
                },
                {
                    data: "cuit",
                    className: "text-start align-middle",
                    render: render_dato_farmacia,
                },
                {
                    data: "codigo_pami",
                    className: "text-start align-middle",
                    render: render_dato_farmacia,
                },
                {
                    data: "razon_social",
                    render: render_dato_farmacia,
                },
                {
                    data: "nombre",
                    render: render_dato_farmacia,
                },
                {
                    data: "provincia_nombre",
                    render: render_dato_farmacia,
                },
                {
                    data: "localidad_nombre",
                    render: render_dato_farmacia,
                },
                {
                    data: "direccion",
                    render: render_dato_farmacia,
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
                    data: null,
                    className: "text-center",
                    render: function (data) {
                        if (data.activo == "1") {
                            return `<div class="sac-table-actions">
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_farma" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver farmacia">
                                    <i class="ri-eye-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" id="btnEditar_farma" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar farmacia">
                                    <i class="ri-edit-2-fill"></i>
                                </button>
                                <button class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" id="btnBaja_farma" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Desactivar" aria-label="Desactivar farmacia">
                                    <i class="ri-close-circle-fill" type="button"></i>
                                </button>
                            </div>`;
                           
                        } else {
                            return `<div class="sac-table-actions">
                                    <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_farma" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver farmacia">
                                        <i class="ri-eye-fill"></i>
                                    </button>
                                    <button class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" id="btnAlta_farma" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Activar" aria-label="Activar farmacia">
                                        <i class="ri-check-double-line"></i>
                                    </button>
                                </div>`;
                        }
                    }
                }
            ],
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Farmacia...'
            },
            lengthMenu: [
                [25,50,100, -1],
                [25, 50,100, "Todos"],
            ],
            responsive:true,
            scrollX:false,
            sInfo: false,
            info: false,
            order: [[0, "asc"]],

        });
        $('#myAlert').modal('hide');
    }

    function render_dato_farmacia(data, type) {
        if (data === null || data === undefined || String(data).trim() === "") {
            return type === "display" ? '<span class="text-muted">Sin datos</span>' : "";
        }

        return data;
    }

    function cargar_tabla_conveniosHabilitados_detalleFarmacia(convenios){

        listado_convenios_tabla.DataTable({
            destroy: true,
            data:convenios,
            pageLength: 25, // Mostrar 25 registros por página
            columns: [
                {   data: null,
                    title: "Convenio",
                    render: function(data){
                        const id = data.convenio_id || " - ";
                        const nombreConvenio = data.convenio_nombre || " - ";

                        return `<div class="ubicacion-cell">
                            <strong>${nombreConvenio}</strong>
                            <small class="d-block text-muted">ID: ${id}</small>
                        </div>`;
                    } 
                },
                {   data: null,
                    title: "Alta",
                    render: function(data){
                        const fechaCreacion = data.fecha_creacion || " - ";
                        const usuarioCreacion = data.usuario_creacion || " - ";

                        return `<div class="ubicacion-cell">
                            <strong>${usuarioCreacion}</strong>
                            <small class="d-block text-muted">${fechaCreacion}</small>
                        </div>`;
                    } 
                },
                {   data: null,
                    title: "Estado",
                    className: "text-center",
                    render: function (data) {
                            if (data.activo == 1) {
                                return `<div class="d-flex justify-content-center gap-2">
                                    <span class="badge bg-success-subtle text-success badge-border">Activo</span>
                                </div>`;
                            } else {
                                return `<div class="d-flex justify-content-center gap-2">
                                    <span class="badge bg-danger-subtle text-success badge-border">Inactivo</span> 
                                </div>`;
                            }
                        },
                },
                
            ],
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Convenio...'
            },
            lengthMenu: [
                [25,50,100, -1],
                [25, 50,100, "Todos"],
            ],
            responsive:true,
            scrollX:false,
            sInfo: false,
            info: false,
            order: [[0, "desc"]],

        });
        $('#myAlert').modal('hide');
    }
    function cargar_tabla_conveniosHabilitados_editarFarmacia(convenios){

        listado_convenios_editarFarmacia.DataTable({
            destroy: true,
            data:convenios,
            pageLength: 25, // Mostrar 25 registros por página
            columns: [
                {   data: null,
                    title: "Convenio",
                    render: function(data){
                        const id = data.convenio_id || " - ";
                        const nombreConvenio = data.convenio_nombre || " - ";

                        return `<div class="ubicacion-cell">
                            <strong>${nombreConvenio}</strong>
                            <small class="d-block text-muted">ID: ${id}</small>
                        </div>`;
                    } 
                },
                {   data: null,
                    title: "Alta",
                    render: function(data){
                        const fechaCreacion = data.fecha_creacion || " - ";
                        const usuarioCreacion = data.usuario_creacion || " - ";

                        return `<div class="ubicacion-cell">
                            <strong>${usuarioCreacion}</strong>
                            <small class="d-block text-muted">${fechaCreacion}</small>
                        </div>`;
                    } 
                },
                {   data: null,
                    title: "Estado",
                    className: "text-center",
                    render: function (data) {
                            if (data.activo == 1) {
                                return `<div class="d-flex justify-content-center gap-2">
                                    <span class="badge bg-success-subtle text-success badge-border">Activo</span>
                                </div>`;
                            } else {
                                return `<div class="d-flex justify-content-center gap-2">
                                    <span class="badge bg-danger-subtle text-success badge-border">Inactivo</span> 
                                </div>`;
                            }
                        },
                },
                
            ],
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Convenio...'
            },
            lengthMenu: [
                [25,50,100, -1],
                [25, 50,100, "Todos"],
            ],
            responsive:true,
            scrollX:false,
            sInfo: false,
            info: false,
            order: [[0, "desc"]],

        });
        $('#myAlert').modal('hide');
    }
    function ver_datos_farmacia(farmacia){
        let convenios = farmacia.convenios_habilitados || [];
        let farmaciaDatos = farmacia.datos_farmacia || {};
         // Cargar título en el header
        $("#nombreFarmacia_detalleFarmacia").text(farmaciaDatos.nombre || "Farmacia Sin nombre");

        // Configurar badge de estado
        const badgeActivo = $("#badge_estado_detalleFarmacia");
        const estadoTexto = $("#estado_texto_detalleFarmacia");

        if (farmaciaDatos.activo == "1") {
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
        actualizarCampo("#cod_farma_detalleFarmacia", farmaciaDatos.id_farmacia);
        actualizarCampo("#cuf_detalleFarmacia", farmaciaDatos.cuf);
        actualizarCampo("#cuit_detalleFarmacia", farmaciaDatos.cuit);
        actualizarCampo("#codPami_detalleFarmacia", farmaciaDatos.codigo_pami);
        actualizarCampo("#razonSocial_detalleFarmacia", farmaciaDatos.razon_social);
        actualizarCampo("#nombre_detalleFarmacia", farmaciaDatos.nombre);
        // Ubicación
        actualizarCampo("#direccion_detalleFarmacia", farmaciaDatos.direccion);
        actualizarCampo("#prov_detalleFarmacia", farmaciaDatos.provincia_nombre);
        actualizarCampo("#localidad_detalleFarmacia", farmaciaDatos.localidad_nombre);
        // Contacto
        actualizarCampo("#telf_detalleFarmacia", farmaciaDatos.telefono);
        actualizarCampo("#email_detalleFarmacia", farmaciaDatos.email);

        // Datos Bancarios
        actualizarCampo("#cbu_detalleFarmacia", farmaciaDatos.cbu);
        actualizarCampo("#cbuAlias_detalleFarmacia", farmaciaDatos.cbu_alias);
        actualizarCampo("#cbuNroCuenta_detalleFarmacia", farmaciaDatos.cbu_nro_cuenta);
        actualizarCampo("#cvu_detalleFarmacia", farmaciaDatos.cvu);
        actualizarCampo("#cvuAlias_detalleFarmacia", farmaciaDatos.cvu_alias);
        actualizarCampo("#cvuNroCuenta_detalleFarmacia", farmaciaDatos.cvu_nro_cuenta);
        // Convenios Habilitados
        cargar_tabla_conveniosHabilitados_detalleFarmacia(convenios);
        // Extra
        actualizarCampo("#observ_detalleFarmacia", farmaciaDatos.observaciones);
    
        $('#modalDetalleFarmacia').modal("show");
    }
    
    function cargar_modal_editar(farmacia){
        aplicarSoloNumeros("#cod_farma_editarFarmacia");
        aplicarSoloNumeros("#cuit_editarFarmacia");
        aplicarSoloNumeros("#cbu_editarFarmacia");
        aplicarSoloNumeros("#cbuNroCuenta_editarFarmacia");
        aplicarSoloNumeros("#cvu_editarFarmacia");
        aplicarSoloNumeros("#cvuNroCuenta_editarFarmacia");

          // Configurar badge de estado
        const badgeActivo = $("#badge_estado_editarFarmacia");
        const estadoTexto = $("#estado_texto_editarFarmacia");

        if (farmacia.activo == "1") {
            badgeActivo.removeClass("bg-danger border-danger text-danger").addClass("bg-success border-success text-success");
            badgeActivo.find("i").removeClass("bi-x-circle").addClass("bi-check-circle");
            estadoTexto.text("Activo");
        } else {
            badgeActivo.removeClass("bg-success border-success text-success").addClass("bg-danger border-danger text-danger");
            badgeActivo.find("i").removeClass("bi-check-circle").addClass("bi-x-circle");
            estadoTexto.text("Inactivo");
        }
        //CAMPOS OBLIGATORIOS
        $("#cod_farma_editarFarmacia").val(farmacia.id_farmacia);
        $("#cuf_editarFarmacia").val(farmacia.cuf);
        $("#cuit_editarFarmacia").val(farmacia.cuit);
        $("#codPami_editarFarmacia").val(farmacia.codigo_pami);
        $("#razonSocial_editarFarmacia").val(farmacia.razon_social);
        $("#nombre_editarFarmacia").val(farmacia.nombre);
        $("#cod_prov_editarFarmacia").val(farmacia.patente);
        $("#direccion_editarFarmacia").val(farmacia.direccion);
        //CAMPOS NO OBLIGATORIOS
        $("#telf_editarFarmacia").val(farmacia.telefono);
        $("#email_editarFarmacia").val(farmacia.email);
        $("#cbu_editarFarmacia").val(farmacia.cbu);
        $("#cbuAlias_editarFarmacia").val(farmacia.cbu_alias);
        $("#cbuNroCuenta_editarFarmacia").val(farmacia.cbu_nro_cuenta);
        $("#cvu_editarFarmacia").val(farmacia.cvu);
        $("#cvuAlias_editarFarmacia").val(farmacia.cvu_alias);
        $("#cvuNroCuenta_editarFarmacia").val(farmacia.cvu_nro_cuenta);
        $("#observ_editarFarmacia").val(farmacia.observaciones);
        // LLAMADA ASÍNCRONA CON CALLBACK:
        extraer_localidad_ajax(farmacia.patente, function() {
            // ESTE CÓDIGO SE EJECUTA DESPUÉS de que las localidades estén cargadas
            $("#cod_localidad_editarFarmacia").val(farmacia.localidad_id);
        });
        $("#modalEditarFarmacia").modal("show");
    }
    //######### BOTONES EVENTOS #########
    
    $("#btnNuevaFarmacia").on("click", function (e) {
        abrir_modal_nuevaFarmacia();
    });

    $("#cod_prov_nuevaFarmacia").on("change", function (e) {
        var patente = $(this).val();
        
        if(patente === "" || patente === null){
            $("#cod_localidad_nuevaFarmacia").val("");
            $("#cod_localidad_nuevaFarmacia").prop('disabled',true);   
        }else{
            extraer_localidad_ajax(patente);
            $('#cod_localidad_nuevaFarmacia').prop('disabled', false);
        }
    });

    $("#datatable_list_farmacias tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");
        let farmacia = listado_farmacias_tabla.DataTable().row(row).data();

        switch (opt) {
            case "btnVer_farma":
                extraer_datos_farmacia_ajax(farmacia['id_farmacia'], 'ver');
                break;
            case "btnEditar_farma":
                extraer_datos_farmacia_ajax(farmacia['id_farmacia'], 'editar');
                //cargar_modal_editar(farmacia);
                break;
            case "btnBaja_farma":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas desactivar esta farmacia?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, desactivar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_farmacia(farmacia, 0);
                    }
                });
                
                break;
            case "btnAlta_farma":
            
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas activar esta farmacia?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, activar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_farmacia(farmacia, 1);
                    }
                });
                break;
        }
    });
    //######### INICIO: AJAX PARA CONSULTAS #########
    function extraer_farmacias_ajax(){
        let dataString = {'backend': 'extraer_farmacias'};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Farmacias/Farmacias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                cargar_tabla_farmacias(response.data);
            }
        });
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

    function nueva_farmacia_ajax(dataFarmacia){
        let dataString = {'backend': 'nueva_farmacia', 'datos': dataFarmacia};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Farmacias/Farmacias_backend.php',
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
                           $("#modalNuevaFarmacia").modal('show');
                        }
                    }
                });
                
                
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }
    function editar_farmacia_ajax(dataFarmacia){
        let dataString = {'backend': 'modificar_farmacia', 'datos': dataFarmacia};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Farmacias/Farmacias_backend.php',
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
                           $("#modalEditarFarmacia").modal('show');
                        }
                    }
                });   
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }
    function extraer_datos_farmacia_ajax(id_farmacia,accion){
        let dataString = {'backend': 'extraer_farmacia', 'id_farmacia': id_farmacia};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Farmacias/Farmacias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    if (accion === 'editar') {
                        farmaDatos = response.data.datos_farmacia;
                        cargar_tabla_conveniosHabilitados_editarFarmacia(response.data.convenios_habilitados);
                        cargar_modal_editar(response.data.datos_farmacia);
                    } else {
                        ver_datos_farmacia(response.data);
                    }
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

    function cambiar_estado_farmacia(farmacia, estado){
        let dataString= {backend: "cambiar_estado_farmacia",
            datos: {'id_farmacia': farmacia['id_farmacia'], 'estado': estado}
        }
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Farmacias/Farmacias_backend.php',
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
    //######### FIN: AJAX PARA CONSULTAS #########

    function abrir_modal_nuevaFarmacia() {
        aplicarSoloNumeros("#cod_farma_nuevaFarmacia");
        aplicarSoloNumeros("#cuit_nuevaFarmacia");
        aplicarSoloNumeros("#cbu_nuevaFarmacia");
        aplicarSoloNumeros("#cbuNroCuenta_nuevaFarmacia");
        aplicarSoloNumeros("#cvu_nuevaFarmacia");
        aplicarSoloNumeros("#cvuNroCuenta_nuevaFarmacia");
        // Limpiar formulario y variables de estado
        form_nuevaFarmacia[0].reset();
        limpiarFormulario(form_nuevaFarmacia);

        //cargar_select_provincias($("#id_provincia_alta"), provincias_guardadas);
        // Mostrar el modal
        $("#modalNuevaFarmacia").modal("show");
    }

    //#### INICIO: VALIDACIONES FORMULARIOS #####
    ClassValidaciones.validarFormulario(form_nuevaFarmacia, btnNuevaFarmacia, function () {
        Swal.fire({
            title: "¿Desea dar de alta esta farmacia?",
            text: "Se guardará la informacion proporcionada.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                nueva_farmacia();
            }
        });
    });
    ClassValidaciones.validarFormulario(form_editarFarmacia, btnEditarFarmacia, function () {
        Swal.fire({
            title: "¿Desea modificar los datos de la farmacia?",
            text: "Se actualizara la informacion.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                editar_farmacia();
            }
        });
    });
    //#### FIN: VALIDACIONES FORMULARIOS #####
    function nueva_farmacia() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            id_farmacia: $("#cod_farma_nuevaFarmacia").val(),
            cuf: $("#cuf_nuevaFarmacia").val(),
            cuit: $('#cuit_nuevaFarmacia').val(),
            codigo_pami: $("#codPami_nuevaFarmacia").val(),
            razon_social: $("#razonSocial_nuevaFarmacia").val(),
            nombre: $("#nombre_nuevaFarmacia").val(),
            patente: $("#cod_prov_nuevaFarmacia").val(),
            localidad_id: $("#cod_localidad_nuevaFarmacia").val(),
            direccion: $("#direccion_nuevaFarmacia").val()
        }
        //CAMPOS NO OBLIGATORIOS
        dataString.telefono=$("#telf_nuevaFarmacia").val();
        dataString.email=$("#email_nuevaFarmacia").val();
        dataString.cbu= $("#cbu_nuevaFarmacia").val();
        dataString.cbu_alias= $("#cbuAlias_nuevaFarmacia").val();
        dataString.cbu_nro_cuenta= $("#cbuNroCuenta_nuevaFarmacia").val();
        dataString.cvu= $("#cvu_nuevaFarmacia").val();
        dataString.cvu_alias= $("#cvuAlias_nuevaFarmacia").val();
        dataString.cvu_nro_cuenta= $("#cvuNroCuenta_nuevaFarmacia").val();
        dataString.observaciones= $("#observ_nuevaFarmacia").val();

        $("#modalNuevaFarmacia").modal('hide');
        nueva_farmacia_ajax(dataString);
    }
    function editar_farmacia() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            id_farmacia: $("#cod_farma_editarFarmacia").val(),
            cuf: $("#cuf_editarFarmacia").val(),
            cuit: $('#cuit_editarFarmacia').val(),
            codigo_pami: $("#codPami_editarFarmacia").val(),
            razon_social: $("#razonSocial_editarFarmacia").val(),
            nombre: $("#nombre_editarFarmacia").val(),
            patente: $("#cod_prov_editarFarmacia").val(),
            localidad_id: $("#cod_localidad_editarFarmacia").val(),
            direccion: $("#direccion_editarFarmacia").val()
        }
        //CAMPOS NO OBLIGATORIOS
        dataString.telefono=$("#telf_editarFarmacia").val();
        dataString.email=$("#email_editarFarmacia").val();
        dataString.cbu= $("#cbu_editarFarmacia").val();
        dataString.cbu_alias= $("#cbuAlias_editarFarmacia").val();
        dataString.cbu_nro_cuenta= $("#cbuNroCuenta_editarFarmacia").val();
        dataString.cvu= $("#cvu_editarFarmacia").val();
        dataString.cvu_alias= $("#cvuAlias_editarFarmacia").val();
        dataString.cvu_nro_cuenta= $("#cvuNroCuenta_editarFarmacia").val();
        dataString.observaciones= $("#observ_editarFarmacia").val();

        $("#modalEditarFarmacia").modal('hide');
        editar_farmacia_ajax(dataString);
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

    $("#btnNuevoConvenio_farmacia").on("click", function (e) {
        e.preventDefault();
        $('#modal_agregar_nuevo_convenio_farma').modal('show');
    });
   
    $("#buscar_convenio_input").on("keyup", function (e) {
        e.preventDefault();
        let textoBuscado = $(this).val().trim();
        let $selectResultados = $("#select_sugerencias_convenios");

        clearTimeout(timerBusqueda);

        if (textoBuscado.length < 3) {
            $selectResultados.empty().append('<option value="" disabled selected>Escriba al menos 3 letras...</option>');
            return;
        }

        timerBusqueda = setTimeout(function() {
    
            $selectResultados.empty().append('<option value="" disabled>🔍 Buscando coincidencias...</option>');

            let dataString = { 
                backend: "sugerencias_convenios", 
                termino: textoBuscado 
            };

            $.ajax({
                data: dataString,
                url: "app/Controllers/Convenios/Convenios_backend.php",
                type: "POST",
                dataType: "JSON",
                success: function(response) {
                    $selectResultados.empty(); // Limpiamos el cargando

                    if (response && response.length > 0) {
                        // Recorremos las sugerencias de PHP y las metemos al select
                        response.forEach(function(conv) {
                            $selectResultados.append(`
                                <option value="${conv.id_convenio}">
                                    ${conv.label}
                                </option>
                            `);
                        });
                    } else {
                        $selectResultados.append('<option value="" disabled>❌ No se encontraron convenios</option>');
                    }
                },
                error: function() {
                    $selectResultados.empty().append('<option value="" disabled>⚠️ Error al conectar con el servidor</option>');
                }
            });

        }, 350); 
    });

    $("#btnHabilitar_nuevoConvenio_editarFarmacia").on("click", function() {
        let convenioId = $("#select_sugerencias_convenios").val();

        if (!convenioId) {
            Swal.fire({
                title: "Error",
                text: "Por favor, seleccione un convenio de la lista.",
                icon: "error",
                confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                confirmButtonText: "Aceptar"
            });
            return;
        }
        let dataString = {'backend': 'habilitar_convenio', 'id_farmacia': farmaDatos['id_farmacia'], 'id_convenio': convenioId};
        habilitarConvenio_farmacia_ajax(dataString);

    });

    function habilitarConvenio_farmacia_ajax(dataString){
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Farmacias/Farmacias_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                Swal.fire({
                    title: response.alert.title,
                    text: response.alert.message,
                    icon: response.alert.icon,
                    timer: 2000, 
                    allowOutsideClick: false,
                    showConfirmButton: false
                }).then((result) => {
                    if (response.success) {
                        //Limpiamos los inputs del buscador
                        $("#buscar_convenio_input").val(""); 
                        $("#select_sugerencias_convenios").empty().append('<option value="" disabled selected>Los resultados aparecerán aquí...</option>');
                    
                        $('#modal_agregar_nuevo_convenio_farma').modal('hide');

                        extraer_datos_farmacia_ajax(farmaDatos['id_farmacia'], 'editar');
                    }
                });   
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }
    
});
