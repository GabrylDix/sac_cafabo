<!-- MODAL DETALLE USUARIO -->
<div id="modalDetalleUsuario" class="modal fade" data-bs-backdrop="static" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-primary bg-opacity-10 text-white">
                            <i class="bi bi-person-vcard fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="nomyapeUsuario_detalleUsuario"></h2>
                            <p class="text-muted mb-0">Información del Usuario</p>
                        </div>
                    </div>
                    <span id="badge_estado_detalleUsuario" class="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 me-5 px-4 py-2 fs-6 fw-medium">
                        <i class="bi bi-check-circle me-2"></i>
                        <span id="estado_texto_detalleUsuario"></span>
                    </span>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- Content -->
            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-file-text text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información Principal</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-person-vcard me-1"></i>Nombre
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="nombre_detalleUsuario">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-person-vcard me-1"></i>Apellido
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="apellido_detalleUsuario">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-telephone me-1"></i>Telefono
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="telef_detalleFarmacia">—</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mt-1">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-person-badge me-1"></i>Usuario
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="username_detalleUsuario">—</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-envelope-at me-1"></i>E-mail
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="email_detalleUsuario">—</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mt-1">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-map me-1"></i>ROL
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="rol_detalleUsuario">—</p>
                            </div>
                        </div>
                    </div>
                </section>
                    <hr>
                <div class="pt-3">
                    <p class="text-muted text-center mb-0" style="font-size: 0.75rem;">
                        Los datos mostrados en este formulario no son editables.<br>
                    </p>
                </div>

            </div>
            <div class="modal-footer">
                <div class="d-flex justify-content-center gap-2">
                    <button type="button" data-bs-dismiss="modal" class="btn btn-danger">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</div>