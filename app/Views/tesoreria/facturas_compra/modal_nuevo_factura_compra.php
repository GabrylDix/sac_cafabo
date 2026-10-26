<div id="modalAgregarFacturaCompra" class="modal fade" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true" data-dismiss="modal">
    <div class="modal-dialog modal-xxl">
        <div class="modal-content">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-white" style="width: 56px; height: 56px;">
                            <i class="bi bi-building fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="modalCuentaContableAltaLabel">Nueva Factura de Compra</h2>
                            <p class="text-muted mb-0">Dar de alta una Factura de Compra</p>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="form_cargar_factura_compra" class="needs-validation" autocomplete="off" novalidate>
                    <div class="contenedor-totales" style="width: 100%;">
                        <div class="d-flex align-items-center mb-3 px-2">
                            <div class="icon-box-top-success me-2">
                                <i class="bi bi-file-earmark-post text-white" style="font-size: 14px;"></i>
                            </div>
                            <h5 class="mb-0 fw-bold text-dark">Cabecera de Factura</h5>
                        </div>
                        <div class="row g-3 mb-3 px-2">
                            <div class="col-lg-3">
                                <label for="tipo_factura" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-file-earmark-text me-1"></i>Tipo Factura <span class="text-danger">*</span>
                                </label>
                                <select id="tipo_factura" class="form-select" required>
                                    <option value="" disabled selected> -- Seleccionar -- </option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                </select>
                            </div>
                            <div class="col-lg-3">
                                <label for="nro_comprobante" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-123 me-1"></i>Nro. Factura <span class="text-danger">*</span>
                                </label>
                                <input id="nro_comprobante" class="form-control" required type="text" maxlength="14" placeholder="0001-00000001">
                            </div>

                            <div class="col-lg-3">
                                <label for="fecha_comprobante" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-calendar-date me-1"></i>Fecha Comprobante <span class="text-danger">*</span>
                                </label>
                                <input type='date' id="fecha_comprobante" class="form-control" required>
                            </div>
                            <div class="col-lg-3">
                                <label for="fecha_vencimiento_comprobante" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-calendar-x me-1"></i>Fecha Vencimiento
                                </label>
                                <input type='date' id="fecha_vencimiento_comprobante" class="form-control">
                            </div>
                            <div class="col-lg-3">
                                <label for="cai" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-upc-scan me-1"></i>CAI
                                </label>
                                <input id="cai" class="form-control" type="text" maxlength="16" placeholder="0000000000000000">
                            </div>
                            <div class="col-lg-3">
                                <label for="fecha_vencimiento_comprobante_cai" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-calendar-x me-1"></i>Fecha Venc. CAI
                                </label>
                                <input type='date' id="fecha_vencimiento_comprobante_cai" class="form-control">
                            </div>
                            <div class="col-lg-12">
                                <label for="descripcion" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-text-paragraph me-1"></i>Descripción <span class="text-danger">*</span>
                                </label>
                                <input id="descripcion" class="form-control" required type="text" placeholder="Factura de compra">
                            </div>
                            <div class="col-lg-4">
                                <label for="id_proveedor" class="form-label text-muted fw-medium small mb-1 label_sugerencia">
                                    <i class="bi bi-person-badge me-1"></i>Proveedor <span class="text-danger">*</span>
                                </label>
                                <select id="id_proveedor" class="form-select" required>
                                    <option value="">Seleccione un proveedor...</option>
                                </select>
                            </div>
                            <div class="input-group my-2" style="display: none;">
                                <label class="input-group-text">Codigo Proveedor</label>
                                <input type="text" class="form-control" id="id_cod_proveedor" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" disabled>
                            </div>

                            <div class="col-lg-4">
                                <label for="razon_social" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-building me-1"></i>Razón Social
                                </label>
                                <input id="razon_social" class="form-control" disabled placeholder="Razón Social">
                            </div>
                            <div class="col-lg-4">
                                <label for="cuit_prov" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-card-text me-1"></i>Cuit
                                </label>
                                <input id="cuit_prov" class="form-control" disabled placeholder="Cuit">
                            </div>
                            <!-- <div class="col-lg-4">
                                <label for="centro_costo" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-diagram-3 me-1"></i>Centro de Costos
                                </label>
                                <select id="centro_costo" class="form-select"></select>
                            </div> -->
                            <!-- <div class="col-lg-4">
                                <label for="moneda_alt" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-currency-exchange me-1"></i>Moneda
                                </label>
                                <select id="moneda_alt" class="form-select">
                                    <option value="" disabled selected> -- Seleccionar -- </option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <label for="tipo_pago" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-credit-card me-1"></i>Tipo de Pago
                                </label>
                                <select id="tipo_pago" class="form-select">
                                    <option value="" disabled selected> -- Seleccionar -- </option>
                                </select>
                            </div> -->
                            <div class="col-lg-4 d-flex align-items-end">
                                <button id="btn_next" type="button" class="btn btn-success w-100">Siguiente</button>
                            </div>
                        </div>
                    </div>
                </form>

                <!-- <hr> -->
                <div id="detalle_factura_compra" style="display: none;">
                    <fieldset class="border p-3 mb-3">
                        <legend class="float-none w-auto px-2 text-start">Detalle de Factura</legend>
                        <form class="row g-3" id="form_agregar_detalle" autocomplete="off">
                            <div class="col-lg-4">
                                <label for="descripcion_det" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-text-paragraph me-1"></i>Descripción <span class="text-danger">*</span>
                                </label>
                                <input id="descripcion_det" class="form-control" required type="text" placeholder="Descripcion">
                            </div>
                            <div class="col-lg-4">
                                <label for="concepto_id_det" class="form-label text-muted fw-medium small mb-1 label_sugerencia">
                                    <i class="bi bi-tag me-1"></i>Concepto <span class="text-danger">*</span>
                                </label>
                                <select id="concepto_id_det" class="form-select" required>
                                    <option value="">Seleccione un concepto...</option>
                                </select>
                            </div>
                            <!-- <div class="col-lg-3">
                                <label for="descripcion_concepto_det" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-card-text me-1"></i>Descripción Concepto
                                </label>
                                <input id="descripcion_concepto_det" class="form-control" type="text" placeholder="Descripción del concepto" readonly>
                            </div> -->

                            <div class="col-lg-4">
                                <label for="cuenta_contable_det" class="form-label text-muted fw-medium small mb-1 label_sugerencia">
                                    <i class="bi bi-journal-text me-1"></i>Cuenta Contable
                                </label>
                                <input id="cuenta_contable_det" class="form-control" type="text" placeholder="Cuenta contable" readonly>
                            </div>
                            <!-- <div class="col-lg-4">
                                <label for="centro_costo_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-diagram-3 me-1"></i>Centro Costo <span class="text-danger">*</span>
                                </label>
                                <select type="text" id="centro_costo_alta" class="form-select" required> </select>
                            </div> -->
                            <div class="col-lg-2">
                                <label for="cantidad" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-123 me-1"></i>Cantidad <span class="text-danger">*</span>
                                </label>
                                <input id="cantidad" class="form-control" required type="number" value="1">
                            </div>
                            <div class="col-lg-2">
                                <label for="precio_unitario" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-currency-dollar me-1"></i>Precio Unitario <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="precio_unitario" class="form-control" required placeholder="0.00">
                            </div>
                            <div class="col-lg-2">
                                <label for="subtotal" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-calculator me-1"></i>Subtotal
                                </label>
                                <input id="subtotal" class="form-control" type="text" disabled placeholder="0.00">
                            </div>
                            <div class="col-lg-2">
                                <label for="porc_bonif" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-percent me-1"></i>% Bonificación
                                </label>
                                <input id="porc_bonif" class="form-control" type="text" value="0" placeholder="0.00">
                            </div>
                            <div class="col-lg-2">
                                <label for="monto_bonif" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-dash-circle me-1"></i>Monto Bonificado
                                </label>
                                <input id="monto_bonif" class="form-control" type="text" disabled placeholder="0.00">
                            </div>
                            <div class="col-lg-2">
                                <label for="total" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-cash me-1"></i>Neto
                                </label>
                                <input id="total" class="form-control" type="text" disabled placeholder="0.00">
                            </div>
                            <div class="col-lg-4">
                                <label for="iva_sel" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-receipt me-1"></i>IVA <span class="text-danger">*</span>
                                </label>
                                <!-- <select id="iva_sel" class="form-select" required> </select> -->
                                <select id="iva_sel" class="form-control" required="">
                                    <option value="" disabled="">Seleccionar</option>
                                    <option value="3" selected="">0%</option>
                                    <option value="4">10.5%</option>
                                    <option value="5">21%</option>
                                    <option value="6">27%</option>
                                    <option value="8">5%</option>
                                    <option value="9">2.5%</option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <label for="total_iva" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-plus-circle me-1"></i>Importe IVA
                                </label>
                                <input id="total_iva" class="form-control" type="text" disabled placeholder="0.00">
                            </div>
                            <div class="col-lg-4">
                                <label for="total_c_iva" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-cash-stack me-1"></i>Total Con IVA
                                </label>
                                <input id="total_c_iva" class="form-control" type="text" disabled placeholder="0.00">
                            </div>
                            <div class="col-lg-12">
                                <label for="observaciones" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-chat-text me-1"></i>Observaciones
                                </label>
                                <textarea id="observaciones" class="form-control" rows="2" maxlength="255" placeholder="Observaciones"></textarea>
                            </div>
                        </form>
                        <div class="col-xs-12 my-3">
                            <button id="btnConfirmarAltaDet" type="button" class="btn btn-success">Agregar Detalle</button>
                            <button id="btnConfirmarEditDetAlta" type="button" class="btn btn-success d-none">Modificar Detalle</button>
                            <button id="btnCancelarEditAlta" type="button" class="btn btn-danger d-none">Cancelar</button>
                        </div>
                        <table id="datatable_factura_detalle" class="table table-striped table-bordered">
                            <thead id="thead_factura_detalle">
                                <tr>
                                    <!-- <th class="titulos-columnas">Referencia</th> -->
                                    <th class="titulos-columnas">Concepto</th>
                                    <th class="titulos-columnas">Descripcion</th>
                                    <th class="titulos-columnas">Cantidad</th>
                                    <th class="titulos-columnas">Precio U.</th>
                                    <th class="titulos-columnas">Subtotal</th>
                                    <th class="titulos-columnas">% Bonif.</th>
                                    <th class="titulos-columnas">Bonif.</th>
                                    <th class="titulos-columnas">Total</th>
                                    <th class="titulos-columnas">% IVA</th>
                                    <th class="titulos-columnas">IVA</th>
                                    <th class="titulos-columnas">Total/IVA.</th>
                                    <!-- <th class="titulos-columnas">Centro de Costos</th> -->
                                    <th class="titulos-columnas">Detalle</th>
                                    <!-- <th class="titulos-columnas">Concepto</th> -->
                                    <!-- <th class="titulos-columnas">Cuenta Contable</th> -->
                                    <th class="titulos-columnas">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tbody_factura_detalle">
                            </tbody>
                        </table>
                    </fieldset>
                </div>

                <div class="row pt-5">
                    <!-- <form id="form_percepciones" class="col-lg-8">
                        <fieldset class="border p-3 mb-3">
                            <legend class="float-none w-auto px-2 text-start">Percepciones</legend>
                  
                    <div class="row g-2 align-items-end mb-3">
                        <div class="col-lg-6">
                            <label for="id_percepcion" class="form-label text-muted fw-medium small mb-1 label_sugerencia">
                                <i class="bi bi-percent me-1"></i>Percepción <span class="text-danger">*</span>
                            </label>
                            <input id="id_percepcion" class="form-control" type="text" placeholder="Buscar Percepciones o Retenciones" required>
                        </div>
                        <div class="col-lg-3">
                            <label for="total_per" class="form-label text-muted fw-medium small mb-1">
                                <i class="bi bi-cash me-1"></i>Total <span class="text-danger">*</span>
                            </label>
                            <input id="total_per" class="form-control" type="text" required placeholder="0.00">
                        </div>
                        <div class="col-lg-3">
                            <button id="btnAgregarPercepcion" class="btn btn-success w-100">Agregar</button>
                        </div>
                    </div>
                    <table id="datatable_percepciones_detalle" class="table table-striped table-bordered">
                        <thead id="thead_percepciones_detalle">
                            <tr>
                                <th class="titulos-columnas">Percepcion</th>
                                <th class="titulos-columnas">Total</th>
                                <th class="titulos-columnas">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tbody_percepciones_detalle">
                        </tbody>
                    </table>
                    </fieldset>
                    </form> -->
                    <!-- <div class="card shadow p-3 mb-3 col-lg-4">
                        <legend class="float-none w-auto px-2 text-start"><i class="bi bi-bar-chart-fill text-success"></i> Detalle de totales</legend>
                        <div class=" d-flex justify-content-end flex-column">
                            <div class="d-flex justify-content-end flex-column p-3">
                                <div class="me-3">
                                    <label for="imp_net_grav" class="fs-5 ">Neto Gravado:</label>
                                    <label id="imp_net_grav" class="fs-5 ps-4">$ 0,00</label>
                                </div>
                                <div class="me-3">
                                    <label for="iva" class="fs-5 ">IVA:</label>
                                    <label id="iva" class="fs-5 ps-4">$ 0,00</label>
                                </div>
                            
                                <p>TOTAL FACTURA</p>
                                <div class="me-3">

                                    <label id="total_lb" class="fs-1 fw-bolder ps-4">$ 0,00</label>
                                </div>
                            </div>
                        </div>
                    </div> -->
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
                                <span id="imp_net_grav" class="text-value">$ 0,00</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-label">Neto No Gravado</span>
                                <span id="imp_net_no_grav" class="text-value">$ 0,00</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-label">Bonificacion</span>
                                <span id="bonificacion_total" class="text-value">$ 0,00</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-label">IVA</span>
                                <span id="iva" class="text-value">$ 0,00</span>
                            </div>

                            <hr class="divider-custom">

                            <div class="d-flex justify-content-between align-items-end">
                                <div>
                                    <div class="total-title text-uppercase mb-1">TOTAL FACTURA</div>
                                    <div id="total_factura_general" class="total-amount">$ 0,00</div>
                                </div>
                                <div>
                                    <i class="bi bi-cash icon-bottom-right"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col-xs-12 text-center">
                        <button id="btnAgregarFacturaCompra" type="button" class="btn btn-success">Confirmar</button>
                        <button id="btn_cerrar_modal" type="button" class="btn btn-danger">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
