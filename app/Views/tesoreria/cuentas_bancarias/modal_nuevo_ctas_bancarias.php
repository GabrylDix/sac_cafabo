<!-- MODAL NUEVA CUENTA BANCARIA -->
<div id="modalNuevaCuentaBancaria" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConvenioDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-success bg-opacity-10 text-white">
                            <i class="bi bi-bank fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Nueva Cuenta Bancaria</h2>
                            <p class="text-muted mb-0">Dar de Alta una Cuenta Bancaria</p>
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
                <form id="form_nuevaCtaBancaria" class="needs-validation" autocomplete="off" novalidate>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <!-- Icono de Billetera/Finanzas -->
                            <i class="bi bi-bank text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Datos Bancarios</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="banco_nuevaCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <!-- Icono de Banco alternativo -->
                                    <i class="bi bi-bank2 me-1"></i>Banco <span class="text-danger">*</span>
                                </label>
                                <select id="banco_nuevaCtaBancaria" class="form-select" required>
                                </select>
                                <div class="invalid-feedback">Seleccione un Banco</div>
                            </div>
                            <div class="col-md-4">
                                <label for="nroCuenta_nuevaCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <!-- Icono de cuenta / ahorro -->
                                    <i class="bi bi-piggy-bank me-1"></i>Nro. Cuenta <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="nroCuenta_nuevaCtaBancaria" class="form-control" placeholder="Ingrese el Nro. de Cuenta" required>
                                <div class="invalid-feedback">Debes ingresar un Nro. de Cuenta</div>
                            </div>
                            <div class="col-md-4">
                                <label for="nombreCuenta_nuevaCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <!-- Icono de etiqueta o texto de tarjeta -->
                                    <i class="bi bi-card-text me-1"></i>Nombre Cuenta <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="nombreCuenta_nuevaCtaBancaria" class="form-control" placeholder="Ingrese Nombre Cuenta" required>
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
                                <label for="cuenta_contable_nuevaCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-diagram-3 me-1"></i>Cuenta Contable
                                </label>
                                <select id="cuenta_contable_nuevaCtaBancaria" class="form-select">
                                </select>
                            </div>
                        </div>
                    </section>
                    <hr>
                    <section class="mb-4">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="cbu_nuevaCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <!-- Icono de números (ya que el CBU es estrictamente numérico) -->
                                    <i class="bi bi-123 me-1"></i>CBU <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="cbu_nuevaCtaBancaria" class="form-control" placeholder="Ingrese CBU" minlength="22" maxlength="22" required>
                                <div class="invalid-feedback">Debes ingresar un CBU (22 Dígitos) válido</div>
                            </div>
                            <div class="col-md-6">
                                <label for="alias_nuevaCtaBancaria" class="form-label text-muted fw-medium small mb-1">
                                    <!-- Icono de Arroba (representativo para aliases como juan.perez.banco) -->
                                    <i class="bi bi-at me-1"></i>ALIAS <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="alias_nuevaCtaBancaria" class="form-control" placeholder="Ingrese ALIAS" required>
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
                <button type="button" class="btn btn-success" id="btnGuardarCtaBancaria">
                    <i class="bi bi-save me-1"></i> Guardar Cuenta Bancaria
                </button>
            </div>
        </div>
    </div>
</div>
