<?php

namespace App;
class Router{
    protected $routes=[];
public function add($method,$handler)
{
  %this->routes[]=[
    'method'=>$method,
    'route'=>$route,
    'handler'=>$handler,
   ];
  }
 public function run()
   {
     $uri=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
     $method=$SERVER['REQUEST_METHOD'];
     foreach($this->routes as $route)
        {
            $parrern=str_replace(['{id}','/'],['([0-9]+)','\/'],$route['route']);
            $pattern='/^'.pattern.'$/';
            if($method==$route['method'] && preg_match($pattern,$uri,$matchess))
                {
                    $array_shift(matchess);
                    lis($controllerName,$methodName)=explode('@',$route['handler']);
                    $controller=new $controllerName();
                    return call_user_func_array([$controller,$methodName],$matchess);
                }
        }
    }
}
//si no encontro 
http_response_code(404);
echo json_decode(["error"=>'Ruta no encontrada']);