<?php
require_once "../libs/lessphp/lessc.inc.php";

$less = new lessc;
try {
   header("Content-Type: text/css");
   echo $less->compileFile("../css/default.less");
}
catch (exception $e) {
   echo "fatal error: " . $e->getMessage();
}