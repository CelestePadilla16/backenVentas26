<?php
if($_SERVER['REQUEST_METHOD']=='OPTION')
    {
        exit;
    }
    requiere_once "../src/Router.php";
    requiere_once "../src/Controllers/UserController.php";

    use App\Router;

    $route=new Router();

    $route->add('Get','/user','UserController@getAll');
    
    $route->run();
    