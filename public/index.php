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
$route->add('POST','/users','UserController@add');
$route->add('PUT','/users/{id}','UserController@update');
$route->add('DELETE','/users/{id}','UserController@delete');
// $route->add('GET','/','UserController@getAll');
// direccion para producto
$route->add('GET','/productos','ProductoController@getAll');
$route->add('POST','/productos','ProductoController@add');
$route->add('PUT','/productos/{id}','ProductoController@update');
$route->add('DELETE','/productos/{id}','ProductoController@delete');
// direcion para empleado
$route->add('GET','/empleados','EmpleadoController@getAll');
$route->add('POST','/empleados','EmpleadoController@add');
$route->add('PUT','/empleados/{id}','EmpleadoController@update');
$route->add('DELETE','/empleados/{id}','EmpleadoController@delete');
// direccion para inventario
$route->add('GET','/inventarios','InventarioController@getAll'); 
$route->add('POST','/inventarios','InventarioController@add'); 
$route->add('PUT','/inventarios/{id}','InventarioController@update'); 
$route->add('DELETE','/inventarios/{id}','InventarioController@delete'); 
// direccion para pedido
$route->add('GET','/pedidos','PedidoController@getAll');
$route->add('POST','/pedidos','PedidoController@add');
$route->add('PUT','/pedidos/{id}','PedidoController@update');
$route->add('DELETE','/pedidos/{id}','PedidoController@delete');
// direccion para cliente
$route->add('GET','/clientes','ClienteController@getAll');
$route->add('POST','/clientes','ClienteController@add');
$route->add('PUT','/clientes/{id}','ClienteController@update');
$route->add('DELETE','/clientes/{id}','ClienteController@delete');
// direccion para inventario
$route->add('GET','/movimientos','MovimientoController@getAll');
$route->add('POST','/movimientos','MovimientoController@add');
$route->add('PUT','/movimientos/{id}','MovimientoController@update');
$route->add('DELETE','/movimientos/{id}','MovimientoController@delete');
// direccion para venta
$route->add('GET','/ventas','VentaController@getAll');
$route->add('POST','/ventas','VentaController@add');
$route->add('PUT','/ventas/{id}','VentaController@update');
$route->add('DELETE','/ventas/{id}','VentaController@delete');
$route->run();
