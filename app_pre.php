<?php
// Iniciar sesión si todavía no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!($_SESSION['logged'] ?? false)) {
    include __DIR__ . "/app/Views/auth/login.php";
    exit();
}

include 'app/Config/routes.php';

date_default_timezone_set('America/Argentina/Buenos_Aires');

$paramUrl = $_REQUEST;
$p = (isset($paramUrl['p']) ? $paramUrl['p'] : 'home');
$data_pages = $pages[$p];
