<div id="modalModificarAsientoContable" class="modal fade sac-asiento-modal" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true" data-dismiss="modal">
    <div class="modal-dialog modal-xxl">
        <div class="modal-content">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="sac-modal-icon">
                            <i class="bi bi-pencil-square fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Modificar Asiento Contable</h2>
                            <p class="text-muted mb-0">Editar cabecera y detalle de un asiento contable</p>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formModAsientoContable" class="needs-validation" autocomplete="off" novalidate>
                    <input type="hidden" id="id_asiento_mod">
                    <div class="contenedor-totales" style="width: 100%;">
                        <div class="d-flex align-items-center mb-3 px-2">
                            <div class="sac-section-icon me-2">
                                <i class="bi bi-file-earmark-post"></i>
                            </div>
                            <h5 class="mb-0 fw-bold text-dark">Cabecera del Asiento</h5>
                        </div>
                        <div class="row g-3 mb-3 px-2">
                            <div class="col-lg-3 sac-readonly-field">
                                <div class="sac-readonly-label">
                                    <i class="bi bi-123 me-1"></i>Nro. Asiento
                                </div>
                                <div id="nro_asiento_mod" class="sac-readonly-value"></div>
                            </div>
                            <div class="col-lg-3">
                                <label for="fecha_aplicacion_mod" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-calendar-date me-1"></i>Fecha Aplicacion <span class="text-danger">*</span>
                                </label>
                                <input type="date" id="fecha_aplicacion_mod" class="form-control" required>
                            </div>
                            <div class="col-lg-6">
                                <label for="descripcion_asiento_mod" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-text-paragraph me-1"></i>Descripcion <span class="text-danger">*</span>
                                </label>
                                <input id="descripcion_asiento_mod" class="form-control" required type="text">
                            </div>
                            <div class="col-lg-12">
                                <label for="observaciones_asiento_mod" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-chat-text me-1"></i>Observaciones
                                </label>
                                <textarea id="observaciones_asiento_mod" class="form-control" rows="2" maxlength="255"></textarea>
                            </div>
                        </div>
                    </div>
                </form>

                <div id="detalle_asiento_contable_mod">
                    <fieldset class="border p-3 mb-3">
                        <legend class="float-none w-auto px-2 text-start">Detalle del Asiento</legend>
                        <button id="btnAgregarDetalleAsiento_mod" type="button" class="btn btn-outline-secondary mb-3" aria-controls="editor_detalle_asiento_mod" aria-expanded="false">Agregar Detalle</button>
                        <div id="editor_detalle_asiento_mod" class="d-none">
                            <form class="row g-3" id="form_agregar_detalle_asiento_mod" autocomplete="off" novalidate>
                                <input type="hidden" id="id_detalle_mod">
                                <div class="col-lg-4">
                                    <label for="id_cuenta_contable_det_mod" class="form-label text-muted fw-medium small mb-1 label_sugerencia">
                                        <i class="bi bi-journal-text me-1"></i>Cuenta Contable <span class="text-danger">*</span>
                                    </label>
                                    <select id="id_cuenta_contable_det_mod" class="form-select" required>
                                        <option value="">Seleccione una cuenta...</option>
                                    </select>
                                </div>
                                <div class="col-lg-3">
                                    <label for="codigo_cuenta_contable_det_mod" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-upc-scan me-1"></i>Codigo Cuenta
                                    </label>
                                    <input id="codigo_cuenta_contable_det_mod" class="form-control" type="text" readonly>
                                </div>
                                <div class="col-lg-5">
                                    <label for="descripcion_det_mod" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-card-text me-1"></i>Descripcion <span class="text-danger">*</span>
                                    </label>
                                    <input id="descripcion_det_mod" class="form-control" required type="text" readonly>
                                </div>
                                <div class="col-lg-3">
                                    <label for="debe_det_mod" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-arrow-down-circle me-1"></i>Debe
                                    </label>
                                    <input id="debe_det_mod" class="form-control" type="text" placeholder="0.00">
                                </div>
                                <div class="col-lg-3">
                                    <label for="haber_det_mod" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-arrow-up-circle me-1"></i>Haber
                                    </label>
                                    <input id="haber_det_mod" class="form-control" type="text" placeholder="0.00">
                                </div>
                                <div class="col-lg-6">
                                    <label for="detalle_det_mod" class="form-label text-muted fw-medium small mb-1">
                                        <i class="bi bi-chat-square-text me-1"></i>Nota / Detalle
                                    </label>
                                    <input id="detalle_det_mod" class="form-control" type="text">
                                </div>
                            </form>
                            <div class="d-flex flex-wrap gap-2 my-3">
                                <button id="btnGuardarDetalleAsientoMod" type="submit" form="form_agregar_detalle_asiento_mod" class="btn btn-outline-secondary">Agregar detalle</button>
                                <button id="btnCancelarDetalleAsientoMod" type="button" class="btn btn-outline-secondary">Cancelar</button>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table id="datatable_asiento_detalle_mod" class="table sac-asiento-table w-100">
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
                        </div>
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
                                    <span id="total_debe_general_mod" class="text-value">$ 0,00</span>
                                </div>
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="text-label">Total Haber</span>
                                    <span id="total_haber_general_mod" class="text-value">$ 0,00</span>
                                </div>
                                <hr class="divider-custom">
                                <div class="d-flex justify-content-between align-items-end">
                                    <div>
                                        <div class="total-title text-uppercase mb-1">DIFERENCIA</div>
                                        <div id="diferencia_general_mod" class="total-amount">$ 0,00</div>
                                    </div>
                                    <div>
                                        <i class="bi bi-calculator icon-bottom-right"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div id="alerta_estado_asiento_mod" class="card card-custom estado-asiento-card estado-asiento-card--info h-100" role="status" aria-live="polite">
                            <div class="card-body d-flex flex-column justify-content-center p-4">
                                <div class="d-flex align-items-start gap-3">
                                    <i id="icono_alerta_estado_asiento_mod" class="bi bi-info-circle estado-asiento-card__icon fs-3 flex-shrink-0"></i>
                                    <div>
                                        <div class="small text-uppercase fw-semibold estado-asiento-card__title mb-2">Confirmacion</div>
                                        <div id="mensaje_alerta_estado_asiento_mod" class="fw-medium estado-asiento-card__message mb-2">Revisa los detalles antes de guardar los cambios.</div>
                                        <p class="small estado-asiento-card__help mb-0">El asiento debe tener al menos un detalle y una diferencia final de $ 0,00.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-3">
                    <div class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 w-100">
                        <div class="d-flex flex-wrap justify-content-center justify-content-lg-end gap-2 w-100">
                            <button id="btnGuardar_modificarAsientoContable" type="button" class="btn btn-primary">Guardar cambios</button>
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>