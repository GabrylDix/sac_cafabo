<!DOCTYPE html>
<html lang="es">

<head>
    <!-- Bootstrap 5.3 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
    <!--Swiper slider css-->
    <link href="https://shr.ddaval.com.ar/Velzon/material/assets/libs/swiper/swiper-bundle.min.css" rel="stylesheet" type="text/css" />
    <!-- Sweet Alert css-->
    <link href="https://shr.ddaval.com.ar/Velzon/material/assets/libs/sweetalert2/sweetalert2.min.css" rel="stylesheet" type="text/css" />
    <link href="public/css/login.css" rel="stylesheet" type="text/css" />
<!-- App Css-->
</head>

<body>

    <div class="login-card-wrapper animate-fade-in">
        
        <!-- ==========================================
             COLUMNA IZQUIERDA: MARCA E IMAGEN DE FONDO
             ========================================== -->
        <div class="brand-side">
            <div class="brand-content-wrapper">
                
                <div class="logo-box">
                    <img src="public/images/icon/audibaires_logo.png" alt="SAC Logo" class="logo-img">
                    <span class="logo-text">SAC</span>
                </div>

                <div class="my-5">
                    <h2 class="brand-main-title">Bienvenido al Sistema Administrativo de Cámaras</h2>
                    <p class="brand-description">
                        El SAC es una solución tecnológica diseñada para centralizar, controlar y optimizar el ciclo completo de la gestión administrativa de las Cámaras..
                    </p>
                </div>

                <div class="brand-footer">
                    © 2026 AudiBaires. Todos los derechos reservados.
                </div>

            </div>
        </div>

        <!-- ==========================================
             COLUMNA DERECHA: FORMULARIO DE ACCESO PURO
             ========================================== -->
        <div class="form-side">
            
            <div class="form-header">
                <h1 class="form-title">Iniciar Sesión</h1>
                <p class="form-subtitle">Ingrese sus credenciales para acceder al sistema</p>
            </div>

            <!-- Contenedor para inyectar alertas in-app -->
            <div id="alertContainer"></div>

            <form id="sacLoginForm" novalidate>
                
                <!-- Campo: Usuario -->
                <div class="form-group-custom">
                    <label for="userInput" class="form-label-custom">Usuario</label>
                    <div class="input-wrapper-custom">
                        <span class="input-custom-icon"><i class="bi bi-person"></i></span>
                        <input type="text" id="userInput" class="input-custom" placeholder="Ingrese su usuario" required autocomplete="username">
                    </div>
                </div>

                <!-- Campo: Contraseña -->
                <div class="form-group-custom">
                    <label for="passInput" class="form-label-custom">Contraseña</label>
                    <div class="input-wrapper-custom">
                        <span class="input-custom-icon"><i class="bi bi-lock"></i></span>
                        <input type="password" id="passInput" class="input-custom" placeholder="Ingrese su contraseña" required autocomplete="current-password">
                        <button type="button" class="password-toggle-btn" id="togglePass">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </div>

                <!-- Opciones (Recordar y Olvidó) -->
                <div class="options-row">
                    <div class="d-flex align-items-center gap-2">
                        <input type="checkbox" id="rememberMe" class="form-check-input custom-checkbox m-0">
                        <label for="rememberMe" class="checkbox-label-text">Recordar sesión</label>
                    </div>
                    <!-- <a href="#" class="forgot-password-link">¿Olvidó su contraseña?</a> -->
                </div>

                <!-- Botón de Envío -->
                <button type="submit" class="btn-submit-premium">
                    <span class="btn-text">Ingresar</span>
                    <div class="spinner-border spinner-border-sm d-none" id="loader" role="status"></div>
                </button>

            </form>

            <!-- Soporte Técnico Centrado -->
            <!-- <div class="text-center support-footer">
                ¿Necesita ayuda? <a href="#" class="support-link">Contacte a soporte</a>
            </div> -->

        </div>

    </div>

    <!-- Contenedor flotante de notificaciones Toasts de Bootstrap -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1060;">
        <div id="successToast" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-check-circle-fill me-2" id="toastIcon"></i>
                    <span id="toastMessage">Operación exitosa</span>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
            </div>
        </div>
    </div>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <!-- Boostrap --> 
     <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
    <!-- Sweet Alerts js -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/sweetalert2/sweetalert2.min.js"></script>
    <!-- Sweet alert init js-->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/js/pages/sweetalerts.init.js"></script>
    <script src="public/js/auth/login.js"></script>
</body>
    
</html>