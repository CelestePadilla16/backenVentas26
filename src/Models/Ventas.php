<?php
include_once __DIR__."/../config/conexionDB.php";
class Ventas
{

    public static function all()
    {
        $sql="SELECT * FROM ventas";
        return ConexionPDO::query($sql);
    }
}