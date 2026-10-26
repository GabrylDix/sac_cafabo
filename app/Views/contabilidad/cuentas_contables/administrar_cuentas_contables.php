<div class="card rounded-4 overflow-hidden">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading__text">
            <h3 class="card-title sac-page-title">
                    Administrar Cuentas Contables
            </h3>
            <p class="sac-page-description">
                Esta sección permite listar cuentas contables.
            </p>
        </div>
        <button id="btnNuevoCuentaContable" class="btn sac-btn-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Nueva Cuenta Contable"><i class="bi bi-building-add" aria-hidden="true"></i> Nueva Cuenta Contable</button>
    </div>
    <div class="card-body">
        <table id="datatable_cuentas_contables" class="table table-bordered table-hover align-middle saf-tabla nowrap w-100">
            <thead>
            </thead>
        </table>
    </div>
</div>

<?php
require_once "modal_nuevo_cuenta_contable.php";
require_once "modal_detalle_cuenta_contable.php";
require_once "modal_modificar_cuenta_contable.php";
?>
