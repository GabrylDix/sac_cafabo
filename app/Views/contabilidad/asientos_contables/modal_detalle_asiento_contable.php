<div id="modalDetalleAsientoContable" class="modal fade sac-asiento-modal" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true" data-dismiss="modal">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header border-0 py-3">
                <div class="w-100">
                    <div class="d-flex align-items-center gap-3">
                        <div class="sac-modal-icon">
                            <i class="bi bi-journal-richtext fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Detalle de Asiento Contable</h2>
                            <p class="text-muted mb-0">Consulta de cabecera, detalle y totales del asiento</p>
                        </div>
                    </div>
                    <hr class="divider-custom mb-0 mt-3">
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="contenedor-totales" style="width: 100%;">
                    <div class="d-flex align-items-center mb-3 px-2">
                        <div class="sac-section-icon me-2">
                            <i class="bi bi-file-earmark-post"></i>
                        </div>
                        <h5 class="mb-0 fw-bold text-dark text-uppercase">Cabecera del Asiento</h5>
                    </div>
                    <hr class="divider-custom mx-2 mt-0 mb-3">
                    <div class="row g-3 mb-3 px-2">
                        <div class="col-lg-3 sac-readonly-field">
                            <div class="sac-readonly-label">
                                <i class="bi bi-123 me-1"></i>Nro. Asiento
                            </div>
                            <div id="nro_asiento_detalle" class="sac-readonly-value"></div>
                        </div>
                        <div class="col-lg-3 sac-readonly-field">
                            <div class="sac-readonly-label">
                                <i class="bi bi-calendar-date me-1"></i>Fecha
                            </div>
                            <div id="fecha_asiento_detalle" class="sac-readonly-value"></div>
                        </div>
                        <!-- <div class="col-lg-3">
                            <label for="referencia_asiento_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-link-45deg me-1"></i>Referencia
                            </label>
                            <input id="referencia_asiento_detalle" class="form-control" type="text" disabled>
                        </div> -->
                        <div class="col-lg-3 sac-readonly-field">
                            <div class="sac-readonly-label">
                                <i class="bi bi-toggle-on me-1"></i>Estado
                            </div>
                            <div id="estado_asiento_detalle" class="sac-readonly-value"></div>
                        </div>
                        <div class="col-lg-6 sac-readonly-field">
                            <div class="sac-readonly-label">
                                <i class="bi bi-text-paragraph me-1"></i>Descripcion
                            </div>
                            <div id="descripcion_asiento_detalle" class="sac-readonly-value"></div>
                        </div>
                        <div class="col-lg-6 sac-readonly-field">
                            <div class="sac-readonly-label">
                                <i class="bi bi-chat-text me-1"></i>Observaciones
                            </div>
                            <div id="observaciones_asiento_detalle" class="sac-readonly-value"></div>
                        </div>
                    </div>
                </div>

                <div id="detalle_asiento_contable_detalle">
                    <fieldset class="border p-3 mb-3">
                        <legend class="float-none w-auto px-2 text-start text-uppercase">Detalle del Asiento</legend>
                        <hr class="divider-custom mt-0 mb-3">
                        <table id="datatable_asiento_detalle_modal" class="table dt-responsive nowrap w-100 sac-asiento-table sac-asiento-detail-table">
                            <thead>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </fieldset>
                </div>

                <div class="row pt-4 justify-content-end">
                    <div class="contenedor-totales" style="width: 100%; max-width: 720px;">
                        <!-- <div class="d-flex align-items-center mb-3 px-2">
                            <div class="icon-box-top-success me-2">
                                <i class="bi bi-bar-chart-fill"></i>
                            </div>
                            <h5 class="mb-0 fw-bold text-dark">Detalle de Totales</h5>
                        </div> -->

                        <div class="card card-custom sac-detail-totals">
                            <div class="d-flex flex-wrap justify-content-end gap-4 text-end">
                                <div>
                                    <div class="text-label mb-1">Total Debe</div>
                                    <div id="total_debe_detalle" class="text-value">$ 0,00</div>
                                </div>
                                <div>
                                    <div class="text-label mb-1">Total Haber</div>
                                    <div id="total_haber_detalle" class="text-value">$ 0,00</div>
                                </div>
                                <div>
                                    <div class="text-label mb-1">Saldo</div>
                                    <div id="total_saldo_detalle" class="text-value">$ 0,00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="col-xs-12 text-center">
                    <button type="button" class="btn btn-outline-secondary sac-readonly-close" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</div>
