<?php
require_once "../src/Models/Productos.php";
class ProductoController
{
    public function getAll()
    {
        $producto=Productos::all();
        echo json_encode($producto);
         
    }
//Actualizar producto
public function update($id_producto)
    {
        $jsonData=file_get_contents('php://input');
        $data= json_decode($jsonData,true);
        if(json_last_error()!=JSON_ERROR_NONE)
            {
                echo json_encode(
                    [
                        "status"=>"error",
                        "message"=>json_last_error_msg(),
                    ]);
                    return;
            }
      
   //"id_producto":1,
   //"nombre":"Leche Entera 1L",
   if(!isset($data['nombre']) || trim($data['nombre'])=="")
   {
     echo json_encode(
       [
           "status"=>"Error",
           "message"=>"El campo de Nombre es obligatorio", 
       ]);
       return;
   }
   //categoria":"Lacteos",
   if(!isset($data['categoria']) || trim($data['categoria'])=="")
   {
     echo json_encode(
       [
           "status"=>"Error",
           "message"=>"El campo de categoria es obligatorio", 
       ]);
       return;
   }
  // "precio_compra":"0,84",
  if(!isset($data['precio_compra']) || trim($data['precio_compra'])=="")
   {
     echo json_encode(
       [
           "status"=>"Error",
           "message"=>"El campo de precio_compra es obligatorio", 
       ]);
       return;
   }
   //"precio_venta":"1,20",
     if(!isset($data['precio_venta']) || trim($data['precio_venta'])=="")
   {
     echo json_encode(
       [
           "status"=>"Error",
           "message"=>"El campo de precio_venta es obligatorio", 
       ]);
       return;
   }
   //"fecha_vencimiento":"2026-08-15",
      if(!isset($data['fecha_vencimiento']) || trim($data['fecha_vencimiento'])=="")
   {
     echo json_encode(
       [
           "status"=>"Error",
           "message"=>"El campo de fecha_vencimiento es obligatorio", 
       ]);
       return;
   }
   //"estado":"Disponible"
    if(!isset($data['estado']) || trim($data['estado'])=="")
   {
     echo json_encode(
       [
           "status"=>"Error",
           "message"=>"El campo de estado es obligatorio", 
       ]);
       return;
   }  
    
        $producto = Productos::update($id_producto, $data);
        if($producto){
            echo json_encode([
                "estado" => true,
                "message" => "Producto actualizado correctamente",
            ]);
            return;
        }
        echo json_encode($producto);
         
    }

//Adicionar producto
public function add()
    {
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
         //validacion 
        $producto = Productos::add($data);
        if ($producto) {
            echo json_encode([
                "estado" => true,
                "message" => "Producto adicionado correctamente",
            ]);
            return;
        }
    echo json_encode($producto);
    }
}