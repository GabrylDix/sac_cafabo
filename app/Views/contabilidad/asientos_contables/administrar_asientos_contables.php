<div class="card rounded-4 overflow-hidden">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading__text">
            <h3 class="card-title sac-page-title">
                    Asientos Contables
            </h3>
            <p class="sac-page-description">
                Esta seccion permite listar y administrar asientos contables.
            </p>
        </div>
        <button id="btnNuevoAsientoContable" class="btn sac-btn-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Nuevo Asiento Contable"><i class="bi bi-journal-plus" aria-hidden="true"></i> Nuevo Asiento Contable</button>
    </div>
    <div class="card-body">
            <table id="datatable_asientos_contables" class="table table-bordered table-striped dt-responsive nowrap w-100 sac-asiento-table">
            <thead>
            </thead>
        </table>
    </div>
</div>

<?php
require_once "modal_nuevo_asiento_contable.php";
require_once "modal_detalle_asiento_contable.php";
require_once "modal_modificar_asiento_contable.php";
?>
