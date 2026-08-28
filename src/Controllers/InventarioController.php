<?php
require_once "../src/Models/Inventarios.php";
class InventarioController{
    public function getAll()
    {
        $inventario=Inventarios::all();
        echo json_encode($inventario);
         
    }
}