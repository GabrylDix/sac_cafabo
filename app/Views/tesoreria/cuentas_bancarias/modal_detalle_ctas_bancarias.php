<!-- MODAL DETALLE CUENTAS BANCARIAS -->
<div id="modalDetalleCtaBancaria" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConvenioDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-primary bg-opacity-10 text-white">
                            <i class="bi bi-building-gear fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="nombreCtaBancaria_detalleCtaBancaria"></h2>
                            <p class="text-muted mb-0">Informacion de la Cuenta Bancaria</p>
                        </div>
                    </div>
                    <span id="badge_estado_detalleCtaBancaria" class="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 me-5 px-4 py-2 fs-6 fw-medium">
                        <i class="bi bi-check-circle me-2"></i>
                        <span id="estado_texto_detalleCtaBancaria"></span>
                    </span>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <hr class="m-0">
            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-bank text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Datos Bancarios</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-cc-square me-1"></i>Nombre Banco
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="nombrebanco_detalleCtaBancaria">—</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-cc-square me-1"></i>Nro. Cuenta
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="nroCta_detalleCtaBancaria">—</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mt-1">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-cc-square me-1"></i>CBU
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cbuCta_detalleCtaBancaria">—</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-cc-square me-1"></i>ALIAS
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="aliasCta_detalleCtaBancaria">—</p>
                            </div>
                        </div>
                    </div>  
                </section>
                <hr>
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-journal-text text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Contabilidad</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-diagram-3 me-1"></i>Cuenta Contable
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cuentaContable_detalleCtaBancaria">-</p>
                            </div>
                        </div>
                    </div>
                </section>
                <hr>
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-clipboard-check text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Auditoria</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-person-badge me-1"></i>Registrado por
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="usuario_creacion_detalleCtaBancaria">—</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-calendar-check me-1"></i>Fecha de Alta
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="fecha_creacion_detalleCtaBancaria">—</p>
                            </div>
                        </div>
                    </div>
                </section>
                <div class="pt-3">
                    <p class="text-muted text-center mb-0" style="font-size: 0.75rem;">
                        Los datos mostrados son de solo lectura. Para realizar cambios, contacte al administrador del sistema.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
