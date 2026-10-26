<div id="modalReciboAlta" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalConvenioDetalleLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1200px;">
        <div class="modal-content border-0 shadow-lg" style="max-height: 90vh;">
            <div class="modal-header border-0 py-3">
                <div class="d-flex align-items-center justify-content-between w-100 gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-white" style="width: 56px; height: 56px;">
                            <i class="bi bi-file-earmark-binary fs-3"></i>
                        </div>
                        <div>
                            <h2 class="modal-title fs-2 fw-bold mb-1" id="id_nombre_alta">Nuevo Recibo</h2>
                            <p class="text-muted mb-0">Crear un Recibo</p>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <hr class="m-0">

            <div class="modal-body px-4 pb-4" style="overflow-y: auto;">

                <form id="formAltaRecibo" class="needs-validation" autocomplete="off" novalidate>
                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-receipt text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Cabecera</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="nro_comprobante_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-hash me-1"></i>Nro Comprobante <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="nro_comprobante_alta" class="form-control" placeholder="Ingrese Nro Comprobante" required>
                            </div>
                            <div class="col-md-4">
                                <label for="fecha_comprobante_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-calendar-date me-1"></i>Fecha Comprobante <span class="text-danger">*</span>
                                </label>
                                <input type="date" id="fecha_comprobante_alta" class="form-control" required>
                            </div>
                            <div class="col-md-4">
                                <label for="importe_total_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-currency-dollar me-1"></i>Total <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="importe_total_alta" class="form-control" placeholder="$ 0,00" inputmode="decimal" disabled>
                            </div>
                        </div>
                    </section>

                    <hr>

                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-person text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Cliente</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="cliente_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-person-vcard me-1"></i>Cliente
                                </label>
                                <select id="cliente_alta" class="form-select">
                                    <option value="" selected>Seleccione Cliente</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="cliente_nombre_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-person-fill me-1"></i>Cliente <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="cliente_nombre_alta" class="form-control" placeholder="Ingrese Nombre Cliente" required>
                            </div>
                        </div>
                    </section>

                    <hr>

                    <section class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="bi bi-chat-left-text text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Observaciones</h3>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label for="observaciones_alta" class="form-label text-muted fw-medium small mb-1">
                                    <i class="bi bi-pencil me-1"></i>Observaciones
                                </label>
                                <input type="text" id="observaciones_alta" class="form-control" placeholder="Ingrese Observaciones">
                            </div>
                        </div>
                    </section>
                </form>

                <hr>

                <section class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-card-checklist text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Detalle</h3>
                        </div>
                        <button id="btnAgregarDetalleAlta" type="button" class="btn btn-primary btn-sm" data-bs-toggle="tooltip" title="Nuevo Detalle" data-expand-text="Agregar Detalle" data-collapse-text="Contraer Detalle">
                            <i class="bi bi-plus-circle me-1 toggle-icon"></i><span class="toggle-text">Agregar Detalle</span>
                        </button>
                    </div>

                    <div class="collapse" id="formContainerDetalleAlta">
                        <div class="card card-body mb-3">
                            <h5 class="card-title" id="formDetalleTitle_alta">Gestionar Detalle</h5>
                            <hr>
                            <form id="formDetalleAlta" class="needs-validation" novalidate>
                                <!-- <input type="hidden" id="id_detalle_form_alta"> -->
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="concepto_detalle_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-person-fill me-1"></i> Concepto<span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="concepto_detalle_alta" placeholder="Ingrese Concepto" required>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="importe_detalle_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-currency-dollar me-1"></i> importe <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control js-input-moneda" id="importe_detalle_alta" placeholder="$ 0,00" inputmode="decimal" autocomplete="off" required>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="observaciones_detalle_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-pencil-square me-1"></i> observaciones <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="observaciones_detalle_alta" placeholder="Ingrese Observaciones" required>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-light" id="btnCancelarDetalleAlta">Cancelar</button>
                                    <button type="button" class="btn btn-success" id="btnGuardarDetalleAlta">Guardar Detalle</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <table id="datatable_detalles_alta" class="table table-striped" style="width:100%;">
                        <thead></thead>
                    </table>
                </section>

                <hr>

                <section class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-card-checklist text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Pagos</h3>
                        </div>
                        <button id="btnAgregarPagoAlta" type="button" class="btn btn-primary btn-sm" data-bs-toggle="tooltip" title="Nuevo Pago" data-expand-text="Agregar Pago" data-collapse-text="Contraer Pago">
                            <i class="bi bi-plus-circle me-1 toggle-icon"></i><span class="toggle-text">Agregar Pago</span>
                        </button>
                    </div>

                    <div class="collapse" id="formContainerPagoAlta">
                        <div class="card card-body mb-3">
                            <h5 class="card-title" id="formPagoTitle_alta">Gestionar Pago</h5>
                            <hr>
                            <form id="formPagoAlta" class="needs-validation" novalidate>
                                <!-- <input type="hidden" id="id_pago_form_alta"> -->
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="tipo_pago_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-wallet2 me-1"></i> Tipo Pago<span class="text-danger">*</span></label>
                                        <select class="form-select" id="tipo_pago_alta" required>
                                            <option value="" selected disabled>Seleccione tipo de pago</option>
                                            <option value="TRA">Transferencia</option>
                                            <option value="EFE">Efectivo</option>
                                            <option value="CHC">Cheque</option>
                                            <option value="CHD">Cheque Diferido</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="importe_pago_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-currency-dollar me-1"></i> importe <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control js-input-moneda" id="importe_pago_alta" placeholder="$ 0,00" inputmode="decimal" autocomplete="off" required>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="id_cuenta_pago_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-bank me-1"></i> Cuenta Bancaria<span class="text-danger" id="cuentaPagoObligatoria_alta" style="display: none;">*</span></label>
                                        <select class="form-select" id="id_cuenta_pago_alta" disabled>
                                            <option value="" selected>Seleccione cuenta bancaria</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4 mb-3 d-none" id="grupoNumeroChequeAlta">
                                        <label for="numero_cheque_pago_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-upc-scan me-1"></i> Nro Cheque<span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="numero_cheque_pago_alta" placeholder="Ingrese Número de Cheque">
                                    </div>
                                    <div class="col-md-4 mb-3 d-none" id="grupoFechaEmisionChequeAlta">
                                        <label for="fecha_emision_pago_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-calendar-event me-1"></i> Fecha Emisión<span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" id="fecha_emision_pago_alta">
                                    </div>
                                    <div class="col-md-4 mb-3 d-none" id="grupoFechaCobroChequeAlta">
                                        <label for="fecha_cobro_pago_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-calendar-check me-1"></i> Fecha Cobro<span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" id="fecha_cobro_pago_alta">
                                    </div>
                                    <div class="col-md-12 mb-3">
                                        <label for="observaciones_pago_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-pencil-square me-1"></i> observaciones <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="observaciones_pago_alta" placeholder="Ingrese Observaciones" required>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-light" id="btnCancelarPagoAlta">Cancelar</button>
                                    <button type="button" class="btn btn-success" id="btnGuardarPagoAlta">Guardar Pago</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <table id="datatable_pagos_alta" class="table table-striped" style="width:100%;">
                        <thead></thead>
                    </table>
                </section>

                <hr>
                <section class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-card-checklist text-primary fs-5"></i>
                            <h3 class="text-dark text-uppercase fw-semibold fs-5 mb-0">Presentaciones</h3>
                        </div>
                        <button id="btnAgregarPresentacionesAlta" type="button" class="btn btn-primary btn-sm" data-bs-toggle="tooltip" title="Nueva Presentación" data-expand-text="Agregar Presentación" data-collapse-text="Contraer Presentación">
                            <i class="bi bi-plus-circle me-1 toggle-icon"></i><span class="toggle-text">Agregar Presentación</span>
                        </button>
                    </div>

                    <div class="collapse" id="formContainerPresentacionesAlta">
                        <div class="card card-body mb-3">
                            <h5 class="card-title" id="formPresentacionTitle_alta">Gestionar Presentación</h5>
                            <hr>
                            <form id="formPresentacionAlta" class="needs-validation" novalidate>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="convenio_alta" class="form-label text-muted fw-medium small mb-1">
                                            <i class="bi bi-person-vcard me-1"></i>Convenio
                                        </label>
                                        <select id="convenio_alta" class="form-select" required>
                                            <option value="" selected>Seleccione Convenio</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="presentacion_alta" class="form-label text-muted fw-medium small mb-1">
                                            <i class="bi bi-person-vcard me-1"></i>Presentación
                                        </label>
                                        <select id="presentacion_alta" class="form-select" required disabled>
                                            <option value="" selected>Seleccione Presentación</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="importe_presentacion_alta" class="form-label text-muted fw-medium small mb-1"><i class="bi bi-currency-dollar me-1"></i> importe <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control js-input-moneda" id="importe_presentacion_alta" placeholder="$ 0,00" inputmode="decimal" autocomplete="off" required>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-light" id="btnCancelarPresentacionAlta">Cancelar</button>
                                    <button type="button" class="btn btn-success" id="btnGuardarPresentacionAlta">Guardar Presentación</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <table id="datatable_presentaciones_alta" class="table table-striped" style="width:100%;">
                        <thead></thead>
                    </table>
                </section>

                <hr>

                <div class="pt-3">
                    <p class="text-muted text-center mb-0" style="font-size: 0.75rem;">
                        Los datos mostrados en este formulario son editables.<br>
                        Los campos marcados con <span class="text-danger">*</span> son obligatorios.
                    </p>
                </div>
            </div>

            <div class="modal-footer border-0 justify-content-end mt-2">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-success" id="btnConfirmarAltaRecibo">
                    <i class="bi bi-check-circle me-1"></i> Guardar Cambios
                </button>
            </div>
        </div>
    </div>
</div>