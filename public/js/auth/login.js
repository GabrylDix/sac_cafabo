$(document).ready(function () {
    const $alertContainer = $('#alertContainer');
    const $rememberMe = $('#rememberMe');
    const $username = $('#userInput');
    const $password = $('#passInput');
    
    // Estado local para el control de recordar usuario
    let state = {
        rememberMe: localStorage.getItem('rememberMe') === 'true'
    };

    // Carga inicial del usuario si estaba recordado
    loadRememberedUser();

    // Asignación de evento de cambio para recordar sesión (una sola vez al inicio)
    $rememberMe.on('change', rememberUser);

    // Visibilidad de contraseña
    $('#togglePass').on('click', function() {
        const input = $('#passInput');
        const icon = $(this).find('i');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('bi-eye').addClass('bi-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('bi-eye-slash').addClass('bi-eye');
        }
    });

    // Botón de Iniciar Sesión y Envío de Formulario
    $('#sacLoginForm').on('submit', function(e) {
        e.preventDefault();
        
        let username = $username.val().trim();
        let password = $password.val();
        
        const $btn = $('.btn-submit-premium');
        const $text = $('.btn-text');
        const $loader = $('#loader');

        // Validaciones básicas de cliente antes de enviar al backend
        if (username === "" || password === "") {
            showAlert('Por favor, complete todos los campos de acceso.', 'warning');
            showToast('Campos incompletos', 'warning');
            return;
        }

        // Si el checkbox está activo, guardamos las credenciales en el almacenamiento local
        if ($rememberMe.is(':checked')) {
            localStorage.setItem('rememberedUser', username);
            localStorage.setItem('rememberMe', 'true');
        }

        $btn.prop('disabled', true);
        $text.addClass('d-none');
        $loader.removeClass('d-none');

        $.ajax({
            url: 'app/Controllers/Auth/Auth_backend.php',
            type: 'POST',
            dataType: "json",
            data: {
                backend: "iniciar_sesion",
                username: username, 
                password: password
            },
            success: function(response) {
                if (response.success) {
                    showAlert('Inicio de sesión exitoso. Accediendo...', 'success');
                    showToast('¡Bienvenido de nuevo!', 'success');

                    $btn.css('background', 'linear-gradient(135deg, #10b981 0%, #059669 100%)');
                    $btn.css('border', 'none');
                    $loader.addClass('d-none');
                    $btn.html('<i class="bi bi-check-lg me-1"></i> Accediendo...');
                    
                    //animación de éxito antes del reload
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 800);
                } else {
                    // Restauramos la interfaz y mostramos el error personalizado del servidor
                    showAlert('Error al iniciar sesión. Verifique sus datos.', 'danger');
                    showToast('Acceso denegado', 'danger');
                    restoreUI();
                }
            },
            error: function() {
                restoreUI();
                Swal.fire({
                    title: "Error de Conexión",
                    text: "No se pudo establecer comunicación con el servidor. Intente más tarde.",
                    icon: "error",
                    confirmButtonClass: "btn btn-info w-xs",
                    buttonsStyling: false
                });
            }
        });

        // Función auxiliar interna para resetear el botón de submit
        function restoreUI() {
            $btn.prop('disabled', false);
            $text.removeClass('d-none');
            $loader.addClass('d-none');
        }
    });

    // ==========================================================================
    // Funcion (Recordar Usuario)
    // ==========================================================================
    function rememberUser() {
        state.rememberMe = $(this).is(':checked');
        if (!state.rememberMe) {
            localStorage.removeItem('rememberedUser');
            localStorage.removeItem('rememberMe');
        }
    }

    function loadRememberedUser() {
        if (state.rememberMe) {
            const rememberedUser = localStorage.getItem('rememberedUser');
            if (rememberedUser) {
                $username.val(rememberedUser);
                $rememberMe.prop('checked', true);
                $password.focus(); // Enfocamos directamente en la contraseña para agilizar el ingreso
            }
        }
    }

    // Muestra una alerta sutil integrada en la tarjeta (diseñada para el fondo claro)
    function showAlert(message, type = 'success') {
        const iconMap = {
            success: 'bi-check-circle-fill text-success',
            danger: 'bi-exclamation-triangle-fill text-danger',
            warning: 'bi-exclamation-circle-fill text-warning',
            info: 'bi-info-circle-fill text-info'
        };

        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show mb-3 shadow-sm border-0 d-flex align-items-center justify-content-between" role="alert" style="background-color: #ffffff; border-left: 4px solid var(--accent-color, #007ec1) !important;">
                <div class="d-flex align-items-center">
                    <i class="bi ${iconMap[type]} me-2 fs-5"></i>
                    <span class="text-dark fw-medium" style="font-size: 0.85rem;">${message}</span>
                </div>
                <button type="button" class="btn-close" style="font-size: 0.75rem;" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        $alertContainer.html(alertHtml);

        // Auto-dismiss de la alerta interna después de 5 segundos (solo para éxitos o informativas)
        if (type === 'success' || type === 'info') {
            setTimeout(clearAlerts, 5000);
        }
    }

    function showToast(message, type = 'success') {
        const $toast = $('#successToast');
        const $message = $('#toastMessage');
        const $icon = $('#toastIcon');

        const icons = {
            success: 'bi-check-circle-fill',
            danger: 'bi-x-octagon-fill',
            warning: 'bi-exclamation-triangle-fill'
        };

        // Removemos clases sólidas anteriores de Bootstrap
        $toast.removeClass('text-bg-success text-bg-danger text-bg-warning text-bg-secondary');
        
        // Asignamos el estilo según el tipo (éxito utiliza celeste/azul o los estándares de Bootstrap)
        if (type === 'success') {
            $toast.addClass('text-bg-info text-white'); // El info es celeste
        } else if (type === 'danger') {
            $toast.addClass('text-bg-danger');
        } else {
            $toast.addClass('text-bg-warning');
        }
        
        $message.text(message);

        // Reseteamos el icono
        $icon.removeClass('bi-check-circle-fill bi-x-octagon-fill bi-exclamation-triangle-fill');
        $icon.addClass(icons[type] || 'bi-info-circle-fill');

        // Mostramos el Toast nativo mediante la API de Bootstrap 5
        const toast = new bootstrap.Toast($toast[0]);
        toast.show(); 
    }

    function clearAlerts() {
        $alertContainer.empty();
    }
});
