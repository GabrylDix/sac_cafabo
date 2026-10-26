<?php
require_once __DIR__ . '/app/Config/config.php';

spl_autoload_register(function ($class) {
    $prefix = "App\\";
    $base_dir = __DIR__ . "/app/";

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return; // si no empieza con App\ no hace nada
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace("\\", "/", $relative_class) . ".php";

    if (file_exists($file)) {
        require $file;
    }
});