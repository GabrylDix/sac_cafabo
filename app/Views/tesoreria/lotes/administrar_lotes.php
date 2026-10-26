<div class="card">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading">
            <div class="sac-page-heading__text">
                <h2 class="card-title sac-page-title">
                    Lotes
                </h2>
                <p class="sac-page-description">En esta sección se listan todos los lotes del sistema.</p>
            </div>
            <button id="btnNuevoLote" class="btn sac-btn-primary" type="button"><i class="bi bi-boxes" aria-hidden="true"></i> Generar Lote</button>
        </div>
    </div>
    <div class="card-body">
        <div class="col-lg-12 col-">
            <table id="datatable_list_lotes" class="table table-bordered table-striped dt-responsive nowrap w-100">
                <thead>
               
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php 
    // require_once "modal_nuevo_cliente.php";
    // require_once "modal_editar_cliente.php";
    require_once "modal_nuevoLote.php";
    require_once "modal_detalleLote.php";
?>
