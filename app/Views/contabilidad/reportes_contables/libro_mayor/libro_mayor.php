<section class="sac-libro-mayor">
    <div class="card rounded-4 overflow-hidden">
        <div class="card-header sac-page-header">
            <div class="sac-page-heading__text">
                <h3 class="card-title sac-page-title">
                    Libro Mayor
                </h3>
                <p class="sac-page-description">Consulte movimientos, saldo inicial y saldo final por cuenta o rango de cuentas.</p>
            </div>
        </div>
        <div class="card-body">
            <div class="mb-4">
                <div class="form-check form-switch form-switch-md mb-3" dir="ltr">
                    <input type="checkbox" class="form-check-input" id="rango_cuentas_switch">
                    <label class="form-check-label" for="rango_cuentas_switch">Rango de cuentas</label>
                </div>

                <div class="row g-3 align-items-end">
                    <div class="col-md-3">
                        <label class="form-label" id="label_cuenta_desde" for="id_cuenta_desde">Cuenta</label>
                        <select class="form-select" id="id_cuenta_desde"></select>
                    </div>

                    <div class="col-md-3 d-none" id="campo_cuenta_hasta">
                        <label class="form-label" for="id_cuenta_hasta">Hasta cuenta</label>
                        <select class="form-select" id="id_cuenta_hasta" disabled></select>
                    </div>

                    <div class="col-md-2">
                        <label class="form-label" for="id_fecha_desde">Fecha desde</label>
                        <input type="date" class="form-control" id="id_fecha_desde">
                    </div>

                    <div class="col-md-2">
                        <label class="form-label" for="id_fecha_hasta">Fecha hasta</label>
                        <input type="date" class="form-control" id="id_fecha_hasta">
                    </div>

                    <div class="col-md-2 d-grid">
                        <label class="form-label d-none d-md-block">&nbsp;</label>
                        <button class="btn sac-btn-primary" id="btn_filtrar_movimientos" type="button">
                            <i class="ri-filter-3-line me-1"></i>
                            Filtrar
                        </button>
                    </div>
                </div>
            </div>

            <div id="mensaje_libro_mayor" class="alert alert-info sac-libro-mayor__empty d-flex align-items-center justify-content-center text-center mb-4">
                <div>
                    <div class="fw-semibold mb-1">Seleccione cuenta y rango de fechas</div>
                    <div class="text-muted">Complete los filtros para consultar el Libro Mayor.</div>
                </div>
            </div>

            <div id="div_tabla" class="d-none">
                <div class="table-responsive">
                    <table id="datatable_listado_libro_mayor" class="table table-bordered table-striped align-middle table-sm w-100 sac-libro-mayor__table">
                        <thead>
                            <tr>
                                <th>Cuenta</th>
                                <th>Asiento</th>
                                <th>Fecha</th>
                                <th>Detalle</th>
                                <th>Descripción</th>
                                <th>Debe</th>
                                <th>Haber</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>

<?php require __DIR__ . '/../../../components/modalMyAlert.php'; ?>
