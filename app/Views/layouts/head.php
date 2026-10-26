<!-- <head> -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta content="Premium Multipurpose Admin & Dashboard Template" name="description" />
<meta content="Themesbrand" name="author" />

<script>
    (function () {
        try {
            const theme = localStorage.getItem("sac-theme");

            if (theme === "dark" || theme === "light") {
                document.documentElement.setAttribute("data-bs-theme", theme);
                sessionStorage.setItem("data-bs-theme", theme);
            }
        } catch (error) {
            // Si el storage no esta disponible, el layout sigue con el valor por defecto.
        }
    })();
</script>

<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.2.2/css/buttons.dataTables.min.css">

<!-- Título dinámico de la página -->
<title><?php echo isset($data_pages['title']) ? htmlspecialchars($data_pages['title']) . ' | SAC' : 'SAC'; ?></title>

<!-- Para los demas UI SE QUEDA-->
<link rel="stylesheet" href="assets/libs/jquery-ui-1.13.2/jquery-ui.min.css">

<!-- App favicon -->
<link rel="shortcut icon" href="public/images/icon/audibaires_logo.png">
<link rel="icon" type="image/x-icon" href="public/images/icon/audibaires_logo.png">
<link href="https://cdn.jsdelivr.net/npm/remixicon@latest/fonts/remixicon.css" rel="stylesheet">
<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<!-- Jquery -->
<link href="https://shr.ddaval.com.ar/jquery/jquery-3.7.1.min.js" rel="stylesheet" type="text/css" />
<!-- jsvectormap css -->
<link href="https://shr.ddaval.com.ar/Velzon/material/assets/libs/jsvectormap/jsvectormap.min.css" rel="stylesheet" type="text/css" />
<!--Swiper slider css-->
<link href="https://shr.ddaval.com.ar/Velzon/material/assets/libs/swiper/swiper-bundle.min.css" rel="stylesheet" type="text/css" />
<!-- Sweet Alert css-->
<link href="https://shr.ddaval.com.ar/Velzon/material/assets/libs/sweetalert2/sweetalert2.min.css" rel="stylesheet" type="text/css" />
<!-- Layout config Js -->
<link href="https://shr.ddaval.com.ar/Velzon/material/assets/js/layout.js" rel="stylesheet" type="text/css" />
<!-- Bootstrap Css -->
<link href="https://shr.ddaval.com.ar/Velzon/material/assets/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<!-- Icons Css -->
<!-- <link href="https://shr.ddaval.com.ar/Velzon/material/assets/css/icons.min.css" rel="stylesheet" type="text/css" /> -->
<link href="public/css/icons.min.css?v=<?= filemtime('public/css/icons.min.css') ?>" rel="stylesheet" type="text/css" />
<!-- App Css-->
<link href="https://shr.ddaval.com.ar/Velzon/material/assets/css/app.min.css" rel="stylesheet" type="text/css" />
<!-- custom Css-->
<link href="public/css/myAlert.css<?php echo '?v=' . date("YmdHis"); ?>" id="app-style" rel="stylesheet" type="text/css" />
<!-- custom Css-->
<link href="public/css/custom.css<?php echo '?v=' . date("YmdHis"); ?>" id="app-style" rel="stylesheet" type="text/css" />
<!-- autocomplete css -->
<!-- <link rel="stylesheet" href="assets/libs/@tarekraafat/autocomplete.js/css/autoComplete.css"> -->

<link href="https://shr.ddaval.com.ar/Velzon/material/assets/libs/@simonwep/pickr/themes/classic.min.css" rel="stylesheet" type="text/css" />
<link href="https://shr.ddaval.com.ar/Velzon/material/assets/libs/@simonwep/pickr/themes/monolith.min.css" rel="stylesheet" type="text/css" />
<link href="https://shr.ddaval.com.ar/Velzon/material/assets/libs/@simonwep/pickr/themes/nano.min.css" rel="stylesheet" type="text/css" />

<!--datatable responsive css-->
<link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.2.9/css/responsive.bootstrap.min.css" />
<!--datatable css-->
<link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap5.min.css" />

<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.2.2/css/buttons.bootstrap5.min.css">
<!-- </head> -->
