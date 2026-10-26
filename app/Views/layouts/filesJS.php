    <!-- Jquery -->
    <script src="https://shr.ddaval.com.ar/jquery/jquery-3.7.1.min.js"></script>

    <!--DATATABLES js-->
    <!-- <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.datatables.net/responsive/2.2.9/js/dataTables.responsive.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.print.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js"></script> -->


    <!-- <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.datatables.net/responsive/2.2.9/js/dataTables.responsive.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.bootstrap5.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>

    <script src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.print.min.js"></script> -->

    <script src="https://cdn.datatables.net/v/bs5/jq-3.7.0/jszip-3.10.1/dt-2.0.8/b-3.0.2/b-colvis-3.0.2/b-html5-3.0.2/b-print-3.0.2/r-3.0.2/sc-2.4.3/sl-2.0.3/datatables.min.js"></script>

    <!-- JAVASCRIPT -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/simplebar/simplebar.min.js"></script>
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/node-waves/waves.min.js"></script>
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/feather-icons/feather.min.js"></script>
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/js/pages/plugins/lord-icon-2.1.0.js"></script>
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/js/plugins.js"></script>

    <!-- apexcharts -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/apexcharts/apexcharts.min.js"></script>
    <!-- Modern colorpicker bundle -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/@simonwep/pickr/pickr.min.js"></script>
    <!-- init js -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/js/pages/form-pickers.init.js"></script>
    <!-- App js -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/js/app.js"></script>
    <script src="public/js/helpers/theme_persistence.js?v=<?= filemtime('public/js/helpers/theme_persistence.js') ?>"></script>
    <!-- Vector map-->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/jsvectormap/js/jsvectormap.min.js"></script>

    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/jsvectormap/maps/world-merc.js"></script>
    <!--Swiper slider js-->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/swiper/swiper-bundle.min.js"></script>
    <!-- Dashboard init -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/js/pages/dashboard-ecommerce.init.js"></script>
    <!-- Sweet Alerts js -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/sweetalert2/sweetalert2.min.js"></script>
    <!-- Sweet alert init js-->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/js/pages/sweetalerts.init.js"></script>
    <!-- flatpickr.js -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/flatpickr/flatpickr.min.js"></script>
    <!-- cleave.js -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/cleave.js/cleave.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/flatpickr@latest/dist/plugins/monthSelect/index.js"></script>
    <script src="https://npmcdn.com/flatpickr@4.6.13/dist/l10n/es.js"></script>
    <!-- autocomplete js -->
    <script src="https://shr.ddaval.com.ar/Velzon/material/assets/libs/@tarekraafat/autocomplete.js/autoComplete.min.js"></script>
    <!-- Choices.js (CDN) -->
    <script src="https://shr.ddaval.com.ar/Velzon/modern/assets/libs/choices.js/public/assets/scripts/choices.min.js"></script>
    <script src="public/js/custom.min.js"></script>
    <script src="public/js/helpers/formatos.js?v=<?= filemtime('public/js/helpers/formatos.js') ?>"></script>
    <script src="public/js/helpers/validaciones.js?v=<?= filemtime('public/js/helpers/validaciones.js') ?>"></script>


    <?php
    if (isset($data_pages['urljs'])) {
        if (count($data_pages['urljs']) > 0) {
            echo "<!--Scripts for pages-->";
            for ($i = 0; $i < count($data_pages['urljs']); $i++) {
    ?>
                <script src="<?php echo $data_pages['urljs'][$i] . '?v=' . date("YmdHis"); ?>"></script>
    <?php
            }
        }
    }
    ?>
