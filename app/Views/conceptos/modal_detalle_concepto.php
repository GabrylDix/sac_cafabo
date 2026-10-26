<div id="modalConceptoDetalle" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConceptoDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-primary bg-opacity-10 text-white">
                            <i class="bi bi-bookmark-star fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="concepto_detalle_titulo">Concepto</h2>
                            <p class="text-muted mb-0">Detalles del concepto</p>
                        </div>
                    </div>
                    <span id="concepto_detalle_badge" class="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 me-5 px-4 py-2 fs-6 fw-medium">
                        <i class="bi bi-check-circle me-2"></i>
                        <span id="concepto_detalle_estado_badge">Activo</span>
                    </span>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <hr class="m-0">

            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-card-text text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Datos del Concepto</h3>
                    </div>
                    <div class="row g-3">
                        <!-- <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-hash me-1"></i>ID Concepto</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_id_concepto">-</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-toggle-on me-1"></i>Estado</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_estado_concepto">-</p>
                            </div>
                        </div> -->
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-type me-1"></i>Descripcion</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_descripcion_concepto">-</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-upc-scan me-1"></i>Codigo Cuenta</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_codigo_cuenta_concepto">-</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-diagram-3 me-1"></i>Cuenta Contable</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_nombre_cuenta_concepto">-</p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr>

                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-clock-history text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Auditoría</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-person-plus me-1"></i>Usuario Creación</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_usuario_creacion_concepto">-</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-calendar-plus me-1"></i>Fecha Creación</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_fecha_creacion_concepto">-</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-person-gear me-1"></i>Usuario Modificación</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_usuario_modificacion_concepto">-</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-calendar-check me-1"></i>Fecha Modificación</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_fecha_modificacion_concepto">-</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-person-dash me-1"></i>Usuario Eliminación</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_usuario_eliminacion_concepto">-</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1"><i class="bi bi-calendar-x me-1"></i>Fecha Eliminación</label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="detalle_fecha_eliminacion_concepto">-</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>