<div class="modal fade" id="loteDetalleModal" tabindex="-1" aria-labelledby="loteDetalleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header border-0 p-4">
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 avatar-md me-3">
                        <div class="avatar-title bg-white bg-opacity-25 rounded-3">
                            <i class="bi bi-boxes fs-2 text-white"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <h5 class="modal-title text-white fs-4 mb-1" id="loteDetalleModalLabel">Lote</h5>
                        <p class="text-white text-opacity-75 mb-0">Detalle completo del Lote</p>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body p-0">
                <div class="container-fluid py-4">
                    <div class="card mb-4 shadow-sm border-0">
                        <div class="card-header bg-gradient-primary">
                            <h5 class="mb-0 text-white">
                                <i class="bi bi-clipboard-data me-2"></i>
                                Cabecera del Lote
                            </h5>
                        </div>
                        <div class="card-body p-4">
                            <div class="row g-4" id="cabeceraContent">
                                <section class="mb-4">
                                    <div class="d-flex align-items-center gap-2 mb-3">
                                        <i class="bi bi-info-circle-fill text-primary fs-5"></i>
                                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información Principal</h3>
                                    </div>
                                    
                                    <div class="row g-3">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-hash me-1"></i>Nro Lote
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="nroLote_detalleLote">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-collection me-1"></i>Tipo Lote
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="tipoLote_detalleLote">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-wallet2 me-1"></i>Cuenta Bancaria
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="ctaBancaria_detalleLote">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-bank me-1"></i>Nombre Banco
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="nombreBanco_detalleLote">—</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row g-3 mt-1">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-person-add me-1"></i>Usuario Creación
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="usrCreacion_detalleLote">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-calendar-plus me-1"></i>Fecha Creación
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="fechaCreacion_detalleLote">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-person-check me-1"></i>Usuario Autorización
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="usrAutorizacion_detalleLote">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-calendar-check me-1"></i>Fecha Autorización
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="fechaAutorizacion_detalleLote">—</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row g-3 mt-1">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-cash-coin me-1"></i>Importe
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="importeLote_detalleLote">—</p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-gradient-emerald">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0 text-white">
                                    <i class="bi bi-receipt-cutoff me-2"></i>
                                    Ordenes de Pagos
                                </h5>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-">
                                <table id="datatable_ordPago_detalleLote" class="table table-bordered table-striped dt-responsive nowrap w-100">
                    
                                </table>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-lg me-2"></i>
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</div>