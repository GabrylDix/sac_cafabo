<div id="modalConceptoAlta" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConceptoAltaLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" style="max-width: 900px;">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-white" style="width: 56px; height: 56px;">
                            <i class="bi bi-bookmark-star fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="modalConceptoAltaLabel">Nuevo Concepto</h2>
                            <p class="text-muted mb-0">Crear un concepto para utilizar en el sistema</p>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <hr class="m-0">

            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">
                <form id="formAltaConcepto" class="needs-validation" autocomplete="off" novalidate>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-card-text text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Datos del Concepto</h3>
                        </div>

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="descripcion_concepto_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-type me-1"></i>Descripcion <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="descripcion_concepto_alta" class="form-control" placeholder="Ingrese la descripcion del concepto" maxlength="150" required>
                                <div class="invalid-feedback">Ingrese una descripcion para el concepto.</div>
                            </div>
                            <div class="col-md-6">
                                <label for="cuenta_contable_concepto_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-diagram-3 me-1"></i>Cuenta Contable <span class="text-danger">*</span>
                                </label>
                                <select id="cuenta_contable_concepto_alta" class="form-select" required>
                                    <option value="" selected disabled>Seleccione una cuenta contable</option>
                                </select>
                                <div class="invalid-feedback">Seleccione una cuenta contable.</div>
                            </div>
                        </div>
                    </section>

                </form>

                <hr>

                <div class="pt-1">
                    <p class="text-muted text-center mb-0" style="font-size: 0.75rem;">
                        Los campos marcados con <span class="text-danger">*</span> son obligatorios.
                    </p>
                </div>
            </div>

            <div class="modal-footer border-0 justify-content-end mt-2">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-success" id="btnConfirmarAltaConcepto">
                    <i class="bi bi-check-circle me-1"></i> Guardar Cambios
                </button>
            </div>
        </div>
    </div>
</div>
