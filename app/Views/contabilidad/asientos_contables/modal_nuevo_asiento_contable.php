<div id="modalAgregarAsientoContable" class="modal fade sac-asiento-modal" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true" data-dismiss="modal">
    <div class="modal-dialog modal-xxl">
        <div class="modal-content">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="sac-modal-icon">
                            <i class="bi bi-journal-plus fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Nuevo Asiento Contable</h2>
                            <p class="text-muted mb-0">Dar de alta un asiento contable</p>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="form_cargar_asiento_contable" class="needs-validation" autocomplete="off" novalidate>
                    <div class="contenedor-totales" style="width: 100%;">
                        <div class="d-flex align-items-center mb-3 px-2">
                        <div class="sac-section-icon me-2">
                            <i class="bi bi-file-earmark-post"></i>
                            </div>
                            <h5 class="mb-0 fw-bold text-dark">Cabecera del Asiento</h5>
                        </div>
                        <div class="row g-3 mb-3 px-2">
                            <div class="col-lg-3">
                                <label for="fecha_asiento" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-calendar-date me-1"></i>Fecha Asiento <span class="text-danger">*</span>
                                </label>
                                <input type="date" id="fecha_asiento" class="form-control" required>
                            </div>

                            <div class="col-lg-3">
                                <label for="fecha_aplicacion" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-calendar-date me-1"></i>Fecha Aplicacion <span class="text-danger">*</span>
                                </label>
                                <input type="date" id="fecha_aplicacion" class="form-control" required>
                            </div>

                            <div class="col-lg-6">
                                <label for="descripcion_asiento" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-text-paragraph me-1"></i>Descripcion <span class="text-danger">*</span>
                                </label>
                                <input id="descripcion_asiento" class="form-control" required type="text">
                            </div>
                            <div class="col-lg-12">
                                <label for="observaciones_asiento" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-chat-text me-1"></i>Observaciones
                                </label>
                                <textarea id="observaciones_asiento" class="form-control" rows="2" maxlength="255"></textarea>
                            </div>
                        </div>
                    </div>
                </form>

                <div id="detalle_asiento_contable">
                    <fieldset class="border p-3 mb-3">
                        <legend class="float-none w-auto px-2 text-start">Detalle del Asiento</legend>
                        <form class="row g-3" id="form_agregar_detalle_asiento" autocomplete="off" novalidate>
                            <div class="col-lg-4">
                                <label for="id_cuenta_contable_alta" class="form-label text-muted fw-medium small mb-1 label_sugerencia">
                                    <i class="bi bi-journal-text me-1"></i>Cuenta Contable <span class="text-danger">*</span>
                                </label>
                                <select id="id_cuenta_contable_alta" class="form-select" required>
                                    <option value="">Seleccione una cuenta...</option>
                                </select>
                            </div>
                            <div class="col-lg-3">
                                <label for="codigo_cuenta_contable_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-upc-scan me-1"></i>Codigo Cuenta
                                </label>
                                <input id="codigo_cuenta_contable_alta" class="form-control" type="text" readonly>
                            </div>
                            <div class="col-lg-5">
                                <label for="descripcion_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-card-text me-1"></i>Descripcion <span class="text-danger">*</span>
                                </label>
                                <input id="descripcion_alta" class="form-control" required type="text" readonly>
                            </div>
                            <div class="col-lg-3">
                                <label for="debe_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-arrow-down-circle me-1"></i>Debe
                                </label>
                                <input id="debe_alta" class="form-control" type="text" placeholder="0.00">
                            </div>
                            <div class="col-lg-3">
                                <label for="haber_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-arrow-up-circle me-1"></i>Haber
                                </label>
                                <input id="haber_alta" class="form-control" type="text" placeholder="0.00">
                            </div>
                            <div class="col-lg-6">
                                <label for="detalle_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-chat-square-text me-1"></i>Detalle
                                </label>
                                <input id="detalle_alta" class="form-control" type="text">
                            </div>
                        </form>
                        <div class="col-xs-12 my-3">
                            <button id="btnAgregarDetalleAsiento" class="btn btn-outline-secondary">Agregar Detalle</button>
                        </div>
                        <table id="datatable_asiento_detalle" class="table table-striped table-bordered sac-asiento-table">
                            <thead>
                                <tr>
                                    <th class="titulos-columnas">Cuenta Contable</th>
                                    <th class="titulos-columnas">Codigo</th>
                                    <th class="titulos-columnas">Descripcion</th>
                                    <th class="titulos-columnas">Debe</th>
                                    <th class="titulos-columnas">Haber</th>
                                    <th class="titulos-columnas">Detalle</th>
                                    <th class="titulos-columnas">Acciones</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </fieldset>
                </div>

                <div class="row pt-5 g-3 align-items-stretch">
                    <div class="col-lg-5">
                        <div class="contenedor-totales" style="width: 100%; max-width: 450px;">
                            <div class="d-flex align-items-center mb-3 px-2">
                                <div class="sac-section-icon me-2">
                                    <i class="bi bi-bar-chart-fill"></i>
                                </div>
                                <h5 class="mb-0 fw-bold text-dark">Detalle de Totales</h5>
                            </div>

                            <div class="card border-0 card-custom bg-white p-4 h-100">
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="text-label">Total Debe</span>
                                    <span id="total_debe_general" class="text-value">$ 0,00</span>
                                </div>
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="text-label">Total Haber</span>
                                    <span id="total_haber_general" class="text-value">$ 0,00</span>
                                </div>

                                <hr class="divider-custom">

                                <div class="d-flex justify-content-between align-items-end">
                                    <div>
                                        <div class="total-title text-uppercase mb-1">DIFERENCIA</div>
                                        <div id="diferencia_general" class="total-amount">$ 0,00</div>
                                    </div>
                                    <div>
                                        <i class="bi bi-calculator icon-bottom-right"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div id="alerta_estado_asiento_alta" class="card card-custom estado-asiento-card estado-asiento-card--info h-100" role="status" aria-live="polite">
                            <div class="card-body d-flex flex-column justify-content-center p-4">
                                <div class="d-flex align-items-start gap-3">
                                    <i id="icono_alerta_estado_asiento_alta" class="bi bi-info-circle estado-asiento-card__icon fs-3 flex-shrink-0"></i>
                                    <div>
                                        <div class="small text-uppercase fw-semibold estado-asiento-card__title mb-2">Confirmacion</div>
                                        <div id="mensaje_alerta_estado_asiento_alta" class="fw-medium estado-asiento-card__message mb-2">Agrega detalles para habilitar Confirmar.</div>
                                        <p class="small estado-asiento-card__help mb-0">El asiento debe tener al menos un detalle y una diferencia final de $ 0,00 para habilitar la confirmacion.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-3">
                    <div class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 w-100">
                        <div class="d-flex flex-wrap justify-content-center justify-content-lg-end gap-2 w-100">
                            <button id="btnAgregarAsientoContable" class="btn btn-primary">Confirmar</button>
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
