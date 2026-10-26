<?php $homeUserName = $_SESSION['auth_data']['nombre'] ?? 'Usuario'; ?>

<div class="home-dashboard mb-5">
    <section class="home-hero">
        <div class="row align-items-center g-4 position-relative" style="z-index: 1;">
            <div class="col-xl-8">
                <span class="home-hero-chip mb-3">
                    <i class="bi bi-hospital"></i>
                    Panel institucional SAC - Sistema Administrativo Cámaras
                </span>
                <div class="text-white text-opacity-75 fw-semibold mb-2">Bienvenido, <?php echo htmlspecialchars($homeUserName, ENT_QUOTES, 'UTF-8'); ?></div>
                <h2 class="text-white mb-2">Gestión integral para cámaras de farmacias</h2>
                <p class="mb-0 text-white text-opacity-75">
                    Vista inicial pensada para una operación institucional como la de una cámara provincial, con indicadores demo sobre farmacias adheridas, convenios, presentaciones, liquidaciones, tesorería y contabilidad.
                </p>
            </div>
            <div class="col-xl-4">
                <div class="home-hero-stats">
                    <div class="home-hero-stat">
                        <div class="home-hero-stat-label">Farmacias</div>
                        <div class="home-hero-stat-value" id="home_hero_farmacias">0</div>
                    </div>
                    <div class="home-hero-stat">
                        <div class="home-hero-stat-label">Convenios</div>
                        <div class="home-hero-stat-value" id="home_hero_convenios">0</div>
                    </div>
                    <div class="home-hero-stat">
                        <div class="home-hero-stat-label">Vista</div>
                        <div class="home-hero-stat-value fs-3" id="home_hero_periodo">Mensual</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="row g-4" id="home_stats_cards"></section>

    <section class="row g-4">
        <div class="col-12">
            <div class="card home-panel">
                <div class="card-header border-0 pb-0">
                    <div class="d-flex flex-wrap justify-content-between align-items-start gap-2">
                        <div>
                            <h4 class="card-title mb-1">Evolucion de ingresos</h4>
                            <p class="text-muted mb-0">Montos reales de ingresos por periodo segun la informacion disponible.</p>
                        </div>
                        <span class="badge bg-primary-subtle text-primary">Datos reales</span>
                    </div>
                </div>
                <div class="card-body">
                    <div id="home_grafico_actividad" class="home-chart"></div>
                </div>
            </div>
        </div>
    </section>

    <section class="row g-4">
        <div class="col-12 col-xl-4">
            <div class="card home-panel">
                <div class="card-header border-0 pb-0">
                    <h4 class="card-title mb-1">Top de convenios facturados</h4>
                    <p class="text-muted mb-0">Convenios con mayor volumen de facturacion mensual.</p>
                </div>
                <div class="card-body">
                    <div id="home_grafico_convenios" class="home-chart-sm"></div>
                </div>
            </div>
        </div>
        <div class="col-12 col-xl-4">
            <div class="card home-panel">
                <div class="card-header border-0 pb-0">
                    <h4 class="card-title mb-1">Top de farmacias facturadas</h4>
                    <p class="text-muted mb-0">Farmacias con mayor monto facturado en el mes.</p>
                </div>
                <div class="card-body">
                    <div id="home_grafico_farmacias" class="home-chart-sm"></div>
                </div>
            </div>
        </div>
        <div class="col-12 col-xl-4">
            <div class="card home-panel">
                <div class="card-header border-0 pb-0">
                    <h4 class="card-title mb-1">Presentaciones por convenio</h4>
                    <p class="text-muted mb-0">Distribucion mensual de presentaciones generadas por convenio.</p>
                </div>
                <div class="card-body">
                    <div id="home_grafico_presentaciones" class="home-chart-sm"></div>
                </div>
            </div>
        </div>
    </section>
</div>