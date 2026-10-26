<div class="modal fade" id="modalDetalleLiquidacion" tabindex="-1" aria-labelledby="liquidacionModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header border-0 p-4">
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 avatar-md me-3">
                        <div class="avatar-title bg-white bg-opacity-25 rounded-3">
                            <i class="bi bi-file-earmark-medical fs-2 text-white"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <h5 class="modal-title text-white fs-4 mb-1" id="liquidacionModalLabel">Liquidación de Convenio</h5>
                        <p class="text-white text-opacity-75 mb-0">Detalle completo de la liquidación</p>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body p-0">
                <div class="container-fluid py-4">
                    <!-- Sección: Cabecera de Presentación -->
                    <div class="card mb-4 shadow-sm border-0">
                        <div class="card-header bg-gradient-primary">
                            <h5 class="mb-0 text-white">
                                <i class="bi bi-info-circle me-2"></i>
                                Cabecera de Liquidación
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
                                    
                                    <!-- FILA 1: Identificación y Fechas -->
                                    <div class="row g-3">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <i class="bi bi-hash me-1"></i>Nro de Liquidación
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="nro_liquidacion_detalleLiq">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Maletín para Convenios/Contratos -->
                                                <i class="bi bi-briefcase me-1"></i>Convenio
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="convenio_detalleLiq">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Maletín para Convenios/Contratos -->
                                                <i class="bi bi-briefcase me-1"></i>Cantidad de Recetas
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="cantidadRecetas_detalleLiq">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Calendario Evento para Fechas específicas -->
                                                <i class="bi bi-calendar-event me-1"></i>Fecha de Carga
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="fechaCarga_detalleLiq">—</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- FILA 2: -->
                                    <div class="row g-3 mt-1">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Escudo con menos para Débitos OS -->
                                                <i class="bi bi-shield-minus me-1"></i>Presentado
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="presentado_detalleLiq">—</p>
                                            </div>
                                        </div>        
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Flecha de retorno para Recupero -->
                                                <i class="bi bi-arrow-return-left me-1"></i>Recupero Gastos
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="recuperoGastos_detalleLiq">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Menos círculo para Débitos generales -->
                                                <i class="bi bi-dash-circle me-1"></i>Debitos
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="debito_detalleLiq">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Escudo con menos para Débitos OS -->
                                                <i class="bi bi-shield-minus me-1"></i>Debitos OS
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="debitoOS_detalleLiq">—</p>
                                            </div>
                                        </div>
                                       
                                    </div>

                                    <!-- FILA 3: Ajustes OS y Total -->
                                    <div class="row g-3 mt-1">
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Escudo con más para Créditos OS -->
                                                <i class="bi bi-shield-plus me-1"></i>Créditos OS
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="creditoOS_detalleLiq">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Más círculo para Créditos generales -->
                                                <i class="bi bi-plus-circle me-1"></i>Créditos
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="creditos_detalleLiq">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Gráfico torta para Porcentaje Liquidado -->
                                                <i class="bi bi-pie-chart me-1"></i>Porcentaje
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="porcLiq_detalleLiq">—</p>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label text-muted fw-medium small mb-1">
                                                <!-- Icono Billetera/Pago para Total a Pagar -->
                                                <i class="bi bi-wallet2 me-1"></i>Total
                                            </label>
                                            <div class="bg-body-secondary bg-opacity-50 rounded-2 px-3 py-2 border border-black border-opacity-25">
                                                <p class="mb-0 small fw-medium text-dark" id="total_detalleLiq">—</p>
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
                                    Detalle de Liquidación
                                </h5>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-">
                                <table id="datatable_detalle_detalleLiq" class="table table-bordered table-striped dt-responsive nowrap w-100">
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
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-lg me-2"></i>
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="presentacionModal" tabindex="-1" aria-labelledby="presentacionModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header-custom">
                <div class="modal-header-content">
                    <div class="modal-icon">
                        <i class="bi bi-file-earmark-medical"></i>
                    </div>
                    <div>
                        <h5 class="modal-title" id="presentacionModalLabel">Presentación de Convenio</h5>
                        <p class="modal-subtitle">Detalle completo de la presentación y farmacias</p>
                    </div>
                </div>
                <button type="button" class="btn-close-custom" data-bs-dismiss="modal" aria-label="Cerrar">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            
            <div class="modal-body-custom">
                <div class="content-wrapper">
                    <!-- Cabecera de la Presentación -->
                    <section class="info-section">
                        <div class="section-header">
                            <div class="section-title">
                                <i class="bi bi-info-circle"></i>
                                <h6>Información General</h6>
                            </div>
                            <div class="section-badge" id="estadoBadge"></div>
                        </div>
                        <div class="info-grid" id="cabeceraInfo">
                            <!-- Se llenará con JavaScript -->
                        </div>
                    </section>

                    <!-- Detalle de Farmacias -->
                    <section class="table-section">
                        <div class="section-header">
                            <div class="section-title">
                                <i class="bi bi-building"></i>
                                <h6>Detalle por Farmacia</h6>
                            </div>
                            <div class="stats-group">
                                <div class="stat-item">
                                    <i class="bi bi-shop"></i>
                                    <span id="totalFarmacias">0 Farmacias</span>
                                </div>
                                <div class="stat-item">
                                    <i class="bi bi-receipt"></i>
                                    <span id="totalRecetas">0 Recetas</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="table-wrapper">
                            <div class="table-scroll">
                                <table class="table-custom">
                                    <thead>
                                        <tr>
                                            <th class="th-sticky">
                                                <div class="th-content">
                                                    <span>ID</span>
                                                </div>
                                            </th>
                                            <th class="th-sticky">
                                                <div class="th-content">
                                                    <span>Farmacia</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div class="th-content text-center">
                                                    <i class="bi bi-receipt"></i>
                                                    <span>Recetas</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div class="th-content text-end">
                                                    <span>Importe 100%</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div class="th-content text-end">
                                                    <span>A Cargo OS</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div class="th-content text-end">
                                                    <span>Bonif. Farmacia</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div class="th-content text-end">
                                                    <span>Notas Crédito</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div class="th-content text-end">
                                                    <span>Total a Pagar</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="detalleTabla">
                                        <!-- Se llenará con JavaScript -->
                                    </tbody>
                                    <tfoot>
                                        <tr id="totalesRow">
                                            <!-- Se llenará con JavaScript -->
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            
            <div class="modal-footer-custom">
                <button type="button" class="btn-secondary-custom" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle"></i>
                    <span>Cerrar</span>
                </button>
            </div>
        </div>
    </div>
</div>

<?php 
    //require_once "modal_presentacion_farmacia.php";
?>