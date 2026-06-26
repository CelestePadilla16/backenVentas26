<?php
include_once __DIR__ . "/../Config/conexionDB.php";

class Productos
{
    //Mostrar Producto
    public static function all()
    {
        $sql = "SELECT * FROM productos";
        return ConexionPDO::query($sql);
    }

    //Actualizar Producto
    public static function update($id_producto, $data)
    {
        if (isset($data['id_producto'])) {
            unset($data['id_producto']);
        }

        $campos = [];
        $valores = [];

        foreach ($data as $columna => $valor) {
            $campos[] = "$columna=:$columna";
            $valores[":$columna"] = $valor;
        }

        $stringCampos = implode(",", $campos);
        $sql = "UPDATE productos SET $stringCampos WHERE id_producto=:id_producto";
        $valores[':id_producto'] = $id_producto;

        return ConexionPDO::execute($sql, $valores, false);
    }

    //Adicionar Producto
    public static function add($data)
    {
        if (isset($data['id_producto'])) {
            unset($data['id_producto']);
        }

        $columnas = [];
        $parametros = [];
        $valores = [];

        foreach ($data as $columna => $valor) {
            $columnas[] = $columna;
            $parametros[] = ":$columna";
            $valores[":$columna"] = $valor;
        }

        $stringColumnas = implode(",", $columnas);
        $stringParametros = implode(",", $parametros);
        $sql = "INSERT INTO productos ($stringColumnas) VALUES ($stringParametros)";

        return ConexionPDO::execute($sql, $valores, true);
    }
}
