<?php
require_once "../src/Models/Ventas.php";
class VentaController{
    public function getAll()
    {
        $venta=Ventas::all();
        echo json_encode($venta);
         
    }
}