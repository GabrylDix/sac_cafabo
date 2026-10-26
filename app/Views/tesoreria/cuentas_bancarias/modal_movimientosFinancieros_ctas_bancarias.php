<div class="modal fade" id="movimientosFinancierosModal" tabindex="-1" aria-labelledby="movimientosFinancierosModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header border-0 text-white sticky-top shadow-sm">
                <div class="d-flex align-items-center gap-3">
                    <div class="header-icon p-2 rounded-3 bg-white bg-opacity-10 d-flex align-items-center justify-content-center">
                        <i class="bi bi-currency-exchange fs-4"></i>
                    </div>
                    <div>
                        <h5 class="modal-title text-white fs-4 mb-1">Movimientos Financieros</h5>
                        <div class="text-white-50 mt-1" id="subtituloCuenta_movimientos">-</div>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body p-0">
                <div class="card-body p-4">
                    <div class="row g-4">
                        <div class="col-lg-4">
                            <div class="card card-saldo-gradient h-100 p-2">
                                <div class="card-body">
                                    <div class="d-flex align-items-center gap-2 mb-3 text-white-50">
                                        <i class="bi bi-wallet2 fs-5"></i>
                                        <span class="text-uppercase small fw-semibold">Saldo Disponible</span>
                                    </div>
                                    <h1 class="display-5 fw-bold mb-3 text-emerald saldo-monto" id="saldoMonto_ctaBancaria" value="0">0</h1>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-8">
                            <div class="card card-dark h-100 p-2">
                                <div class="card-body">
                                    <h6 class="text-white-50 mb-4 text-uppercase small fw-semibold">
                                        <i class="bi bi-info-circle me-2"></i>Información de la cuenta
                                    </h6>
                                    <div class="row g-4">
                                        <div class="col-md-4">
                                            <label class="form-label text-white-50 small mb-1">Número de Cuenta</label>
                                            <p class="fw-bold text-white fs-5 mb-0" id="nroCuentaInput_ctaBancaria">-</p>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label text-white-50 small mb-1">CBU</label>
                                            <div class="input-group">
                                                <input type="text" class="form-control form-control-dark border-end-0" id="cbuInput_ctaBancaria" readonly>
                                                <button class="btn btn-copy-dark" type="button" id="copyCbu_ctaBancaria" title="Copiar CBU">
                                                    <i class="bi bi-clipboard"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label text-white-50 small mb-1">Alias</label>
                                            <div class="input-group">
                                                <input type="text" class="form-control form-control-dark border-end-0" id="aliasInput_ctaBancaria" readonly>
                                                <button class="btn btn-copy-dark" type="button" id="copyAlias_ctaBancaria" title="Copiar Alias">
                                                    <i class="bi bi-clipboard"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="col-12 mt-3">
                                            <label class="form-label text-white-50 small mb-1">Descripción</label>
                                            <p class="fw-bold text-white mb-0" id="descripcionInput_ctaBancaria">-</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card shadow-sm border-0 mt-4">
                        <div class="card-header bg-light border-bottom py-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0 text-secondary fw-semibold">
                                    <i class="bi bi-journal-text me-2"></i>
                                    Movimientos Registrados
                                </h5>
                            </div>
                        </div>
                        <div class="d-flex gap-3 justify-content-start align-items-end mb-4 mt-2">
                            <div class="col-2">
                                <label for="fecha_desde_ctaBancaria" class="form-label filter-label mb-1">Fecha Desde</label>
                                <div class="input-group" style="cursor: pointer;">
                                    <span class="input-group-text input-group-text-dark"><i class="bi bi-calendar3"></i></span>
                                    <input type="text" class="form-control form-control-dark border-start-0 datepicker-custom" id="fecha_desde_ctaBancaria" value="<?php echo date("Y-m-01") ?>" placeholder="DD/MM/AAAA">
                                </div>
                            </div>
                            <div class="col-2">
                                <label for="fecha_hasta_ctaBancaria" class="form-label filter-label mb-1">Fecha Hasta</label>
                                <div class="input-group" style="cursor: pointer;">
                                    <span class="input-group-text input-group-text-dark"><i class="bi bi-calendar3"></i></span>
                                    <input type="text" class="form-control form-control-dark border-start-0 datepicker-custom" id="fecha_hasta_ctaBancaria" value="<?php echo date("Y-m-d") ?>" placeholder="DD/MM/AAAA">
                                </div>
                            </div>
                            <div class="col-2">
                                <button type="button" class="btn btn-blue-cobalt w-100" id="btnFiltrar_movimientos_ctaBancaria">
                                    <i class="bi bi-funnel me-2"></i>Filtrar
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-" id="div_datatable_movimientos" style="display: none;">
                                <table id="datatable_movimientosFinancieros_ctaBancaria" class="table table-bordered table-striped dt-responsive nowrap w-100">
                                    <thead>
                                        <tr>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div><!-- end card header -->      
                </div>
            </div>
            <!-- Modal Footer -->
            <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-lg me-2"></i>
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</div>
