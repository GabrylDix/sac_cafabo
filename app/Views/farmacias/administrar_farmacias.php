<div class="card">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading">
            <div class="sac-page-heading__text">
                <h2 class="card-title sac-page-title">
                    Farmacias
                </h2>
                <p class="sac-page-description">En esta seccion se listan todas las farmacias.</p>
            </div>
            <button id="btnNuevaFarmacia" class="btn sac-btn-primary" type="button"><i class="bi bi-building-add" aria-hidden="true"></i> Nueva Farmacia</button>
        </div>
    </div>
    <div class="card-body">
        <div class="col-lg-12 col-">
            <table id="datatable_list_farmacias" class="table table-bordered table-striped dt-responsive nowrap w-100">
                <thead>
                    <tr>
                        <th>Codigo</th>
                        <th>Cuit</th>
                        <th>Codigo PAMI</th>
                        <th>Razon Social</th>
                        <th>Nombre</th>
                        <th>Provincia</th>
                        <th>Localidad</th>
                        <th>Direccion</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php 
    require_once "modal_detalle_farmacia.php";
    require_once "modal_editar_farmacia.php";
    require_once "modal_nueva_farmacia.php";
?>
