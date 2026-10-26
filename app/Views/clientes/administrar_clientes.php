<div class="card">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading">
            <div class="sac-page-heading__text">
                <h2 class="card-title sac-page-title">
                    Clientes
                </h2>
                <p class="sac-page-description">En esta sección se listan todos los Clientes del sistema.</p>
            </div>
            <button id="btnNuevoCliente" class="btn sac-btn-primary" type="button">
                <i class="bi bi-person-add" aria-hidden="true"></i> Nuevo Cliente
            </button>
        </div>
    </div>
    <div class="card-body">
        <div class="col-lg-12 col-">
            <table id="datatable_list_clientes" class="table table-bordered table-striped dt-responsive nowrap w-100">
                <thead>
               
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php 
    require_once "modal_nuevo_cliente.php";
    require_once "modal_editar_cliente.php";
    require_once "modal_detalle_cliente.php";
?>
