<div id="modalCuentaContableAlta" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalCuentaContableAltaLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-success bg-opacity-10 text-white">
                            <i class="bi bi-building fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="modalCuentaContableAltaLabel">Nueva Cuenta Contable</h2>
                            <p class="text-muted mb-0">Dar de alta una cuenta contable</p>
                        </div>
                    </div>
                    <!-- <span class="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 me-5 px-4 py-2 fs-6 fw-medium">
                        <i class="bi bi-check-circle me-2"></i>
                        Activo
                    </span> -->
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
                <form id="formAltaCuentaContable" class="needs-validation" autocomplete="off" novalidate>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-file-text text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Datos de la Cuenta</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="codigo_cuenta_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-upc-scan me-1"></i>Código Cuenta <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="codigo_cuenta_alta" class="form-control" maxlength="20" placeholder="Ingrese código" required>
                                <div class="invalid-feedback">Debes ingresar el código de la cuenta.</div>
                            </div>
                            <div class="col-md-4">
                                <label for="tipo_cuenta_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-diagram-3 me-1"></i>Tipo Cuenta <span class="text-danger">*</span>
                                </label>
                                <select id="tipo_cuenta_alta" class="form-select" required>
                                    <option value="" selected disabled>Seleccione tipo</option>
                                    <option value="AC">Activo</option>
                                    <option value="PA">Pasivo</option>
                                    <option value="PN">Patrimonio Neto</option>
                                    <option value="IN">Ingreso</option>
                                    <option value="EG">Egreso</option>
                                </select>
                                <div class="invalid-feedback">Debes seleccionar un tipo de cuenta.</div>
                            </div>
                            <div class="col-md-4">
                                <label for="nombre_cuenta_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-fonts me-1"></i>Nombre Cuenta <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="nombre_cuenta_alta" class="form-control" maxlength="150" placeholder="Ingrese nombre de la cuenta" required>
                                <div class="invalid-feedback">Debes ingresar el nombre de la cuenta.</div>
                            </div>
                            <div class="col-md-12">
                                <label for="descripcion_cuenta_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-text-paragraph me-1"></i>Descripción
                                </label>
                                <textarea id="descripcion_cuenta_alta" class="form-control" rows="4" maxlength="500" placeholder="Ingrese una descripción (opcional)"></textarea>
                            </div>
                        </div>
                    </section>
                </form>

                <hr>
                <div class="pt-3">
                    <p class="text-muted text-center mb-0" style="font-size: 0.75rem;">
                        Los datos mostrados en este formulario son editables.<br>
                        Los campos marcados con <span class="text-danger">*</span> son obligatorios.
                    </p>
                </div>
            </div>

            <div class="modal-footer border-0 justify-content-end mt-2">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-success" id="btnGuardar_nuevaCuentaContable">
                    <i class="bi bi-check-circle me-1"></i> Guardar Cuenta
                </button>
            </div>
        </div>
    </div>
</div>