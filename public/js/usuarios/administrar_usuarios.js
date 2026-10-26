const ClassValidaciones = window.Validaciones;
$(document).ready(function () {
    const datatableUsuarios = $("#datatable_list_usuarios");
    const formulario_nuevoUsuario = $("#form_nuevoUsuario");
    const formulario_editarUsuario = $("#form_editarUsuario");
    const btn_nuevoUsuario = $("#btnGuardar_nuevoUsuario");
    const btn_editarUsuario = $("#btnGuardar_nuevoUsuario");
    extraer_usuarios();
    extraer_roles_ajax();
    function cargar_select_roles(roles){
        let $selects = [
            $("#rol_nuevoUsuario"),
            $("#rol_editarUsuario")
            //$("#cod_prov_detalleFarmacia")
        ];
    
        $selects.forEach($select => {
            if ($select.length) { // Asegura que el selector existe en el DOM
                $select.empty();
                $select.append("<option value=''>-- Seleccione Rol --</option>");
                
                for (var i = 0; i < roles.length; i++) {
                    $select.append(`<option value='${roles[i]["id_rol"]}'>${roles[i]["nombre"]}</option>`);
                }
            }
        });
    }
    function extraer_usuarios(){
        $.ajax({
            url: 'app/Controllers/Usuarios/Usuarios_backend.php',
            type: 'POST',
            dataType: "json",
            data: {backend: "extraer_usuarios"},
            success: function(response) {
                datatableUsuarios.DataTable({
                    destroy: true,
                    data: response.data,
                    columns: [
                        { data: "nombre", className: "text-start align-middle" },
                        { data: "apellido", className: "text-start align-middle" },
                        { data: null,
                            className: "text-start align-middle",
                            render: function (data) {
                                return render_dato_usuario(data.email);
                            },
                        },
                        { data: null,
                            className: "text-start align-middle",
                            render: function (data) {
                                return render_dato_usuario(data.telefono);
                            },
                        },
                        { data: "fecha_creacion", className: "text-center align-middle" },
                        { data: null,
                            className: "text-center align-middle",
                            render: function (data) {
                                if (data.activo == 1) {
                                    return '<span class="sac-status-badge sac-status-active">Activo</span>';
                                } else {
                                    return '<span class="sac-status-badge sac-status-inactive">Inactivo</span>';
                                }
                            },
                        },
                        { data: null,
                            className: "text-center align-middle",
                            render: function (data) {
                                if (data.activo == 1) {
                                    return `<div class="sac-table-actions">
                                        <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_usuario" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver usuario">
                                            <i class="ri-eye-fill"></i>
                                        </button>
                                        <button class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" id="btnEditar_usuario" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar usuario">
                                            <i class="ri-edit-2-fill"></i>
                                        </button>
                                        <button class="sac-btn-icon sac-btn-icon-sm sac-btn-revert" id="btnBaja_usuario" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Desactivar" aria-label="Desactivar usuario">
                                            <i class="ri-close-circle-fill"></i>
                                        </button>
                                    </div>`;
                                } else {
                                    return `<div class="sac-table-actions">
                                        <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_usuario" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver usuario">
                                            <i class="ri-eye-fill"></i>
                                        </button>
                                        <button class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" id="btnAlta_usuario" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Activar" aria-label="Activar usuario">
                                            <i class="ri-check-double-line"></i>
                                        </button>
                                    </div>`;
                                }
                            },
                        },
                    ],
                    language: {
                        url: "public/json/Spanish.json",
                        searchPlaceholder: 'Buscar Usuario...'
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
        });
    }

    function render_dato_usuario(data) {
        if (data === null || data === undefined || String(data).trim() === "") {
            return '<span class="text-muted">Sin datos</span>';
        }

        return data;
    }

    $("#datatable_list_usuarios tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");
        if (row.hasClass("child")) {
            // Si es hija, apuntamos a la fila anterior (la fila padre real)
            row = row.prev();
        }
        let usuario = datatableUsuarios.DataTable().row(row).data();

        switch (opt) {
            case "btnVer_usuario":
                extraer_datos_usuario_ajax(usuario['id_usuario']);
                break;
            case "btnEditar_usuario":
                cargar_modal_editar_usuario(usuario);
                break;
            case "btnBaja_usuario":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas desactivar el Usuario: ${usuario['nombre']} ${usuario['apellido']}?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, desactivar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_usuario(usuario, 0);
                    }
                });
                
                break;
            case "btnAlta_usuario":
            
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas activar el Usuario: ${usuario['nombre']} ${usuario['apellido']}?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, activar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cambiar_estado_usuario(usuario, 1);
                    }
                });
                break;
        }
    });
    
    $("#btnNuevoUsuario").on("click", function (e) {
        $('#modalNuevoUsuario').modal("show");
    });
    
     //Poder ver y ocultar contraseña
    $("#eyePassword").on("click", function () {
        //ID del Input
        if ($("#password_nuevoUsuario").attr("type") === "password") {
            $("#password_nuevoUsuario").attr("type","text");
        } else {
            $("#password_nuevoUsuario").attr("type","password");
        }
    });

    //#### INICIO: VALIDACIONES FORMULARIOS #####
    ClassValidaciones.validarFormulario(formulario_nuevoUsuario, btn_nuevoUsuario, function () {
        Swal.fire({
            title: "¿Desea dar de alta este usuario?",
            text: "Se guardará la informacion proporcionada.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                nuevo_usuario();
            }
        });
    });
    ClassValidaciones.validarFormulario(formulario_editarUsuario, btn_editarUsuario, function () {
        Swal.fire({
            title: "¿Desea modificar los datos del Usuario?",
            text: "Se actualizara la informacion.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                editar_usuario();
            }
        });
    });
    //#### FIN: VALIDACIONES FORMULARIOS #####

    function nuevo_usuario() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            username: $("#usuario_nuevoUsuario").val(),
            password: $("#password_nuevoUsuario").val(),
            rol_id: $('#rol_nuevoUsuario').val(),
            nombre: $("#nombre_nuevoUsuario").val(),
            apellido: $("#apellido_nuevoUsuario").val()
        }
        //CAMPOS NO OBLIGATORIOS
        dataString.telefono=$("#telefono_nuevoUsuario").val();
        dataString.email=$("#email_nuevoUsuario").val();
        
        $("#modalNuevoUsuario").modal('hide');
        nuevo_usuario_ajax(dataString);
    }
    function cargar_modal_editar_usuario(usuario){
         // Cargar título en el header
        $("#nomyapeUsuario_editarUsuario").text(usuario.nombre+" "+usuario.apellido);

        // Configurar badge de estado
        const badgeActivo = $("#badge_estado_editarUsuario");
        const estadoTexto = $("#estado_texto_editarUsuario");

        if (usuario.activo == "1") {
            badgeActivo.removeClass("bg-danger border-danger text-danger").addClass("bg-success border-success text-success");
            badgeActivo.find("i").removeClass("bi-x-circle").addClass("bi-check-circle");
            estadoTexto.text("Activo");
        } else {
            badgeActivo.removeClass("bg-success border-success text-success").addClass("bg-danger border-danger text-danger");
            badgeActivo.find("i").removeClass("bi-check-circle").addClass("bi-x-circle");
            estadoTexto.text("Inactivo");
        }
        $("#usuario_editarUsuario").val(usuario.username);
        $("#nombre_editarUsuario").val(usuario.nombre);
        $("#apellido_editarUsuario").val(usuario.apellido);
        $("#telefono_editarUsuario").val(usuario.telefono);
        $("#email_editarUsuario").val(usuario.email);
        $('#rol_editarUsuario').val(usuario.rol_id);
        $("#modalEditarUsuario").modal("show");
    }
    function editar_usuario() {
        //CAMPOS OBLIGATORIOS
        let dataString={
            username: $("#usuario_editarUsuario").val(),
            rol_id: $('#rol_editarUsuario').val(),
            nombre: $("#nombre_editarUsuario").val(),
            apellido: $("#apellido_editarUsuario").val()
        }
        //CAMPOS NO OBLIGATORIOS
        dataString.telefono=$("#telefono_editarUsuario").val();
        dataString.email=$("#email_editarUsuario").val();

        $("#modalEditarFarmacia").modal('hide');
        editar_usuario_ajax(dataString);
    }

    function ver_datos_usuario(usuario){
         // Cargar título en el header
        $("#nomyapeUsuario_detalleUsuario").text(usuario.nombre+" "+usuario.apellido);

        // Configurar badge de estado
        const badgeActivo = $("#badge_estado_detalleUsuario");
        const estadoTexto = $("#estado_texto_detalleUsuario");

        if (usuario.activo == "1") {
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
        actualizarCampo("#nombre_detalleUsuario", usuario.nombre);
        actualizarCampo("#apellido_detalleUsuario", usuario.apellido);
        actualizarCampo("#telef_detalleFarmacia", usuario.telefono);
        actualizarCampo("#username_detalleUsuario", usuario.username);
        actualizarCampo("#email_detalleUsuario", usuario.email);
        actualizarCampo("#rol_detalleUsuario", usuario.nombre_rol);
        
    
        $('#modalDetalleUsuario').modal("show");
    }
    function cambiar_estado_usuario(usuario, estado){
     let dataString= {backend: "actualizar_estado",
            datos: {'id_usuario': usuario['id_usuario'], 'estado': estado}
        }
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Usuarios/Usuarios_backend.php',
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
    function extraer_roles_ajax(){
        $.ajax({
            url: 'app/Controllers/Usuarios/Usuarios_backend.php',
            type: 'POST',
            dataType: "json",
            data: {backend: "extraer_roles"},
            success: function(response) {
                cargar_select_roles(response.data);
            }
        });
    }
    function extraer_datos_usuario_ajax(id_usuario){
        let dataString = {'backend': 'extraer_usuario', 'id_usuario': id_usuario};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Usuarios/Usuarios_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    ver_datos_usuario(response.data);
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
    function nuevo_usuario_ajax(dataUsuario){
        let dataString = {'backend': 'nuevo_usuario', 'datos': dataUsuario};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Usuarios/Usuarios_backend.php',
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
                           $("#modalNuevoUsuario").modal('show');
                        }
                    }
                });
                
                
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }

    function editar_usuario_ajax(dataUsuario){
        let dataString = {'backend': 'modificar_usuario', 'datos': dataUsuario};
        $('#myAlert').modal('show');
        $.ajax({
            data: dataString,
            url: 'app/Controllers/Usuarios/Usuarios_backend.php',
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
                           $("#modalEditarUsuario").modal('show');
                        }
                    }
                });
            },
            error: function () {
                Swal.fire("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
            
        });
    }

     //#### FUNCIONES AUXILIARES #####


});
