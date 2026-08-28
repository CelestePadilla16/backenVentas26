<?php
include_once __DIR__."/../config/conexionDB.php";
class Clientes
{

    public static function all()
    {
        $sql="SELECT * FROM clientes";
        return ConexionPDO::query($sql);
    }
}