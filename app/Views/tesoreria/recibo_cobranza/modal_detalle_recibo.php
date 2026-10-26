<div id="modalDetalleRecibo" class="modal fade" data-bs-backdrop="static" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-white" style="width: 56px; height: 56px;">
                            <i class="bi bi-receipt-cutoff fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Detalle de Recibo</h2>
                            <p class="text-muted mb-0">Consulta de cabecera, detalle, pagos y presentaciones del recibo</p>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <hr class="m-0">

            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">
                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-receipt text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Cabecera</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-1">
                            <label for="id_detalle_recibo" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-upc me-1"></i>ID Recibo
                            </label>
                            <input type="text" id="id_detalle_recibo" class="form-control" disabled>
                        </div>
                        <div class="col-md-2">
                            <label for="estado_detalle_recibo" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-flag me-1"></i>Estado
                            </label>
                            <input type="text" id="estado_detalle_recibo" class="form-control" disabled>
                        </div>
                        <div class="col-md-3">
                            <label for="nro_comprobante_detalle_recibo" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-hash me-1"></i>Nro Comprobante
                            </label>
                            <input type="text" id="nro_comprobante_detalle_recibo" class="form-control" disabled>
                        </div>
                        <div class="col-md-3">
                            <label for="fecha_comprobante_detalle_recibo" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-calendar-date me-1"></i>Fecha Comprobante
                            </label>
                            <input type="date" id="fecha_comprobante_detalle_recibo" class="form-control" disabled>
                        </div>
                        <div class="col-md-3">
                            <label for="importe_total_detalle_recibo" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-currency-dollar me-1"></i>Total
                            </label>
                            <input type="text" id="importe_total_detalle_recibo" class="form-control" disabled>
                        </div>
                    </div>
                </section>

                <hr>

                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-person text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Cliente</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label for="cliente_nombre_detalle_recibo" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-person-fill me-1"></i>Cliente
                            </label>
                            <input type="text" id="cliente_nombre_detalle_recibo" class="form-control" disabled>
                        </div>
                    </div>
                </section>

                <hr>

                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-chat-left-text text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Observaciones</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label for="observaciones_detalle_recibo" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-pencil me-1"></i>Observaciones
                            </label>
                            <input type="text" id="observaciones_detalle_recibo" class="form-control" disabled>
                        </div>
                    </div>
                </section>

                <hr>

                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-clock-history text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Auditoría</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="usuario_creacion_detalle_recibo" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-person-workspace me-1"></i>Usuario Creación
                            </label>
                            <input type="text" id="usuario_creacion_detalle_recibo" class="form-control" disabled>
                        </div>
                        <div class="col-md-6">
                            <label for="fecha_creacion_detalle_recibo" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-calendar-plus me-1"></i>Fecha Creación
                            </label>
                            <input type="text" id="fecha_creacion_detalle_recibo" class="form-control" disabled>
                        </div>
                    </div>
                </section>

                <hr>

                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-card-checklist text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Detalle</h3>
                    </div>
                    <table id="datatable_detalles_detalle_recibo" class="table table-striped" style="width:100%;">
                        <thead></thead>
                    </table>
                </section>

                <hr>

                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-credit-card text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Pagos</h3>
                    </div>
                    <table id="datatable_pagos_detalle_recibo" class="table table-striped" style="width:100%;">
                        <thead></thead>
                    </table>
                </section>

                <hr>

                <section class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-card-list text-primary fs-5"></i>
                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Presentaciones</h3>
                    </div>
                    <table id="datatable_presentaciones_detalle_recibo" class="table table-striped" style="width:100%;">
                        <thead></thead>
                    </table>
                </section>
            </div>

            <div class="modal-footer border-0 justify-content-end mt-2">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>