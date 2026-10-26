<!-- MODAL NUEVO USUARIO -->
<div id="modalNuevoUsuario" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConvenioDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-success bg-opacity-10 text-white">
                            <i class="bi bi-person-bounding-box fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Nuevo Usuario</h2>
                            <p class="text-muted mb-0">Dar de Alta un Usuario</p>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <hr class="m-0">

            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">
                <div class="pt-3">
                    <p class="text-muted text-center mb-0" style="font-size: 0.75rem;">
                        Los campos marcados con <span class="text-danger">*</span> son obligatorios.
                    </p>
                </div>
                <form id="form_nuevoUsuario" class="needs-validation" autocomplete="off" novalidate>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-file-text text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información Principal</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="nombre_nuevoUsuario" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-person-vcard me-1"></i>Nombre <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="nombre_nuevoUsuario" class="form-control" placeholder="Ingrese un Nombre" required>
                                <div class="invalid-feedback">Debes ingresar un Nombre</div>
                            </div>
                            <div class="col-md-4">
                                <label for="apellido_nuevoUsuario" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-person-vcard me-1"></i>Apellido <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="apellido_nuevoUsuario" class="form-control" placeholder="Ingrese Apellido" required>
                                <div class="invalid-feedback">Debes ingresar un Apellido</div>
                            </div>
                            <div class="col-md-4">
                                <label for="telefono_nuevoUsuario" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-telephone me-1"></i>Telefono
                                </label>
                                <input type="text" id="telefono_nuevoUsuario" class="form-control" placeholder="Ingrese Telefono">
                                <div class="invalid-feedback">Debes ingresar un Telefono</div>
                            </div>
                        </div>
                        <div class="row g-3 mt-1">
                             <div class="col-md-6">
                                <label for="usuario_nuevoUsuario" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-person-badge me-1"></i>Usuario <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="usuario_nuevoUsuario" class="form-control" placeholder="Ingrese un Usuario" required>
                                <div class="invalid-feedback">Ingrese un Usuario</div>
                            </div>
                            <div class="col-md-6">
                                <label for="email_nuevoUsuario" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-envelope-at me-1"></i>E-mail
                                </label>
                                <input type="email" id="email_nuevoUsuario" class="form-control" placeholder="Ingrese un E-MAIL">
                                <div class="invalid-feedback">Ingrese un Email valido</div>
                            </div>
                        </div>
                        <div class="row g-3 mt-1">
                            <div class="col-md-6">
                                <label for="password_nuevoUsuario" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-key me-1"></i>Contraseña <span class="text-danger">*</span>
                                </label>
                                
                                <div class="input-group">
                                    <input type="password" id="password_nuevoUsuario" class="form-control" placeholder="Ingrese una Contraseña" required>
                                    
                                    <button class="btn btn-outline-secondary" type="button" id="eyePassword">
                                        <i class="bi bi-eye-slash" id="toggleIcon"></i> 
                                    </button>
                                    
                                    <div class="invalid-feedback">Ingrese una Contraseña</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="rol_nuevoUsuario" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-map me-1"></i>ROL <span class="text-danger">*</span>
                                </label>
                                <select id="rol_nuevoUsuario" class="form-select" required>
                                </select>
                                <div class="invalid-feedback">Seleccione un Rol</div>
                            </div>
                        </div>
                    </section>

                    <hr>
                </form>
                <div class="pt-3">
                    <p class="text-muted text-center mb-0" style="font-size: 0.75rem;">
                        Los datos mostrados en este formulario son editables.<br>
                        Los campos marcados con <span class="text-danger">*</span> son obligatorios.
                    </p>
                </div>
            </div>

            <div class="modal-footer border-0 justify-content-end mt-2">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-success" id="btnGuardar_nuevoUsuario">
                    <i class="bi bi-folder-symlink me-1"></i> Guardar Usuario
                </button>
            </div>
        </div>
    </div>
</div>
