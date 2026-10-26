<!-- ========== App Menu ========== -->
<div class="app-menu navbar-menu">
    <!-- LOGO -->
    <div class="navbar-brand-box">
        <!-- Dark Logo-->
        <a href="index.php" class="logo logo-dark">
            <span class="logo-sm">
                <img src="public/images/audibaires_logo.png" alt="" height="35">
            </span>
            <span class="logo-lg">
                <img src="public/images/audibaires.png" alt="" height="35">
            </span>
        </a>
        <!-- Light Logo-->
        <a href="index.php" class="logo logo-light">
            <span class="logo-sm">
                <img src="public/images/audibaires_logo.png" alt="" height="35">
            </span>
            <span class="logo-lg">
                <img src="public/images/audibaires.png" alt="" height="35">
            </span>
        </a>
        <button type="button" class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover">
            <i class="ri-record-circle-line"></i>
        </button>
    </div>

    <div id="scrollbar">
        <div class="container-fluid">

            <div id="two-column-menu">
            </div>
            <ul class="navbar-nav" id="navbar-nav">
                <?php
                switch ($_SESSION['auth_data']['rol_id']) {
                    case 1:
                        require_once 'app/Views/layouts/sidebar/menu_admin_audibaires.php';
                        break;
                    default:
                        require_once  'app/Views/layouts/sidebar/menu_user_admin.php';
                        break;
                }
                ?>
            </ul>
        </div>
        <!-- Sidebar -->
    </div>

    <div class="sidebar-background"></div>
</div>
<!-- Left Sidebar End -->
<!-- Vertical Overlay-->
<div class="vertical-overlay"></div>