<?php
include_once __DIR__."/../Config/conexionDB.php";

class Empleados 
{
    // public static function all()
    // {
    //     $sql = "SELECT * FROM empleados";
    //     return ConexionPDO::query($sql);
    // }

    // public static function update($id, $data)
    // {
    //     if (isset($data['id_empleado'])) {
    //         unset($data['id_empleado']);
    //     }

    //     $columnasPermitidas = ['nombre', 'cargo', 'telefono', 'id_usuario'];
    //     $campos = [];
    //     $valores = [];

    //     foreach ($data as $columna => $valor) {
    //         if (!in_array($columna, $columnasPermitidas)) {
    //             continue;
    //         }
    //         $campos[] = "$columna=:$columna";
    //         $valores[":$columna"] = $valor;
    //     }

    //     if (count($campos) == 0) {
    //         return false;
    //     }

    //     $stringCampos = implode(",", $campos);
    //     $sql = "UPDATE empleados SET $stringCampos WHERE id_empleado=:id_empleado";
    //     $valores[':id_empleado'] = $id;

    //     return ConexionPDO::execute($sql, $valores, false);
    // }

    // public static function add($data)
    // {
    //     if (isset($data['id_empleado'])) {
    //         unset($data['id_empleado']);
    //     }

    //     $columnasPermitidas = ['nombre', 'cargo', 'telefono', 'id_usuario'];
    //     $columnas = [];
    //     $parametros = [];
    //     $valores = [];

    //     foreach ($data as $columna => $valor) {
    //         if (!in_array($columna, $columnasPermitidas)) {
    //             continue;
    //         }

    //         $columnas[] = $columna;
    //         $parametros[] = ":$columna";
    //         $valores[":$columna"] = $valor;
    //     }

    //     if (count($columnas) == 0) {
    //         return false;
    //     }

    //     $stringColumnas = implode(",", $columnas);
    //     $stringParametros = implode(",", $parametros);
    //     $sql = "INSERT INTO empleados ($stringColumnas) VALUES ($stringParametros)";

    //     return ConexionPDO::execute($sql, $valores, true);
    // }

    // public static function delete($id)
    // {
    //     $sql = "DELETE FROM empleados WHERE id_empleado=:id_empleado";
    //     $valores = [":id_empleado" => $id];

    //     return ConexionPDO::execute($sql, $valores, false);
    // }
}