<div id="modalConvenioAlta" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConvenioDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-white" style="width: 56px; height: 56px;">
                            <i class="bi bi-building fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="id_nombre_alta">Nuevo Convenio</h2>
                            <p class="text-muted mb-0">Crear un Convenio</p>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <hr class="m-0">

            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">

                <form id="formAltaConvenio" class="needs-validation" autocomplete="off" novalidate>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-file-text text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información Fiscal</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label for="id_conv_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-card-text me-1"></i>Código Convenio <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="id_conv_alta" class="form-control" placeholder="Ingrese Código Convenio" required>
                            </div>
                            <div class="col-md-3">
                                <label for="id_cuit_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-card-text me-1"></i>CUIT <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="id_cuit_alta" class="form-control" placeholder="Ingrese CUIT" maxlength="11" minlength="11" required>
                            </div>
                            <div class="col-md-3">
                                <label for="id_nombre_convenio_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-briefcase me-1"></i>Nombre <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="id_nombre_convenio_alta" class="form-control" placeholder="Ingrese Nombre" required>
                            </div>
                            <div class="col-md-3">
                                <label for="id_razon_social_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-briefcase me-1"></i>Razón Social <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="id_razon_social_alta" class="form-control" placeholder="Ingrese Razón Social" required>
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
                            <div class="col-md-12">
                                <label for="id_direccion_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-signpost me-1"></i>Dirección <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="id_direccion_alta" class="form-control" placeholder="Ingrese Dirección" required>
                            </div>
                            <div class="col-md-4">
                                <label for="id_provincia_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-map me-1"></i>Provincia <span class="text-danger">*</span>
                                </label>
                                <select id="id_provincia_alta" class="form-select" required>
                                    <option value="" disabled selected>Seleccione Provincia</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="id_localidad_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-pin-map me-1"></i>Localidad <span class="text-danger">*</span>
                                </label>
                                <select id="id_localidad_alta" class="form-select" required>
                                    <option value="" disabled selected>Seleccione Localidad</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="id_codigo_postal_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-mailbox me-1"></i>Código Postal <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="id_codigo_postal_alta" class="form-control" placeholder="Ingrese Código Postal" required>
                            </div>
                            <div class="col-md-12">
                                <label for="id_tipo_cierre_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-calendar-check me-1"></i>Tipo Cierre <span class="text-danger">*</span>
                                </label>
                                <select id="id_tipo_cierre_alta" class="form-select" required>
                                    <option value="" disabled selected>Seleccione Tipo Cierre</option>
                                    <option value="1">Mensual</option>
                                    <option value="2">Quincenal</option>
                                </select>
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
                            <div class="col-md-4">
                                <label for="id_telefono_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-phone me-1"></i>Teléfono
                                </label>
                                <input type="text" id="id_telefono_alta" class="form-control" placeholder="Ingrese Teléfono">
                            </div>
                            <div class="col-md-4">
                                <label for="id_email_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-envelope me-1"></i>Email <span class="text-danger">*</span>
                                </label>
                                <input type="email" id="id_email_alta" class="form-control" placeholder="Ingrese Email" required>
                            </div>
                            <div class="col-md-4">
                                <label for="id_sitio_web_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-globe me-1"></i>Sitio Web
                                </label>
                                <input type="text" id="id_sitio_web_alta" class="form-control" placeholder="Ingrese Sitio Web">
                            </div>
                        </div>
                    </section>
                    <hr>

                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-journal-text text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Cuentas Contables</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="id_cuenta_activo_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-graph-up-arrow me-1"></i>Cuenta Activo
                                </label>
                                <select id="id_cuenta_activo_alta" class="form-select">
                                    <option value="" selected>Seleccione una cuenta...</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="id_cuenta_pasivo_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-receipt me-1"></i>Cuenta Pasivo
                                </label>
                                <select id="id_cuenta_pasivo_alta" class="form-select">
                                    <option value="" selected>Seleccione una cuenta...</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </form>
                <hr>

                <section class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-card-checklist text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Planes Asociados</h3>
                        </div>
                        <button id="btnAgregarPlan_alta" class="btn btn-primary btn-sm" data-bs-toggle="tooltip" title="Nuevo Plan">
                            <i class="bi bi-plus-circle me-1"></i> Agregar Plan
                        </button>
                    </div>

                    <div class="collapse" id="formContainerPlan_alta">
                        <div class="card card-body mb-3">
                            <h5 class="card-title" id="formPlanTitle_alta">Gestionar Plan</h5>
                            <hr>
                            <form id="formPlanAlta" class="needs-validation" novalidate>
                                <!-- <input type="hidden" id="id_plan_form_alta"> -->
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="id_plan_form_alta" class="form-label small">Id Plan<span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="id_plan_form_alta" required>
                                    </div>
                                    <div class="col-md-8 mb-3">
                                        <label for="nombre_plan_form_alta" class="form-label small">Nombre del Plan <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="nombre_plan_form_alta" required>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="cobertura_plan_form_alta" class="form-label small">Cobertura (%) <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="cobertura_plan_form_alta" required>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="bonif_os_plan_form_alta" class="form-label small">Bonif. OS (%) <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="bonif_os_plan_form_alta" required>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="bonif_farmacia_plan_form_alta" class="form-label small">Bonif. Farmacia (%) <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="bonif_farmacia_plan_form_alta" required>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-light" id="btnCancelarPlan_alta">Cancelar</button>
                                    <button type="button" class="btn btn-success" id="btnGuardarPlan_alta">Guardar Plan</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <table id="datatable_planes_alta" class="table table-striped" style="width:100%;">
                        <thead></thead>
                    </table>
                </section>

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
                <button type="button" class="btn btn-success" id="btnConfirmarAltaConvenio">
                    <i class="bi bi-check-circle me-1"></i> Guardar Cambios
                </button>
            </div>
        </div>
    </div>
</div>