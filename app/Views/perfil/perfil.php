<section class="d-flex flex-column gap-4" id="profile_page" data-default-avatar="public/images/user.png">
    <div class="profile-hero">
        <span class="profile-chip mb-3 text-white">
            <i class="bi bi-shield-check"></i>
            Panel de perfil
        </span>
        <div class="row g-4 align-items-end">
            <div class="col-xl-8">
                <h2 class="mb-2">Gestiona tus datos personales y accesos</h2>
                <p class="mb-0 text-white text-opacity-75">
                    Actualiza tu informacion basica, administra tu acceso y manten tus datos personales al dia dentro del sistema.
                </p>
            </div>
            <div class="col-xl-4">
                <div class="profile-hero-stats mt-3 mt-xl-0">
                    <div class="profile-hero-stat">
                        <div class="profile-hero-label">Usuario</div>
                        <div class="profile-hero-value fs-5 text-white" id="profile_header_usuario">-</div>
                    </div>
                    <div class="profile-hero-stat">
                        <div class="profile-hero-label">Rol</div>
                        <div class="profile-hero-value fs-5 text-white" id="profile_header_rol">-</div>
                    </div>
                    <div class="profile-hero-stat">
                        <div class="profile-hero-label">Estado</div>
                        <div class="profile-hero-value fs-5 text-white">Activo</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="profile_form" class="profile-form" novalidate>
        <div class="row g-4 align-items-start">
            <aside class="col-12 col-xl-4 col-xxl-3">
                <div class="card border-0 shadow-sm profile-card card-custom">
                    <div class="card-body p-4 text-center">
                        <div class="profile-avatar-shell mx-auto mb-4" id="profile_avatar_shell">
                            <img
                                src=<?php echo $_SESSION['auth_data']['imagen'] ? "public/uploads/perfiles/" . $_SESSION['auth_data']['imagen'] : "public/images/user.png"; ?>
                                alt="Avatar del usuario"
                                class="profile-avatar"
                                id="profile_avatar_preview">
                            <div class="profile-avatar-fallback" id="profile_avatar_fallback">US</div>
                            <button type="button" class="profile-avatar-edit" id="profile_avatar_button" aria-label="Cambiar foto">
                                <i class="bi bi-camera"></i>
                            </button>
                            <input type="file" id="profile_avatar_input" class="d-none" accept="image/*">
                        </div>

                        <div class="profile-meta text-center">
                            <h3 class="h4 mb-1" id="profile_nombre_completo_texto">Usuario</h3>
                            <p class="text-muted mb-2" id="profile_rol_texto">-</p>
                            <p class="text-muted" id="profile_username_texto">-</p>
                        </div>

                        <div class="d-grid mt-4">
                            <button type="button" class="btn btn-soft-primary" id="profile_upload_button">
                                <i class="bi bi-cloud-upload me-2"></i>Subir nueva foto
                            </button>
                        </div>

                    </div>
                </div>
            </aside>

            <div class="col-12 col-xl-8 col-xxl-9 d-flex flex-column gap-4">
                <div class="card border-0 shadow-sm profile-card card-custom">
                    <div class="card-header bg-transparent border-0 p-4 pb-0">
                        <div class="d-flex align-items-center gap-2 profile-section-heading">
                            <i class="bi bi-file-text text-primary fs-5"></i>
                            <div>
                                <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Informacion personal</h3>
                                <p class="text-muted mb-0">Campos simples para edicion rapida del perfil.</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-4 pt-4">
                        <form id="form_perfil_datos" novalidate>
                            <div class="row g-3">
                                <div class="col-12 col-md-6">
                                    <label for="profile_nombre" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-person-vcard me-1"></i>Nombre
                                    </label>
                                    <input type="text" class="form-control" id="profile_nombre" name="nombre" value="" placeholder="Ingrese su nombre" required>
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="profile_apellido" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-person-vcard me-1"></i>Apellido
                                    </label>
                                    <input type="text" class="form-control" id="profile_apellido" name="apellido" value="" placeholder="Ingrese su apellido" required>
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="profile_email" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-envelope-at me-1"></i>Correo electronico
                                    </label>
                                    <input type="email" class="form-control" id="profile_email" name="email" value="" placeholder="usuario@dominio.com">
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="profile_telefono" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-telephone me-1"></i>Telefono
                                    </label>
                                    <input type="text" class="form-control" id="profile_telefono" name="telefono" value="" placeholder="Ingrese un telefono de contacto">
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="profile_usuario" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-person-badge me-1"></i>Usuario
                                    </label>
                                    <input type="text" class="form-control" id="profile_usuario" name="usuario" value="" placeholder="Nombre de usuario" readonly>
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="profile_rol" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-diagram-3 me-1"></i>Rol
                                    </label>
                                    <input type="text" class="form-control" id="profile_rol" value="" readonly>
                                </div>
                                <!-- <div class="col-12">
                                <label for="profile_bio" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-chat-left-text me-1"></i>Descripcion breve
                                </label>
                                <input type="text" class="form-control" id="profile_bio" name="bio" placeholder="Agrega una descripcion corta de tu perfil o sector">
                            </div> -->
                                <div class="col-12">
                                    <div class="d-flex flex-column flex-md-row justify-content-end gap-2 pt-2">
                                        <button type="button" class="btn btn-light" id="profile_cancel_button">
                                            <i class="bi bi-x-circle me-1"></i>Cancelar
                                        </button>
                                        <button type="button" class="btn btn-primary" id="btnGuardarPerfilDatos">
                                            <i class="bi bi-save me-1"></i>Guardar datos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="card border-0 shadow-sm profile-card card-custom">
                    <div class="card-header bg-transparent border-0 p-4 pb-0">
                        <div class="d-flex align-items-center gap-2 profile-section-heading">
                            <i class="bi bi-shield-lock text-primary fs-5"></i>
                            <div>
                                <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Seguridad y contrasena</h3>
                                <p class="text-muted mb-0">Administra tu contrasena y valida la seguridad de tus credenciales.</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-4 pt-4">
                        <form id="form_perfil_password" novalidate>
                            <div class="row g-3">
                                <div class="col-12">
                                    <label for="profile_current_password" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-key me-1"></i>Contrasena actual
                                    </label>
                                    <div class="input-group">
                                        <input type="password" class="form-control" id="profile_current_password" name="current_password" placeholder="Ingrese su contrasena actual" required>
                                        <button class="btn btn-outline-secondary" type="button" data-password-toggle="#profile_current_password" aria-label="Mostrar u ocultar contrasena actual">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="profile_new_password" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-shield-lock me-1"></i>Nueva contrasena
                                    </label>
                                    <div class="input-group">
                                        <input type="password" class="form-control" id="profile_new_password" name="new_password" placeholder="Nueva contrasena" required>
                                        <button class="btn btn-outline-secondary" type="button" data-password-toggle="#profile_new_password" aria-label="Mostrar u ocultar nueva contrasena">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                    <div class="profile-password-meter mt-3">
                                        <div class="progress">
                                            <div class="progress-bar" id="profile_password_strength_bar" role="progressbar" style="width: 0%;"></div>
                                        </div>
                                        <div class="small text-muted mt-2" id="profile_password_strength_text">Seguridad de contrasena: sin definir</div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="profile_confirm_password" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-check2-square me-1"></i>Confirmar nueva contrasena
                                    </label>
                                    <div class="input-group">
                                        <input type="password" class="form-control" id="profile_confirm_password" name="confirm_password" placeholder="Repita la nueva contrasena" required>
                                        <button class="btn btn-outline-secondary" type="button" data-password-toggle="#profile_confirm_password" aria-label="Mostrar u ocultar confirmacion de contrasena">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="profile-password-note mt-2 small">
                                        <i class="bi bi-info-circle-fill"></i>
                                        <div>
                                            La contrasena debe cumplir con los criterios de seguridad definidos para el acceso al sistema.
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="d-flex flex-column flex-md-row justify-content-end gap-2 pt-2">
                                        <button type="button" class="btn btn-primary" id="btnCambiarPasswordPerfil">
                                            <i class="bi bi-shield-check me-1"></i>Cambiar contrasena
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>