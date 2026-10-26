<div id="modalLiquidacionTotal" class="modal fade" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true" data-dismiss="modal">
    <div class="modal-dialog modal-xxl">
        <div class="modal-content border-0 shadow-lg rounded-4" style="overflow: visible;">
            <div class="modal-header border-0 py-4 px-4 bg-light-subtle position-relative">
                <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-white" style="width: 56px; height: 56px;">
                        <i class="bi bi-building fs-3"></i>
                    </div>
                    <div>
                        <h2 class="modal-title fs-3 fw-bold mb-1" id="modalCuentaContableAltaLabel">Liquidación Total</h2>
                        <p class="text-muted mb-0">Seleccione un convenio y luego las presentaciones a liquidar.</p>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body px-0 py-4">
                <div class="card border-0 bg-light-subtle shadow-sm rounded-0 mb-4">
                    <div class="card-body p-4">
                        <div class="row g-3 justify-content-center">
                            <div class="col-md-4 mb-3">
                                <label for="convenio_liquidacion_total" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-person-vcard me-1"></i>Convenio
                                </label>
                                <select id="convenio_liquidacion_total" class="form-select" required>
                                    <option value="" selected>Seleccione Convenio</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <section class="mb-3 px-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-card-checklist text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Presentaciones</h3>
                    </div>

                    <div id="ayuda_presentaciones_total" class="alert alert-info d-flex align-items-center gap-2 mb-3" role="alert">
                        <i class="bi bi-info-circle fs-5"></i>
                        <span>Seleccione un convenio para desplegar las presentaciones.</span>
                    </div>

                    <div class="collapse" id="contenedor_tabla_presentaciones_total">
                        <div class="card card-body border-0 shadow-sm rounded-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 class="card-title mb-1">Presentaciones del convenio</h5>
                                    <p class="text-muted mb-0">Puede seleccionar una o varias presentaciones en estado pendiente o parcial.</p>
                                </div>
                            </div>

                            <table id="datatable_presentaciones" class="table table-striped table-bordered w-100 align-middle">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section id="seccion_resumen_liquidacion_total" class="mb-3 px-4 d-none">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body">
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <i class="bi bi-cash-stack text-success fs-5"></i>
                                <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Liquidación</h3>
                            </div>

                            <div id="ayuda_resumen_liquidacion_total" class="alert alert-warning d-none" role="alert"></div>

                            <div class="row g-3">
                                <div class="col-md-3">
                                    <label for="cantidad_presentaciones_liquidacion_total" class="form-label text-muted fw-medium small mb-1">Presentaciones seleccionadas</label>
                                    <input type="text" id="cantidad_presentaciones_liquidacion_total" class="form-control" value="0" readonly>
                                </div>
                                <div class="col-md-3">
                                    <label for="total_pagar_liquidacion_total" class="form-label text-muted fw-medium small mb-1">Total a pagar</label>
                                    <input type="text" id="total_pagar_liquidacion_total" class="form-control" value="$ 0,00" readonly>
                                </div>
                                <div class="col-md-3">
                                    <label for="saldo_pendiente_liquidacion_total" class="form-label text-muted fw-medium small mb-1">Saldo pendiente</label>
                                    <input type="text" id="saldo_pendiente_liquidacion_total" class="form-control" value="$ 0,00" readonly>
                                </div>
                                <div class="col-md-3">
                                    <label for="modo_liquidacion_total" class="form-label text-muted fw-medium small mb-1">Tipo de liquidación</label>
                                    <input type="text" id="modo_liquidacion_total" class="form-control" value="-" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label for="porcentaje_liquidacion_total" class="form-label text-muted fw-medium small mb-1">Porcentaje</label>
                                    <input type="text" id="porcentaje_liquidacion_total" class="form-control" value="0,00" autocomplete="off" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label for="importe_liquidacion_total" class="form-label text-muted fw-medium small mb-1">Importe a liquidar</label>
                                    <input type="text" id="importe_liquidacion_total" class="form-control js-input-moneda" value="0,00" autocomplete="off">
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="seccion_recibos_liquidacion_total" class="mb-3 px-4 d-none">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body">
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <i class="bi bi-receipt text-info fs-5"></i>
                                <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Recibos Asociados</h3>
                            </div>

                            <div id="ayuda_recibos_liquidacion_total" class="alert alert-info mb-3" role="alert">
                                Seleccione una presentación para consultar sus recibos asociados.
                            </div>

                            <table id="datatable_recibos_liquidacion_total" class="table table-striped table-bordered w-100 align-middle">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <div class="modal-footer border-0 px-4 pt-3 pb-0">
                    <div class="w-100 d-flex justify-content-center gap-2">
                        <button id="btnConfirmarLiquidacionTotal" class="btn btn-success" disabled>Confirmar</button>
                        <button id="btnCerrarModalLiquidacionTotal" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
