<!-- MODAL EDITAR CUENTAS BANCARIAS -->
<div id="modalEditarCtaBancaria" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConvenioDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-primary bg-opacity-10 text-white">
                            <i class="bi bi-building-gear fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Editar Cuenta Bancaria</h2>
                            <p class="text-muted mb-0">Modificar datos de la Cuenta Bancaria</p>
                        </div>
                    </div>
                    <span id="badge_estado_editarCtaBancaria" class="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 me-5 px-4 py-2 fs-6 fw-medium">
                        <i class="bi bi-check-circle me-2"></i>
                        <span id="estado_texto_editarCtaBancaria"></span>
                    </span>
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
                <form id="form_editarCtaBancaria" class="needs-validation" autocomplete="off" novalidate>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-bank text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Datos Bancarios</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="banco_editarCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-bank2 me-1"></i>Banco <span class="text-danger">*</span>
                                </label>
                                <select id="banco_editarCtaBancaria" class="form-select" required>
                                </select>
                                <div class="invalid-feedback">Seleccione un Banco</div>
                            </div>
                            <div class="col-md-4">
                                <label for="nroCta_editarCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-piggy-bank me-1"></i>Nro. Cuenta <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="nroCta_editarCtaBancaria" class="form-control" placeholder="Ingrese el Nro. de Cuenta" required>
                                <div class="invalid-feedback">Debes ingresar un Nro. de Cuenta</div>
                            </div>
                            <div class="col-md-4">
                                <label for="nombreCta_editarCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-card-text me-1"></i>Nombre Cuenta <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="nombreCta_editarCtaBancaria" class="form-control" placeholder="Ingrese Nombre Cuenta" required>
                                <div class="invalid-feedback">Debes ingresar un Nombre Cuenta</div>
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
                                <label for="cuenta_contable_editarCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-diagram-3 me-1"></i>Cuenta Contable
                                </label>
                                <select id="cuenta_contable_editarCtaBancaria" class="form-select">
                                </select>
                            </div>
                        </div>
                    </section>
                    <hr>
                    <section class="mb-4">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="cbuCta_editarCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-123 me-1"></i>CBU <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="cbuCta_editarCtaBancaria" class="form-control" placeholder="Ingrese CBU" minlength="22" maxlength="22" required>
                                <div class="invalid-feedback">Debes ingresar un CBU (22 Dígitos) válido</div>
                            </div>
                            <div class="col-md-6">
                                <label for="aliasCta_editarCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-at me-1"></i>ALIAS <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="aliasCta_editarCtaBancaria" class="form-control" placeholder="Ingrese ALIAS" required>
                                <div class="invalid-feedback">Ingrese un ALIAS</div>
                            </div>
                        </div>
                    </section>
                </form>
                <div class="pt-3">
                    <p class="text-muted text-center mb-0" style="font-size: 0.75rem;">
                        Los datos mostrados en este formulario son editables.<br>
                        Los campos marcados con <span class="text-danger">*</span> son obligatorios.
                    </p>
                </div>
            </div>

            <div class="modal-footer border-0 justify-content-end mt-2">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Cancelar
                </button>
                <button type="button" class="btn btn-success" id="btnConfirmarEditarCtaBancaria">
                    <i class="bi bi-save me-1"></i> Guardar Proveedor
                </button>
            </div>
        </div>
    </div>
</div>
