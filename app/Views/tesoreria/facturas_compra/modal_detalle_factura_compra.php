<div id="modalDetalleFacturaCompra" class="modal fade" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true" data-dismiss="modal">
    <div class="modal-dialog modal-xxl">
        <div class="modal-content">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex align-items-center justify-content-center rounded-3 bg-info text-white" style="width: 56px; height: 56px;">
                            <i class="bi bi-receipt-cutoff fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1">Detalle de Factura de Compra</h2>
                            <p class="text-muted mb-0">Consulta de cabecera, detalle y totales de la factura</p>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="contenedor-totales" style="width: 100%;">
                    <div class="d-flex align-items-center mb-3 px-2">
                        <div class="icon-box-top-success me-2">
                            <i class="bi bi-file-earmark-post text-white" style="font-size: 14px;"></i>
                        </div>
                        <h5 class="mb-0 fw-bold text-dark">Cabecera de Factura</h5>
                    </div>
                    <div class="row g-3 mb-3 px-2">
                        <div class="col-lg-4">
                            <label for="tipo_factura_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-file-earmark-text me-1"></i>Tipo Factura
                            </label>
                            <input id="tipo_factura_detalle" class="form-control" type="text" disabled>
                        </div>
                        <div class="col-lg-4">
                            <label for="nro_comprobante_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-123 me-1"></i>Nro. Factura
                            </label>
                            <input id="nro_comprobante_detalle" class="form-control" type="text" disabled>
                        </div>
                        <div class="col-lg-4">
                            <label for="fecha_comprobante_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-calendar-date me-1"></i>Fecha Comprobante
                            </label>
                            <input type="date" id="fecha_comprobante_detalle" class="form-control" disabled>
                        </div>
                        <div class="col-lg-4">
                            <label for="fecha_vencimiento_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-calendar-x me-1"></i>Fecha Vencimiento
                            </label>
                            <input type="date" id="fecha_vencimiento_detalle" class="form-control" disabled>
                        </div>
                        <div class="col-lg-4">
                            <label for="cai_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-upc-scan me-1"></i>CAI
                            </label>
                            <input id="cai_detalle" class="form-control" type="text" disabled>
                        </div>
                        <div class="col-lg-4">
                            <label for="fecha_vencimiento_cai_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-calendar-x me-1"></i>Fecha Venc. CAI
                            </label>
                            <input type="date" id="fecha_vencimiento_cai_detalle" class="form-control" disabled>
                        </div>
                        <div class="col-lg-12">
                            <label for="descripcion_factura_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-text-paragraph me-1"></i>Descripcion
                            </label>
                            <input id="descripcion_factura_detalle" class="form-control" type="text" disabled>
                        </div>
                        <div class="col-lg-6">
                            <label for="razon_social_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-building me-1"></i>Razon Social
                            </label>
                            <input id="razon_social_detalle" class="form-control" type="text" disabled>
                        </div>
                        <div class="col-lg-6">
                            <label for="cuit_prov_detalle" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-card-text me-1"></i>Cuit
                            </label>
                            <input id="cuit_prov_detalle" class="form-control" type="text" disabled>
                        </div>
                    </div>
                </div>

                <div id="detalle_factura_compra_detalle">
                    <fieldset class="border p-3 mb-3">
                        <legend class="float-none w-auto px-2 text-start">Detalle de Factura</legend>
                        <table id="datatable_factura_detalle_modal" class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th class="titulos-columnas">Concepto</th>
                                    <th class="titulos-columnas">Descripcion</th>
                                    <th class="titulos-columnas">Cantidad</th>
                                    <th class="titulos-columnas">Precio U.</th>
                                    <th class="titulos-columnas">Subtotal</th>
                                    <th class="titulos-columnas">% Bonif.</th>
                                    <th class="titulos-columnas">Bonif.</th>
                                    <th class="titulos-columnas">Neto</th>
                                    <th class="titulos-columnas">% IVA</th>
                                    <th class="titulos-columnas">IVA</th>
                                    <th class="titulos-columnas">Total/IVA</th>
                                    <th class="titulos-columnas">Detalle</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </fieldset>
                </div>

                <div class="row pt-5">
                    <div class="contenedor-totales" style="width: 100%; max-width: 450px;">
                        <div class="d-flex align-items-center mb-3 px-2">
                            <div class="icon-box-top-success me-2">
                                <i class="bi bi-bar-chart-fill text-white" style="font-size: 14px;"></i>
                            </div>
                            <h5 class="mb-0 fw-bold text-dark">Detalle de Totales</h5>
                        </div>

                        <div class="card border-0 card-custom bg-white p-4">
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-label">Neto Gravado</span>
                                <span id="imp_net_grav_detalle" class="text-value">$ 0,00</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-label">Neto No Gravado</span>
                                <span id="imp_net_no_grav_detalle" class="text-value">$ 0,00</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-label">Bonificacion</span>
                                <span id="bonificacion_total_detalle" class="text-value">$ 0,00</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-label">IVA</span>
                                <span id="iva_detalle" class="text-value">$ 0,00</span>
                            </div>

                            <hr class="divider-custom">

                            <div class="d-flex justify-content-between align-items-end">
                                <div>
                                    <div class="total-title text-uppercase mb-1">TOTAL FACTURA</div>
                                    <div id="total_factura_general_detalle" class="total-amount">$ 0,00</div>
                                </div>
                                <div>
                                    <i class="bi bi-cash icon-bottom-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="col-xs-12 text-center">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</div>