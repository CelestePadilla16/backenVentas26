<?php
include_once __DIR__."/../config/conexionDB.php";
class Inventarios 
{

    public static function all()
    {
        $sql="SELECT * FROM inventarios";
        return ConexionPDO::query($sql);
    }
}