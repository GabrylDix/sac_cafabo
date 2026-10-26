<?php
//URLs
$pages_url = [
    'home' => array('url' => 'app/Views/home/home.php', 'urljs' => array('public/js/home/home.js'), 'title' => 'Inicio'),
    //USUARIOS
    'administrar_usuarios' => array('url' => 'app/Views/usuarios/administrar_usuarios.php', 'urljs' => array('public/js/usuarios/administrar_usuarios.js'), 'title' => 'Administrar Usuarios'),
    // PERFIL
    'perfil' => array('url' => 'app/Views/perfil/perfil.php', 'urljs' => array('public/js/perfil/perfil.js'), 'title' => 'Administrar Perfil'),
    //FARMACIAS
    'administrar_farmacias' => array('url' => 'app/Views/farmacias/administrar_farmacias.php', 'urljs' => array('public/js/farmacias/administrar_farmacias.js'), 'title' => 'Administrar Farmacias'),
    //CONVENIOS
    'administrar_convenios' => array('url' => 'app/Views/convenios/administrar_convenios.php', 'urljs' => array('public/js/convenios/administrar_convenios.js'), 'title' => 'Administrar Convenios'),
    //PRESENTACIONES
    'importar_presentaciones' => array('url' => 'app/Views/presentaciones/importar_presentaciones.php', 'urljs' => array('public/js/presentaciones/importar_presentaciones.js'), 'title' => 'Importar Presentaciones'),
    'administrar_presentaciones' => array('url' => 'app/Views/presentaciones/administrar_presentaciones.php', 'urljs' => array('public/js/presentaciones/administrar_presentaciones.js'), 'title' => 'Administrar Presentaciones'),
    //LIQUIDACIONES
    'liquidar_presentacion' => array('url' => 'app/Views/liquidaciones/liquidar_presentacion.php', 'urljs' => array('public/js/liquidaciones/liquidar_presentacion.js'), 'title' => 'Liquidar Presentaciones'),
    'administrar_liquidaciones' => array('url' => 'app/Views/liquidaciones/administrar_liquidaciones.php', 'urljs' => array('public/js/liquidaciones/administrar_liquidaciones.js'), 'title' => 'Administrar Liquidaciones'),
    //TESORERIA
    'administrar_clientes' => array('url' => 'app/Views/clientes/administrar_clientes.php', 'urljs' => array('public/js/clientes/administrar_clientes.js')),
    'administrar_conceptos' => array('url' => 'app/Views/conceptos/administrar_conceptos.php', 'urljs' => array('public/js/conceptos/administrar_conceptos.js')),
    'administrar_proveedores' => array('url' => 'app/Views/proveedores/administrar_proveedores.php', 'urljs' => array('public/js/proveedores/administrar_proveedores.js'), 'title' => 'Administrar Proveedores'),
    'administrar_cuentas_bancarias' => array('url' => 'app/Views/tesoreria/cuentas_bancarias/administrar_cuentas_bancarias.php', 'urljs' => array('public/js/tesoreria/cuentas_bancarias/administrar_cuentas_bancarias.js'), 'title' => 'Administrar Cuentas Bancarias'),
    'recibo_cobranza' => array('url' => 'app/Views/tesoreria/recibo_cobranza/administrar_recibos_cobranza.php', 'urljs' => array('public/js/tesoreria/recibo_cobranza/administrar_recibos_cobranza.js'), 'title' => 'Recibo de Cobranza'),
    'administrar_facturas_compra' => array('url' => 'app/Views/tesoreria/facturas_compra/administrar_facturas_compra.php', 'urljs' => array('public/js/tesoreria/facturas_compra/administrar_facturas_compra.js'), 'title' => 'Administrar Facturas de Compra'),
    'administrar_lotes' => array('url' => 'app/Views/tesoreria/lotes/administrar_lotes.php', 'urljs' => array('public/js/tesoreria/lotes/administrar_lotes.js')),
    //CONTABILIDAD
    'administrar_cuentas_contables' => array('url' => 'app/Views/contabilidad/cuentas_contables/administrar_cuentas_contables.php', 'urljs' => array('public/js/contabilidad/cuentas_contables/administrar_cuentas_contables.js'), 'title' => 'Administrar Cuentas Contables'),
    'administrar_asientos_contables' => array('url' => 'app/Views/contabilidad/asientos_contables/administrar_asientos_contables.php', 'urljs' => array('public/js/contabilidad/asientos_contables/administrar_asientos_contables.js'), 'title' => 'Administrar Asientos Contables'),
    'libro_mayor' => array('url' => 'app/Views/contabilidad/reportes_contables/libro_mayor/libro_mayor.php', 'urljs' => array('public/js/contabilidad/reportes_contables/libro_mayor/libro_mayor.js'), 'title' => 'Libro Mayor'),
    'libro_diario' => array('url' => 'app/Views/contabilidad/reportes_contables/libro_diario/libro_diario.php', 'urljs' => array('public/js/contabilidad/reportes_contables/libro_diario/libro_diario.js'), 'title' => 'Libro Diario'),
    //DEV
    'pruebas_dixon' => array('url' => 'app/Views/dev/pruebas_gabriel.php', 'urljs' => array('public/js/dev/pruebas_gabriel.js'), 'title' => 'Pruebas Dixon')

];

$pages_rol = [
    //SUPER ADMIN AUDIBAIRES
    1 => ['home', 'administrar_usuarios', 'perfil', 'administrar_farmacias', 'administrar_convenios', 'importar_presentaciones', 'administrar_presentaciones', 'liquidar_presentacion', 'administrar_liquidaciones', 'administrar_clientes', 'administrar_conceptos', 'administrar_proveedores', 'administrar_cuentas_bancarias', 'recibo_cobranza', 'administrar_facturas_compra', 'administrar_lotes', 'administrar_cuentas_contables', 'administrar_asientos_contables', 'libro_mayor', 'libro_diario', 'pruebas_dixon'],
    //ADMINISTRADOR
    2 => ['home', 'administrar_usuarios', 'perfil', 'administrar_farmacias', 'administrar_convenios', 'importar_presentaciones', 'administrar_presentaciones', 'liquidar_presentacion', 'administrar_liquidaciones', 'administrar_clientes', 'administrar_conceptos', 'administrar_proveedores', 'administrar_cuentas_bancarias', 'recibo_cobranza', 'administrar_facturas_compra', 'administrar_lotes', 'administrar_cuentas_contables', 'administrar_asientos_contables', 'libro_mayor', 'libro_diario']
];

// OBTENGO EL ROL DEL USUARIO
$rol = $_SESSION['auth_data']['rol_id'] ?? null;

// INICIALIZO EL ARRAY DE PAGINACION
$pages = [];

// Si el rol existe, agregamos las páginas que puede ver
if ($rol && isset($pages_rol[$rol])) {
    foreach ($pages_rol[$rol] as $page_key) {
        if (isset($pages_url[$page_key])) {
            $pages[$page_key] = $pages_url[$page_key];
        }
    }
}
