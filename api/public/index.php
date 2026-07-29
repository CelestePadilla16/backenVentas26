<?php
if($_SERVER['REQUEST_METHOD']=='OPTIONS')
    {
        exit;
    }
require_once "../src/Router.php";
require_once "../src/Controllers/UserController.php";
require_once "../src/Controllers/ProductoController.php";
require_once "../src/Controllers/EmpleadoController.php";
require_once "../src/Controllers/InventarioController.php";
require_once "../src/Controllers/PedidoController.php";
require_once "../src/Controllers/ClienteController.php";
require_once "../src/Controllers/MovimientoController.php";
require_once "../src/Controllers/VentaController.php";
use App\Router;

$route=new Router();
// direccion para usuario
$route->add('GET','/','UserController@getAll');
$route->add('GET','/users','UserController@getAll');
// $route->add('GET','/','UserController@getAll');
// direccion para producto
$route->add('GET','/productos','ProductoController@getAll');
$route->add('POST','/productos','ProductoController@add');
$route->add('PUT','/productos/{id}','ProductoController@update');
$route->add('DELETE','/productos/{id}','ProductoController@delete');
// direcion para empleado
$route->add('GET','/empleados','EmpleadoController@getAll');
// direccion para inventario
$route->add('GET','/inventarios','InventarioController@getAll'); 
// direccion para pedido
$route->add('GET','/pedidos','PedidoController@getAll');
// direccion para cliente
$route->add('GET','/clientes','ClienteController@getAll');
// direccion para inventario
$route->add('GET','/movimientos','MovimientoController@getAll');
// direccion para venta
$route->add('GET','/ventas','VentaController@getAll');
$route->run();
