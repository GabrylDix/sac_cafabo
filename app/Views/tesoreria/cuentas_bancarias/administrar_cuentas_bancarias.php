<div class="card">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading">
            <div class="sac-page-heading__text">
                <h2 class="card-title sac-page-title">
                Cuentas Bancarias
                </h2>
                <p class="sac-page-description">En esta sección se listan todas las cuentas bancarias del sistema.</p>
            </div>
            <button id="btnNuevaCuentaBancaria" class="btn sac-btn-primary" type="button">
            <i class="bi bi-wallet2" aria-hidden="true"></i> Nueva Cuenta Bancaria
            </button>
        </div>
    </div>
    <div class="card-body">
        <div class="col-lg-12 col-">
            <table id="datatable_list_cuentas_bancarias" class="table table-bordered table-striped dt-responsive nowrap w-100">
                <thead>
               
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php 
    require_once "modal_nuevo_ctas_bancarias.php";
    require_once "modal_editar_ctas_bancarias.php";
    require_once "modal_detalle_ctas_bancarias.php";
    require_once "modal_movimientosFinancieros_ctas_bancarias.php";
?>
