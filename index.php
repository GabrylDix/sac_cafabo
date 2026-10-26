<?php

require_once __DIR__ . '/app_pre.php';

?>

<!DOCTYPE html>
<html lang="en" data-layout="vertical" data-topbar="light" data-sidebar="dark" data-sidebar-size="lg" data-sidebar-image="none" data-preloader="disable">
<?php

    if ($_SERVER['REMOTE_ADDR'] == "::1") {
        include 'app/Views/layouts/head_local.php';
    } else {
        include 'app/Views/layouts/head.php';
    }
?>

<body class="nav-md">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M6QXFXV" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div class="body">
        <!-- Begin page -->
        <div id="layout-wrapper">
            <?php include 'app/Views/layouts/menu.php'; ?>

            <div class="main-content ">

                <div role="main">
                    <div class="page-content">
                        <div class="container-fluid">

                            <div class="row">
                                <div class="col">

                                    <div class="h-100">
                                        <?php
                                            if ($data_pages['url'] == "") {
                                                $data_pages['url'] = 'modulos/vistas/home/home.php';
                                                $data_pages['urljs'] = array('modulos/vistas/home/home.js');
                                                include $data_pages['url'];
                                            } else {
                                                include $data_pages['url'];
                                            }
                                        ?>
                                        <!-- /page content -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <?php
                require 'app/Views/layouts/footer.php';
                include_once 'app/Views/components/modalMyAlert.php';
                ?>
            </div>
        </div>
        <?php
        if ($_SERVER['REMOTE_ADDR'] == "::1") {
            require 'app/Views/layouts/filesJS_local.php';
        } else {
            require 'app/Views/layouts/filesJS.php';
        }
        ?>
</body>

</html>