<?php
class Users{
 private static $users=[
    ["id"=>1,"name"=>'Celeste Padilla','email'=>celeste@gmail.com"],
    ["id"=>2,"name"=>'Carla Pardo','email'=>carla@gmail.com"],
    ["id"=>3,"name"=>'Jose Manuel','email'=>jose@gmail.com"],
    //["id"=>4,"name"=>'','email'=>@gmail.com"],

 ];
 public static function all(){
   return self::users;
 }
}