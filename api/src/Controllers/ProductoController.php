<?php
require_once "../src/Models/Productos.php";
class ProductoController{
    public function getAll()
    {
        $producto=Productos::all();
        echo json_encode($producto);
         
    }

public function update()
    {
        $jsonData=file_get_contents('php://input');
        die( $jsonData);
        $producto=Productos::update();
        echo json_encode($producto);
         
    }
}