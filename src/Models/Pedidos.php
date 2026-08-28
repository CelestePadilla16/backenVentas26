<?php
include_once __DIR__."/../config/conexionDB.php";
class Pedidos
{

    public static function all()
    {
        $sql="SELECT * FROM pedidos";
        return ConexionPDO::query($sql);
    }
}