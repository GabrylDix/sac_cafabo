<?php
// $logon->logout();
// session_destroy();
// session_write_close();
// header("Location: index.php");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$_SESSION = [];

session_destroy();

header("Location: index.php");
exit();
