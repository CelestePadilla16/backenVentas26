<?php
require_once "../src/Models/Pedidos.php";
class PedidoController{
    public function getAll()
    {
        $pedido=Pedidos::all();
        echo json_encode($pedido);
         
    }
}