<div class="card rounded-4 overflow-hidden">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading__text">
            <h3 class="card-title sac-page-title">
                    Recibos de Cobranza
            </h3>
            <p class="sac-page-description">
                Esta sección permite listar recibos de cobranza.
            </p>
        </div>
        <button id="btnNuevoRecibo" class="btn sac-btn-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Nuevo Recibo"><i class="bi bi-file-earmark-plus" aria-hidden="true"></i> Nuevo Recibo</button>
    </div>
    <div class="card-body">
        <table id="datatable_recibos" class="table table-bordered table-striped dt-responsive nowrap w-100">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NRO COMPROBANTE</th>
                    <th>FECHA COMPROBANTE</th>
                    <th>TOTAL</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                </tr>
            </thead>
        </table>
    </div>
</div>

<?php
require_once "modal_nuevo_recibo.php";
require_once "modal_detalle_recibo.php";
require_once "modal_modificar_recibo.php";
?>
