<div class="card">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading">
            <div class="sac-page-heading__text">
                <h2 class="card-title sac-page-title">
                    Proveedores
                </h2>
                <p class="sac-page-description">En esta sección se listan todos los proveedores del sistema.</p>
            </div>
            <button id="btnNuevoProveedor" class="btn sac-btn-primary" type="button">
                <i class="bi bi-building-add" aria-hidden="true"></i> Nuevo Proveedor
            </button>
        </div>
    </div>
    <div class="card-body">
        <div class="col-lg-12 col-">
            <table id="datatable_list_proveedores" class="table table-bordered table-striped dt-responsive nowrap w-100">
                <thead>
               
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php 
    require_once "modal_nuevo_proveedor.php";
    require_once "modal_editar_proveedor.php";
    require_once "modal_detalle_proveedor.php";
?>
