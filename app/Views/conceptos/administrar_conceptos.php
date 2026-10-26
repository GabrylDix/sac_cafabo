<div class="card rounded-4 overflow-hidden">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading__text">
            <h3 class="card-title sac-page-title">
                    Conceptos
            </h3>
            <p class="sac-page-description">
                Esta sección permite listar conceptos.
            </p>
        </div>
        <button id="btnNuevoConcepto" class="btn sac-btn-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Nuevo Concepto"><i class="bi bi-building-add" aria-hidden="true"></i> Nuevo Concepto</button>
    </div>
    <div class="card-body">
        <table id="datatable_conceptos" class="table table-bordered table-striped dt-responsive nowrap w-100">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>DESCRIPCION</th>
                    <th>CUENTA CONTABLE</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                </tr>
            </thead>
        </table>
    </div>
</div>

<?php
require_once "modal_nuevo_concepto.php";
require_once "modal_detalle_concepto.php";
require_once "modal_modificar_concepto.php";
?>
