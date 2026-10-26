<div class="card rounded-4 overflow-hidden">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading__text">
            <h3 class="card-title sac-page-title">
                    Facturas de Compra
            </h3>
            <p class="sac-page-description">
                Esta sección permite listar facturas de compra.
            </p>
        </div>
        <button id="btnNuevaFacturaCompra" class="btn sac-btn-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Nueva Factura de Compra"><i class="bi bi-building-add" aria-hidden="true"></i> Nueva Factura de Compra</button>
    </div>
    <div class="card-body">
        <table id="datatable_facturas_compra" class="table table-bordered table-striped dt-responsive nowrap w-100">
            <thead>
            </thead>
        </table>
    </div>
</div>

<?php
require_once "modal_nuevo_factura_compra.php";
require_once "modal_detalle_factura_compra.php";
require_once "modal_modificar_factura_compra.php";
?>
