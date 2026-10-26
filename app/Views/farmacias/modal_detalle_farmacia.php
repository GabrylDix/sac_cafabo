<div id="modalDetalleFarmacia" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <!-- Header -->
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="p-3 rounded-3 bg-primary bg-opacity-10 text-white">
                            <i class="bi bi-house-heart fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="nombreFarmacia_detalleFarmacia"></h2>
                            <p class="text-muted mb-0">Información de la Farmacia</p>
                        </div>
                    </div>
                    <span id="badge_estado_detalleFarmacia" class="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 me-5 px-4 py-2 fs-6 fw-medium">
                        <i class="bi bi-check-circle me-2"></i>
                        <span id="estado_texto_detalleFarmacia"></span>
                    </span>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <hr class="m-0">

            <!-- Content -->
            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">

                <!-- Información Fiscal -->
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-file-text text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información Principal</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-card-text me-1"></i>Código Farmacia
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cod_farma_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-cc-square me-1"></i>CUF
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cuf_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-credit-card-2-front me-1"></i>CUIT
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cuit_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-123 me-1"></i>Codigo PAMI
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="codPami_detalleFarmacia">—</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mt-1">
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-shop-window me-1"></i>Razon Social
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="razonSocial_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-spellcheck me-1"></i>Nombre
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="nombre_detalleFarmacia">—</p>
                            </div>
                        </div>
                    </div>
                </section>
                <hr>
                <!-- Ubicación -->
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-geo-alt text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Ubicación</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-signpost me-1"></i>Dirección
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="direccion_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-map me-1"></i>Provincia
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="prov_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-pin-map me-1"></i>Localidad
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="localidad_detalleFarmacia">—</p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr>

                <!-- Contacto -->
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-telephone text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información de Contacto</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-phone me-1"></i>Teléfono
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="telf_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-envelope-at me-1"></i>Email
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="email_detalleFarmacia">—</p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr>

                <!-- Datos Bancarios -->
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-bank text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">DATOS BANCARIOS</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-123 me-1"></i>CBU
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cbu_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-spellcheck me-1"></i>ALIAS
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cbuAlias_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-123 me-1"></i>CBU N° CUENTA
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cbuNroCuenta_detalleFarmacia">—</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mt-1">
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-123 me-1"></i>CVU
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cvu_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-spellcheck me-1"></i>ALIAS
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cvuAlias_detalleFarmacia">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-123 me-1"></i>CVU N° CUENTA
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="cvuNroCuenta_detalleFarmacia">—</p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr>
                <!-- Convenios Habilitados -->
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-journal-check text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">CONVENIOS HABILITADOS</h3>
                    </div>
                    <div class="row g-2">
                        <table id="datatable_farmaciaConvenios_detalleFarmacia" class="table table-bordered table-striped dt-responsive nowrap w-100">
                    
                        </table>
                    </div>
                </section>
                <hr>
                <!-- EXTRA -->
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-calendar-event text-primary "></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">EXTRAS</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-clipboard2-pulse me-1"></i>Observaciones
                            </label>

                            <textarea class="form-control" style="resize:none" rows="5" maxlength="250" id="observ_detalleFarmacia" disabled></textarea>
                            <!-- <p class="mb-0 small fw-medium text-dark" id="observ_detalleFarmacia">—</p> -->

                        </div>
                    </div>
                </section>
                <!-- Footer Note -->
                <div class="pt-3">
                    <p class="text-muted text-center mb-0" style="font-size: 0.75rem;">
                        Los datos mostrados son de solo lectura.
                    </p>
                </div>

            </div>
        </div>
    </div>
</div>