<!-- MODAL NUEVA FARMACIA -->
<div id="modalNuevaFarmacia" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConvenioDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-success bg-opacity-10 text-white">
                            <i class="bi bi-building-add fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Nueva Farmacia</h2>
                            <p class="text-muted mb-0">Dar de Alta una Farmacia</p>
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
                <form id="form_nuevaFarmacia" class="needs-validation" autocomplete="off" novalidate>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-file-text text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información Principal</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label for="cod_farma_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-card-text me-1"></i>Código Farmacia <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="cod_farma_nuevaFarmacia" class="form-control" placeholder="Ingrese Código Farmacia" required>
                                <div class="invalid-feedback">Debes ingresar un Código Farmacia</div>
                            </div>
                            <div class="col-md-3">
                                <label for="cuf_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-cc-square me-1"></i>CUF <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="cuf_nuevaFarmacia" class="form-control" placeholder="Ingrese CUF" required>
                                <div class="invalid-feedback">Debes ingresar un CUF</div>
                            </div>
                            <div class="col-md-3">
                                <label for="cuit_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-credit-card-2-front me-1"></i>CUIT(11 Digitos) <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="cuit_nuevaFarmacia" class="form-control" minlength="11" maxlength="11" placeholder="Ingrese CUIT" required>
                                <div class="invalid-feedback">Ingrese un CUIT valido</div>
                            </div>
                            <div class="col-md-3">
                                <label for="codPami_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-123 me-1"></i>Codigo PAMI <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="codPami_nuevaFarmacia" class="form-control" placeholder="Ingrese un Codigo PAMI" required>
                                <div class="invalid-feedback">Ingrese un Código de PAMI valido</div>
                            </div>
                        </div>
                        <div class="row g-3 mt-1">
                            <div class="col-md-3">
                                <label for="razonSocial_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-shop-window me-1"></i>Razon Social <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="razonSocial_nuevaFarmacia" class="form-control" placeholder="Ingrese Razón Social" required>
                                <div class="invalid-feedback">Debes ingresar una Razón Social</div>
                            </div>
                            <div class="col-md-3">
                                <label for="nombre_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-spellcheck me-1"></i>Nombre <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="nombre_nuevaFarmacia" class="form-control" placeholder="Ingrese Nombre" required>
                                <div class="invalid-feedback">Ingrese un Nombre</div>
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
                            <div class="col-md-4">
                                <label for="cod_prov_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-map me-1"></i>Provincia <span class="text-danger">*</span>
                                </label>
                                <select id="cod_prov_nuevaFarmacia" class="form-select" required>
                                </select>
                                <div class="invalid-feedback">Seleccione una Provincia</div>
                            </div>
                            <div class="col-md-4">
                                <label for="cod_localidad_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-pin-map me-1"></i>Localidad <span class="text-danger">*</span>
                                </label>
                                <select id="cod_localidad_nuevaFarmacia" class="form-select" disabled required>
                                </select>
                                <div class="invalid-feedback">Seleccione una Localidad</div>
                            </div>
                            <div class="col-md-4">
                                <label for="direccion_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-signpost me-1"></i>Dirección <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="direccion_nuevaFarmacia" class="form-control" placeholder="Ingrese Dirección" required>
                                <div class="invalid-feedback">Ingrese una direccion</div>
                            </div>
                        </div>
                    </section>

                    <hr>

                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-telephone text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información de Contacto</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="telf_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-phone me-1"></i>Teléfono
                                </label>
                                <input type="text" id="telf_nuevaFarmacia" class="form-control" placeholder="Ingrese Teléfono">
                            </div>
                            <div class="col-md-6">
                                <label for="email_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-envelope-at me-1"></i>Email
                                </label>
                                <input type="email" id="email_nuevaFarmacia" class="form-control" placeholder="Ingrese Email">
                            </div>
                        </div>
                    </section>
                    <hr>
                    <!-- Datos Bancarios -->
                    <section class="mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-bank text-primary fs-5"></i>
                                <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Datos Bancarios</h3>
                            </div>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="cbu_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-123 me-1"></i>CBU (22 Digitos)
                                </label>
                                <input type="text" id="cbu_nuevaFarmacia" class="form-control" placeholder="Ingrese CBU" minlength="22" maxlength="22">
                            </div>
                            <div class="col-md-4">
                                <label for="cbuAlias_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-spellcheck me-1"></i>ALIAS
                                </label>
                                <input type="text" id="cbuAlias_nuevaFarmacia" class="form-control" placeholder="Ingrese ALIAS">
                            </div>
                            <div class="col-md-4">
                                <label for="cbuNroCuenta_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-123 me-1"></i>CBU N° CUENTA (13 Digitos)
                                </label>
                                <input type="text" id="cbuNroCuenta_nuevaFarmacia" class="form-control" placeholder="Ingrese Nro de Cuenta" minlength="13" maxlength="13">
                            </div>
                        </div>
                        <div class="row g-3 mt-1">
                            <div class="col-md-4">
                                <label for="cvu_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-123 me-1"></i>CVU (22 Digitos)
                                </label>
                                <input type="text" id="cvu_nuevaFarmacia" class="form-control" placeholder="Ingrese CBU" minlength="22" maxlength="22">
                            </div>
                            <div class="col-md-4">
                                <label for="cvuAlias_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-spellcheck me-1"></i>ALIAS
                                </label>
                                <input type="text" id="cvuAlias_nuevaFarmacia" class="form-control" placeholder="Ingrese ALIAS">
                            </div>
                            <div class="col-md-4">
                                <label for="cvuNroCuenta_nuevaFarmacia" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-123 me-1"></i>CVU N° CUENTA (13 Digitos)
                                </label>
                                <input type="text" id="cvuNroCuenta_nuevaFarmacia" class="form-control" placeholder="Ingrese Nro de Cuenta" minlength="13" maxlength="13">
                            </div>
                        </div>
                    </section>
                        <hr>
                    <!-- EXTRAS -->
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
                                    <i class="bi bi-clipboard2-pulse me-1"></i>Observaciones
                                </label>
                                <textarea class="form-control" style="resize:none" rows="5" maxlength="250" id="observ_nuevaFarmacia"></textarea>
                                    <!-- <p class="mb-0 small fw-medium text-dark" id="observ_detalleFarmacia">—</p> -->
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
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-success" id="btnConfirmarNuevaFarmacia">
                    <i class="bi bi-check-circle me-1"></i> Guardar Cambios
                </button>
            </div>
        </div>
    </div>
</div>
