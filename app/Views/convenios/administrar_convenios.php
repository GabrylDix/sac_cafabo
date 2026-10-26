<div class="card rounded-4 overflow-hidden">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading">
            <div class="sac-page-heading__text">
                <h3 class="card-title sac-page-title">
                    Convenios
                </h3>
                <p class="sac-page-description">
                    Consulta, busca y actualiza los convenios registrados.
                </p>
            </div>
        </div>
        <button id="btnNuevoConvenio" class="btn sac-btn-primary" type="button"><i class="bi bi-building-add" aria-hidden="true"></i> Nuevo convenio</button>
    </div>
    <div class="card-body">
        <table id="datatable_convenios" class="table table-bordered table-striped dt-responsive nowrap w-100">
            <thead>
                <tr>
                    <th>CODIGO</th>
                    <th>CUIT</th>
                    <th>RAZON SOCIAL</th>
                    <th>NOMBRE</th>
                    <th>ESTADO</th>
                    <th>FECHA ALTA</th>
                    <th>ACCIONES</th>
                </tr>
            </thead>
        </table>
    </div>
</div>

<?php
require_once "modal_nuevo_convenio.php";
require_once "modal_detalle_convenio.php";
require_once "modal_modificar_convenio.php";
?>
