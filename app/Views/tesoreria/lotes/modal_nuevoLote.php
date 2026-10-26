<div class="modal fade" id="modalGenerarLote" tabindex="-1" aria-labelledby="modalGenerarLoteLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header border-0 p-4 header-gradient-primary">
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 avatar-md me-3">
                        <div class="avatar-title bg-white bg-opacity-25 rounded-3">
                            <i class="bi bi-boxes fs-2 text-white"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <h5 class="modal-title text-white fs-4 mb-1" id="modalGenerarLoteLabel">Generar Lote</h5>
                        <p class="text-white text-opacity-75 mb-0">Defina el origen de los datos, asocie la cuenta bancaria de destino y confirme las liquidaciones o facturas a incluir.</p>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body p-0">
                <div class="container-fluid py-4">
                    <!-- Sección: Cabecera de Configuracion -->
                    <div class="card mb-4 shadow-sm border-0">
                        <div class="card-header bg-gradient-pizarra">
                            <h5 class="mb-0 text-white">
                                <i class="bi bi-gear me-2"></i>
                                Configuracion de Lote
                            </h5>
                        </div>
                        <div class="card-body p-4">
                            <div class="row g-4">
                                <section class="mb-4">
    
                                    <div class="row g-3">
                                         <!-- Select 1: Tipo de Lote -->
                                        <div class="col-12 col-md-6">
                                            <label for="tipo_lote" class="form-label select-label mb-1">
                                                <i class="bi bi-collection me-1"></i>Tipo de Lote
                                            </label>
                                            <select class="form-select" id="tipo_lote">
                                                <option value="" selected disabled>Seleccione un tipo...</option>
                                                <option value="1"> Liquidaciones</option>
                                                <option value="2"> Facturas de Compras</option>
                                            </select>
                                        </div>
                                        <!-- Select 2: Cuenta Bancaria -->
                                        <div class="col-12 col-md-6">
                                            <label for="cuenta_bancaria_NuevoLote" class="form-label select-label mb-1">
                                                <i class="bi bi-bank me-1"></i>Cuenta Bancaria
                                            </label>
                                            <select class="form-select" id="cuenta_bancaria_NuevoLote">
                                                
                                            </select>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                    <!-- Sección: Registros a Procesar -->
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-gradient-marino">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0 text-white">
                                    <i class="bi bi-ui-checks me-2"></i>
                                    Registros a Procesar
                                </h5>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="contenedor_liquidaciones" class="col-lg-12 col-" style="display: none;">
                                <table id="datatable_list_liquidaciones" class="table table-bordered table-striped dt-responsive nowrap w-100">
                                    <thead>
                                        <tr>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            <div id="contenedor_factCompra" class="col-lg-12 col-" style="display: none;">
                                <table id="datatable_list_factCompra" class="table table-bordered table-striped dt-responsive nowrap w-100">
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
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-success" id="btnConfirmarNuevoLote">
                    <i class="bi bi-check-circle me-1"></i> Generar Lote
                </button>
            </div>
        </div>
    </div>
</div>
