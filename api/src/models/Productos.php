<?php
include_once __DIR__."/../config/conexionDB.php";
class Productos 
{
    // Mostrar Producto
    public static function all()
    {
        $sql="SELECT * FROM productos";
        return ConexionPDO::query($sql);
    }
// Actualizar Producto

    public static function update()
    {
        $sql="SELECT * FROM productos";
        return ConexionPDO::query($sql);
    }
}