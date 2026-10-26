const ClassValidaciones = window.Validaciones;

$(document).ready(function () {
    // ******************************* REFERENCIAS DOM ***************************************
    const contenedorPerfil = $("#profile_form");
    const formPerfilDatos = $("#form_perfil_datos");
    const formPerfilPassword = $("#form_perfil_password");

    // Avatar
    const avatarInput = $("#profile_avatar_input");
    const avatarTrigger = $("#profile_avatar_button, #profile_upload_button");
    const avatarPreview = $("#profile_avatar_preview");
    const avatarShell = $("#profile_avatar_shell");

    // Passwords
    const inputPasswordActual = $("#profile_current_password");
    const inputPasswordNueva = $("#profile_new_password");
    const inputPasswordConfirmacion = $("#profile_confirm_password");
    const passwordStrengthBar = $("#profile_password_strength_bar");
    const passwordStrengthText = $("#profile_password_strength_text");

    // Botones
    const btnGuardarPerfilDatos = $("#btnGuardarPerfilDatos");
    const btnCambiarPasswordPerfil = $("#btnCambiarPasswordPerfil");
    const btnCancelarPerfil = $("#profile_cancel_button");

    // ******************************* VARIABLES DE ESTADO ***********************************
    const URL_BACKEND_PERFIL = "app/Controllers/Perfil/Perfil_backend.php";
    const defaultAvatar = $("#profile_page").data("default-avatar") || "public/images/user.png";
    const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
    const AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const AVATAR_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
    let valoresIniciales = obtener_valores_iniciales();

    // ******************************* INICIALIZACION ****************************************
    extraer_datos_usuario();
    inicializar_avatar();
    actualizar_indicador_password();
    inicializar_eventos();
    inicializar_validaciones();

    // ******************************* EXTRACCION DE DATOS ************************************
    function extraer_datos_usuario() {
        const dataString = {
            backend: "extraer_perfil",
        };
        $.ajax({
            type: "POST",
            url: URL_BACKEND_PERFIL,
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response && response.success && response.data) {
                    cargar_datos_usuario(response.data);

                    valoresIniciales = obtener_valores_iniciales();
                } else {
                    mostrar_alerta_perfil({
                        title: "Error al cargar perfil",
                        text: response && response.message ? response.message : "No se pudieron cargar los datos del perfil.",
                        icon: "error",
                    });
                }
            },
            error: function () {
                mostrar_alerta_perfil({
                    title: "Backend pendiente",
                    text: "El frontend ya solicita los datos, pero el endpoint aun no esta conectado.",
                    icon: "info",
                });
            },
        });
    }

    function cargar_datos_usuario(datos) {
        const nombre = datos.nombre || "";
        const apellido = datos.apellido || "";
        const username = datos.username || "";
        const nombreRol = datos.nombre_rol || "";
        const nombreCompleto = `${apellido} ${nombre}`.trim() || "Usuario";
        const imagenPerfil = datos.imagen ? `public/uploads/perfiles/${datos.imagen}` : defaultAvatar;

        $("#profile_nombre").val(nombre);
        $("#profile_apellido").val(apellido);
        $("#profile_email").val(datos.email || "");
        $("#profile_telefono").val(datos.telefono || "");
        $("#profile_usuario").val(username);
        $("#profile_rol").val(nombreRol);

        $("#profile_nombre_completo_texto").text(nombreCompleto);
        $("#profile_username_texto, #profile_header_usuario").text(username);
        $("#profile_rol_texto, #profile_header_rol").text(nombreRol);

        $(".topbar-user .user-name-text").text(nombre);
        $(".topbar-user .user-name-sub-text").text(nombreRol);
        $(".topbar-user .dropdown-header").text(`Bienvenido ${nombre}!`);
        $(".header-profile-user").attr("src", imagenPerfil);

        avatarPreview.attr("src", imagenPerfil);
        inicializar_avatar();
    }

    // **************************************************************************************
    // ******************************* EVENTOS **********************************************
    function inicializar_eventos() {
        avatarTrigger.on("click", function () {
            avatarInput.trigger("click");
        });

        avatarInput.on("change", function (event) {
            manejar_cambio_avatar(event);
        });

        $(document).on("click", "[data-password-toggle]", function () {
            alternar_visibilidad_password($(this));
        });

        inputPasswordNueva.on("input", function () {
            actualizar_indicador_password();
            validar_campos_password();
        });

        inputPasswordConfirmacion.on("input", function () {
            validar_campos_password();
        });

        inputPasswordActual.on("input", function () {
            validar_campo_password(inputPasswordActual);
        });

        btnCancelarPerfil.on("click", function () {
            restaurar_formulario();
        });

        btnCambiarPasswordPerfil.on("click", function (event) {
            event.preventDefault();

            if (!validar_formulario_password()) {
                return;
            }

            actualizar_contrasenia();
        });
    }

    function inicializar_validaciones() {
        ClassValidaciones.validarFormulario(formPerfilDatos, btnGuardarPerfilDatos, function () {
            modificar_perfil();
        });
    }

    // **************************************************************************************
    // ******************************* DATOS PRINCIPALES *************************************
    function modificar_perfil() {
        const dataString = {
            backend: "modificar_perfil",
            datos: {
                nombre: $("#profile_nombre").val().trim(),
                apellido: $("#profile_apellido").val().trim(),
                email: $("#profile_email").val().trim(),
                telefono: $("#profile_telefono").val().trim(),
            },
        };

        enviar_ajax_perfil(dataString, {
            tituloExito: "Perfil actualizado",
            mensajeExito: "Los datos personales se actualizaron correctamente.",
            mensajeError: "No se pudieron actualizar los datos del perfil.",
            onSuccess: function () {
                limpiar_validacion_formulario(formPerfilDatos);
                extraer_datos_usuario();
            },
        });
    }

    // **************************************************************************************
    // ******************************* PASSWORDS *********************************************
    function actualizar_contrasenia() {
        const dataString = {
            backend: "actualizar_contrasenia",
            datos: {
                contrasenia_actual: $("#profile_current_password").val().trim(),
                nueva_contrasenia: $("#profile_new_password").val().trim(),
            },
        };

        enviar_ajax_perfil(dataString, {
            tituloExito: "Contrasena actualizada",
            mensajeExito: "La contrasena se actualizo correctamente.",
            mensajeError: "No se pudo actualizar la contrasena.",
            limpiarPassword: true,
            onSuccess: function () {
                limpiar_validacion_formulario(formPerfilPassword);
            },
        });
    }

    function validar_formulario_password() {
        formPerfilPassword.addClass("was-validated");

        const todosCompletos = validar_campos_password();
        if (!todosCompletos) {
            mostrar_alerta_perfil({
                title: "Revision pendiente",
                text: "Completa los tres campos de contrasena.",
                icon: "warning",
            });
            return false;
        }

        if (!validar_coincidencia_passwords()) {
            mostrar_alerta_perfil({
                title: "Revision pendiente",
                text: "La nueva contrasena y su confirmacion no coinciden.",
                icon: "warning",
            });
            return false;
        }

        return true;
    }

    function validar_campos_password() {
        const esActualValido = validar_campo_password(inputPasswordActual);
        const esNuevoValido = validar_campo_password(inputPasswordNueva);
        const esConfirmacionCompleta = validar_campo_password(inputPasswordConfirmacion);

        if (esConfirmacionCompleta) {
            validar_coincidencia_passwords();
        } else {
            inputPasswordConfirmacion.removeClass("is-valid");
        }

        return esActualValido && esNuevoValido && esConfirmacionCompleta;
    }

    function validar_campo_password(input) {
        const valor = input.val().trim();

        input.removeClass("is-valid is-invalid");

        if (!valor.length) {
            if (formPerfilPassword.hasClass("was-validated")) {
                input.addClass("is-invalid");
            }

            return false;
        }

        input.addClass("is-valid");
        return true;
    }

    function alternar_visibilidad_password($button) {
        const selector = $button.data("password-toggle");
        const input = $(selector);
        const icon = $button.find("i");
        const estaVisible = input.attr("type") === "text";

        input.attr("type", estaVisible ? "password" : "text");
        icon.toggleClass("bi-eye bi-eye-slash");
    }

    function actualizar_indicador_password() {
        const password = inputPasswordNueva.val().trim();
        const metrica = calcular_seguridad_password(password);

        passwordStrengthBar
            .css("width", `${metrica.width}%`)
            .removeClass("bg-danger bg-warning bg-info bg-success")
            .addClass(metrica.className);

        passwordStrengthText.text(`Seguridad de contrasena: ${metrica.label}`);
        validar_coincidencia_passwords();
    }

    function validar_coincidencia_passwords() {
        const nueva = inputPasswordNueva.val().trim();
        const confirmacion = inputPasswordConfirmacion.val().trim();

        inputPasswordConfirmacion.removeClass("is-invalid is-valid");

        if (!confirmacion.length) {
            if (formPerfilPassword.hasClass("was-validated")) {
                inputPasswordConfirmacion.addClass("is-invalid");
            }

            return false;
        }

        const coincide = nueva === confirmacion;
        inputPasswordConfirmacion.addClass(coincide ? "is-valid" : "is-invalid");

        return coincide;
    }

    // **************************************************************************************
    // ******************************* AJAX **************************************************
    function mostrar_alerta_perfil(opciones = {}) {
        const temaActual = document.documentElement.getAttribute("data-bs-theme");
        const esModoOscuro = temaActual === "dark";

        return Swal.fire({
            confirmButtonText: "Aceptar",
            showCloseButton: true,
            allowOutsideClick: false,
            background: esModoOscuro ? "#262a2f" : undefined,
            color: esModoOscuro ? "#ced4da" : undefined,
            ...opciones,
        });
    }

    function enviar_ajax_perfil(dataString, opciones = {}) {
        $.ajax({
            type: "POST",
            url: URL_BACKEND_PERFIL,
            data: dataString,
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    mostrar_alerta_perfil({
                        title: response.alert ? response.alert.title : opciones.tituloExito || "Exito",
                        text: response.message || opciones.mensajeExito || "La operacion se realizo correctamente.",
                        icon: response.alert ? response.alert.icon : "success",
                    });

                    if (opciones.limpiarPassword) {
                        limpiar_campos_password();
                    }

                    if (typeof opciones.onSuccess === "function") {
                        opciones.onSuccess(response);
                    }

                    return;
                }

                mostrar_alerta_perfil({
                    title: response && response.alert ? response.alert.title : "Error",
                    text: response && response.message ? response.message : opciones.mensajeError || "Ocurrio un error durante el proceso.",
                    icon: response && response.alert ? response.alert.icon : "error",
                });
            },
            error: function () {
                mostrar_alerta_perfil({
                    title: "Backend pendiente",
                    text: "El frontend ya envia los datos, pero el endpoint aun no esta conectado.",
                    icon: "info",
                });
            },
        });
    }

    // **************************************************************************************
    // ******************************* AVATAR ************************************************
    function manejar_cambio_avatar(event) {
        const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        const avatarAnterior = avatarPreview.attr("src") || defaultAvatar;

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            mostrar_alerta_perfil({
                title: "Formato invalido",
                text: "Selecciona una imagen valida para la foto de perfil.",
                icon: "warning",
            });
            avatarInput.val("");
            return;
        }

        if (!validar_archivo_avatar(file)) {
            avatarInput.val("");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (loadEvent) {
            const resultado = loadEvent.target && loadEvent.target.result ? loadEvent.target.result : defaultAvatar;
            avatarPreview.attr("src", resultado);
            avatarShell.removeClass("is-fallback");
            actualizar_imagen_perfil(file, avatarAnterior);
        };
        reader.readAsDataURL(file);
    }

    function actualizar_imagen_perfil(file, avatarAnterior) {
        const formData = new FormData();
        formData.append("backend", "actualizar_imagen");
        formData.append("foto", file);

        $.ajax({
            type: "POST",
            url: URL_BACKEND_PERFIL,
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (response) {
                if (response && response.success) {
                    mostrar_alerta_perfil({
                        title: response.alert ? response.alert.title : "Imagen actualizada",
                        text: response.message || "La foto de perfil se actualizo correctamente.",
                        icon: response.alert ? response.alert.icon : "success",
                    });

                    avatarInput.val("");
                    extraer_datos_usuario();
                    return;
                }

                avatarPreview.attr("src", avatarAnterior);
                inicializar_avatar();
                avatarInput.val("");

                mostrar_alerta_perfil({
                    title: response && response.alert ? response.alert.title : "Error",
                    text: response && response.message ? response.message : "No se pudo actualizar la foto de perfil.",
                    icon: response && response.alert ? response.alert.icon : "error",
                });
            },
            error: function () {
                avatarPreview.attr("src", avatarAnterior);
                inicializar_avatar();
                avatarInput.val("");

                mostrar_alerta_perfil({
                    title: "Backend pendiente",
                    text: "El frontend ya envia la imagen, pero el endpoint aun no esta conectado.",
                    icon: "info",
                });
            },
        });
    }

    function validar_archivo_avatar(file) {
        const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "";
        const esMimeValido = AVATAR_MIME_TYPES.includes(file.type);
        const esExtensionValida = AVATAR_EXTENSIONS.includes(extension);

        if (!esMimeValido || !esExtensionValida) {
            mostrar_alerta_perfil({
                title: "Formato invalido",
                text: "La imagen debe ser JPG, PNG o WEBP.",
                icon: "warning",
            });
            return false;
        }

        if (file.size > MAX_AVATAR_SIZE_BYTES) {
            mostrar_alerta_perfil({
                title: "Archivo demasiado grande",
                text: "La foto de perfil no puede superar los 5 MB.",
                icon: "warning",
            });
            return false;
        }

        return true;
    }

    function inicializar_avatar() {
        avatarPreview
            .off("error.profileAvatar load.profileAvatar")
            .on("error.profileAvatar", function () {
                avatarShell.addClass("is-fallback");
            })
            .on("load.profileAvatar", function () {
                avatarShell.removeClass("is-fallback");
            });

        if (!avatarPreview.attr("src")) {
            avatarPreview.attr("src", defaultAvatar);
        }
    }

    // **************************************************************************************
    // ******************************* UTILIDADES ********************************************
    function limpiar_validacion_formulario(formulario) {
        formulario.removeClass("was-validated");
        formulario.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
    }

    function restaurar_formulario() {
        $("#profile_nombre").val(valoresIniciales.nombre);
        $("#profile_apellido").val(valoresIniciales.apellido);
        $("#profile_email").val(valoresIniciales.email);
        $("#profile_telefono").val(valoresIniciales.telefono);
        $("#profile_usuario").val(valoresIniciales.usuario);
        avatarPreview.attr("src", valoresIniciales.avatar);
        avatarInput.val("");

        limpiar_campos_password();
        inicializar_avatar();
    }

    function limpiar_campos_password() {
        inputPasswordActual.val("");
        inputPasswordNueva.val("");
        inputPasswordConfirmacion.val("");
        actualizar_indicador_password();
        validar_coincidencia_passwords();
    }

    function obtener_valores_iniciales() {
        return {
            nombre: $("#profile_nombre").val() || "",
            apellido: $("#profile_apellido").val() || "",
            email: $("#profile_email").val() || "",
            telefono: $("#profile_telefono").val() || "",
            usuario: $("#profile_usuario").val() || "",
            avatar: avatarPreview.attr("src") || defaultAvatar,
        };
    }

    function calcular_seguridad_password(password) {
        let score = 0;

        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        if (!password.length) {
            return { width: 0, label: "sin definir", className: "bg-danger" };
        }

        if (score <= 2) {
            return { width: 30, label: "baja", className: "bg-danger" };
        }

        if (score === 3) {
            return { width: 55, label: "media", className: "bg-warning" };
        }

        if (score === 4) {
            return { width: 78, label: "buena", className: "bg-info" };
        }

        return { width: 100, label: "alta", className: "bg-success" };
    }
});
