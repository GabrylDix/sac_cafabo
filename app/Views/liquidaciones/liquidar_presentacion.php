<div class="card rounded-4 overflow-hidden">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading__text">
            <h3 class="card-title sac-page-title">
                    Liquidación de Presentaciones
            </h3>
            <p class="sac-page-description">
                Esta sección permite listar liquidaciones.
            </p>
        </div>
        <div class="d-flex gap-2">
            <button type="button" id="btnLiquidarPresentaciones" class="btn d-flex align-items-center gap-2 btn-info" data-bs-toggle="tooltip" data-bs-placement="top" title="Liquidar Presentaciones"><span class="fs-5"><i class="bi bi-building-add"></i></span>Liquidar Presentaciones</button>
        </div>

    </div>
    <div class="card-body">
        <table id="datatable_liquidaciones" class="table table-bordered table-striped dt-responsive nowrap w-100">
            <thead>
            </thead>
        </table>
    </div>
</div>

<?php
require_once "modal_liquidacion_total.php";
// require_once "modal_detalle_liquidacion.php";
// require_once "modal_modificar_liquidacion.php";
?>
