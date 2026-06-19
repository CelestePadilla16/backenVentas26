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
    public static function update($id,$data)
    {
        if(isset($data{'id'})){
        unset($data['id']);
        }
        $campos=[];
        $valores=[];
        // construir datos
        foreach($data as $columna=>$valor)
            {
                $campos[]="$columna=:columna";
                $valores[":$columna"]=$valor;
                
            }
    $stringCampos=implode(",",$campos);
    //preparamos la consulta
    $sql="UPDATE productos SET $stringCampos WHERE id=:id";
    $valores[':id']=$id;
    //$result=ConexionPDO::();
    //$sql="SELECT * FROM productos";
        return $sql; //ConexionPDO::query($sql);
    }
}