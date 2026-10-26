<?php
session_destroy();
session_write_close();
header("Location: index.php");