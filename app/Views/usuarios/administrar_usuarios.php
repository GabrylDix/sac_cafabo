<div class="card">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading">
            <div class="sac-page-heading__text">
                <h2 class="card-title sac-page-title">
                    Usuarios
                </h2>
                <p class="sac-page-description">En esta seccion se listan todos usuarios del sistema.</p>
            </div>
            <button id="btnNuevoUsuario" class="btn sac-btn-primary" type="button"><i class="bi bi-person-add" aria-hidden="true"></i> Nuevo Usuario</button>
        </div>
    </div>
    <div class="card-body">
        <div class="col-lg-12 col-">
            <table id="datatable_list_usuarios" class="table table-bordered table-striped dt-responsive nowrap w-100">
                <thead>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Telefono</th>
                    <th>Fecha Creacion</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php 
    require_once "modal_nuevo_usuario.php";
    require_once "modal_editar_usuario.php";
    require_once "modal_detalle_usuario.php";
?>
