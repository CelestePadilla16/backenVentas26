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

        $columnasPermitidas = [
            'nombre',
            'categoria',
            'precio_compra',
            'precio_venta',
            'fecha_vencimiento',
            'estado'
        ];

        $columnas = [];
        $parametros = [];
        $valores = [];

        foreach ($data as $columna => $valor) {
            if (!in_array($columna, $columnasPermitidas)) {
                continue;
            }

            $columnas[] = $columna;
            $parametros[] = ":$columna";
            $valores[":$columna"] = $valor;
        }

        if (count($columnas) == 0) {
            return false;
        }

        $stringColumnas = implode(",", $columnas);
        $stringParametros = implode(",", $parametros);
        $sql = "INSERT INTO productos ($stringColumnas) VALUES ($stringParametros)";

        return ConexionPDO::execute($sql, $valores, true);
    }

    //Eliminar Producto
    public static function delete($id_producto)
    {
        $sql = "DELETE FROM productos WHERE id_producto=:id_producto";
        $valores = [
            ":id_producto" => $id_producto
        ];

        return ConexionPDO::execute($sql, $valores, false);
    }
}
