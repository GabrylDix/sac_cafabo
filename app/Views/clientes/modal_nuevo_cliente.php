<!-- MODAL NUEVO CLIENTE -->
<div id="modalNuevoCliente" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConvenioDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-success bg-opacity-10 text-white">
                            <i class="bi bi-person-add fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Nuevo Cliente</h2>
                            <p class="text-muted mb-0">Dar de Alta un Cliente</p>
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
                <form id="form_nuevoCliente" class="needs-validation" autocomplete="off" novalidate>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-person-vcard text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información Principal</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="razonSocial_nuevoCliente" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-building me-1"></i>Razon Social <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="razonSocial_nuevoCliente" class="form-control" placeholder="Ingrese una Razon Social" required>
                                <div class="invalid-feedback">Debes ingresar una Razon Social</div>
                            </div>
                            <div class="col-md-4">
                                <label for="nombreFantasia_nuevoCliente" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-shop me-1"></i>Nombre Fantasia <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="nombreFantasia_nuevoCliente" class="form-control" placeholder="Ingrese Nombre Fantasia" required>
                                <div class="invalid-feedback">Debes ingresar un Nombre Fantasia</div>
                            </div>
                            <div class="col-md-4">
                                <label for="cuit_nuevoCliente" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-card-heading me-1"></i>Cuit <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="cuit_nuevoCliente" class="form-control" placeholder="Ingrese Cuit" minlength="11" maxlength="11" required inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                                <div class="invalid-feedback">Debes ingresar un Cuit válido</div>
                            </div>
                        </div> 
                    </section>
                    <hr>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-geo-alt text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Ubicación</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="cod_prov_nuevoCliente" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-map me-1"></i>Provincia <span class="text-danger">*</span>
                                </label>
                                <select id="cod_prov_nuevoCliente" class="form-select" required>
                                </select>
                                <div class="invalid-feedback">Seleccione una Provincia</div>
                            </div>
                            <div class="col-md-6">
                                <label for="cod_localidad_nuevoCliente" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-pin-map me-1"></i>Localidad <span class="text-danger">*</span>
                                </label>
                                <select id="cod_localidad_nuevoCliente" class="form-select" disabled required>
                                </select>
                                <div class="invalid-feedback">Seleccione una Localidad</div>
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
                                <label for="cuenta_contable_nuevoCliente" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-diagram-3 me-1"></i>Cuenta Contable
                                </label>
                                <select id="cuenta_contable_nuevoCliente" class="form-select">
                                </select>
                            </div>
                        </div>
                    </section>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-person-lines-fill text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información de Contacto</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="telf_nuevoCliente" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-telephone me-1"></i>Teléfono <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="telf_nuevoCliente" class="form-control" placeholder="Ingrese Teléfono" minlength="10" maxlength="10" required inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                                <div class="invalid-feedback">Ingrese un Teléfono numérico</div>
                            </div>
                            <div class="col-md-6">
                                <label for="email_nuevoCliente" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-envelope-at me-1"></i>Email <span class="text-danger">*</span>
                                </label>
                                <input type="email" id="email_nuevoCliente" class="form-control" placeholder="Ingrese Email" required>
                                <div class="invalid-feedback">Ingrese un Email válido</div>
                            </div>
                        </div>
                    </section>
                    <section class="mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-card-checklist text-primary fs-5"></i>
                                <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">EXTRAS</h3>
                            </div>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-chat-left-text me-1"></i>Observaciones
                                </label>
                                <textarea class="form-control" style="resize:none" rows="4" maxlength="250" id="observ_nuevoCliente"></textarea>
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
                <button type="button" class="btn btn-success" id="btnGuardarCliente">
                    <i class="bi bi-save me-1"></i> Guardar Cliente
                </button>
            </div>
        </div>
    </div>
</div>
