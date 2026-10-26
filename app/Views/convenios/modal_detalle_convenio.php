<div id="modalConvenioDetalle" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConvenioDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <!-- Header -->
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-white" style="width: 56px; height: 56px;">
                            <i class="bi bi-building fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="id_nombre_detalle">Convenio</h2>
                            <p class="text-muted mb-0">Detalles del convenio</p>
                        </div>
                    </div>
                    <span id="id_badge_activo" class="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 me-5 px-4 py-2 fs-6 fw-medium">
                        <i class="bi bi-check-circle me-2"></i>
                        <span id="id_estado_texto">Activo</span>
                    </span>
                </div>
                <button type=" button" class="btn-close position-absolute top-0 end-0 m-4" id="btnCerrarModalDetalle_x" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <hr class="m-0">

            <!-- Content -->
            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">

                <!-- Información Fiscal -->
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-file-text text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información Fiscal</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-card-text me-1"></i>CUIT
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_cuit_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-file-earmark-text me-1"></i>Patente
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_patente_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-briefcase me-1"></i>Nombre
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_nombre_convenio_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-briefcase me-1"></i>Razón Social
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_razon_social_detalle">—</p>
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
                        <div class="col-md-12">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-signpost me-1"></i>Dirección
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_direccion_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-map me-1"></i>Provincia
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_provincia_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-pin-map me-1"></i>Localidad
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_localidad_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-mailbox me-1"></i>Código Postal
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_codigo_postal_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-calendar-check me-1"></i>Tipo Cierre
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_tipo_cierre_detalle">—</p>
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
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-phone me-1"></i>Teléfono
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_telefono_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-envelope me-1"></i>Email
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_email_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-globe me-1"></i>Sitio Web
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_sitio_web_detalle">—</p>
                            </div>
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
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-graph-up-arrow me-1"></i>Cuenta Activo
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_cuenta_activo_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-receipt me-1"></i>Cuenta Pasivo
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_cuenta_pasivo_detalle">—</p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr>

                <!-- Planes -->
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-card-checklist text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Planes Asociados</h3>
                    </div>
                    <div id="id_planes_container">
                        <div class="text-center text-muted py-4">
                            <i class="bi bi-inbox fs-2 mb-2 d-block"></i>
                            <p class="mb-0 small">No hay planes asociados</p>
                        </div>
                    </div>
                </section>

                <hr>

                <!-- Información del Sistema -->
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-calendar-event text-primary "></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información del Sistema</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-calendar-plus me-1"></i>Fecha de Creación
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_fecha_creacion_detalle">—</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-clock-history me-1"></i>Última Modificación
                            </label>
                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                <p class="mb-0 small fw-medium text-dark" id="id_fecha_modificacion_detalle">—</p>
                            </div>
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
