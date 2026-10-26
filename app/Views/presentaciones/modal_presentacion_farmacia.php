<div class="modal fade" id="presentacionFarmaciaModal" tabindex="-1" aria-labelledby="presentacionModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header border-0 p-4">
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 avatar-md me-3">
                        <div class="avatar-title bg-white bg-opacity-25 rounded-3">
                            <i class="bi bi-file-earmark-medical fs-2 text-white"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <h5 class="modal-title text-white fs-4 mb-1" id="presentacionFarmaciaModalLabel">-</h5>
                        <p class="text-white text-opacity-75 mb-0">Detalle completo de la presentación de la farmacias</p>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" id="closeModalUpPresFarma"></button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body p-0">
                <div class="container-fluid py-4">
                    <!-- Sección: Cabecera de Presentación -->
                    <div class="card mb-4 shadow-sm border-0">
                        <div class="card-header bg-gradient-primary">
                            <h5 class="mb-0 text-white">
                                <i class="bi bi-info-circle me-2"></i>
                                Cabecera de la Presentación
                            </h5>
                        </div>
                        <div class="card-body p-4">
                            <div class="row g-4" id="cabeceraContent">
                                <section class="mb-4">
                                    <div class="d-flex align-items-center gap-2 mb-3">
                                        <!-- Icono general de información -->
                                        <i class="bi bi-info-circle-fill text-primary fs-5"></i>
                                        <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Información Principal</h3>
                                    </div>
                                    <!-- FILA 2: Importes Base y Cobertura -->
                                    <div class="row g-3 mt-1">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-file-earmark-spreadsheet me-1"></i>Importe Presentado
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="importePres_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-cash me-1"></i>Importe
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="importe_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-shield-check me-1"></i>A Cargo OS Presentado
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="aCargoOSpresent_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-shield-fill-check me-1"></i>A Cargo OS
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="aCargoOS_presFarma">—</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row g-3 mt-1">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                               
                                                <i class="bi bi-capsule me-1"></i>Bonif. Farmacia
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="bonifFarmacia_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-receipt me-1"></i>Notas de Crédito
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="notasCredito_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-arrow-return-left me-1"></i>Recupero Gastos
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="recuperoGastos_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-dash-circle me-1"></i>Debitos
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="debito_presFarma">—</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row g-3 mt-1">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Escudo con menos para Débitos OS -->
                                                <i class="bi bi-shield-minus me-1"></i>Debitos OS
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="debitoOS_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-shield-plus me-1"></i>Créditos OS
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="creditoOS_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-plus-circle me-1"></i>Créditos
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="creditos_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Billetera/Pago para Total a Pagar -->
                                                <i class="bi bi-wallet2 me-1"></i>Total a Pagar
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="totalPagar_presFarma">—</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- FILA 5: Saldos y Porcentajes -->
                                    <div class="row g-3 mt-1">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Reloj arena para Pendiente -->
                                                <i class="bi bi-hourglass-split me-1"></i>Saldo Pendiente
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="saldoPendiente_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Porcentaje para Porcentaje Pendiente -->
                                                <i class="bi bi-percent me-1"></i>Porcentaje Pendiente
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="porcentaje_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Check circular para Liquidado (Finalizado) -->
                                                <i class="bi bi-check-circle me-1"></i>Saldo Liquidado
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="saldoLiq_presFarma">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Gráfico torta para Porcentaje Liquidado -->
                                                <i class="bi bi-pie-chart me-1"></i>Porcentaje Liquidado
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="porcLiq_presFarma">—</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row g-3 mt-1">
                                        <div class="col-md-3">
                                        
                                        </div>
                                        <div class="col-md-3">
                                          
                                        </div>
                                        <div class="col-md-3">
                            
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-archive me-1"></i>Total Recetas
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="cantRecetas_presFarma">—</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                    <!-- Sección: Detalle de Presentación (Tabla) -->
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-gradient-success">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0 text-white">
                                    <i class="bi bi-table me-2"></i>
                                    Detalle de Presentación Farmacia
                                </h5>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-">
                                <table id="datatable_detalle_presFarma" class="table table-bordered table-striped dt-responsive nowrap w-100">
                                    <thead>
                                        <tr>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary" id="closeModalPresFarma">
                    <i class="bi bi-x-lg me-2"></i>
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</div>
