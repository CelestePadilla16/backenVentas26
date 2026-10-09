<?php
include_once __DIR__ . "/../config/conexionDB.php";

class Inventarios
{
    //Mostrar Inventario
    public static function all()
    {
        $sql = "SELECT * FROM inventarios";
        return ConexionPDO::query($sql);
    }

    //Actualizar Inventario
    public static function update($id_inventario, $data)
    {
        if (isset($data['id_inventario'])) {
            unset($data['id_inventario']);
        }

        $data = self::filtrarColumnas($data);
        if (count($data) == 0) {
            return false;
        }

        $campos = [];
        $valores = [];

        foreach ($data as $columna => $valor) {
            $campos[] = "$columna=:$columna";
            $valores[":$columna"] = $valor;
        }

        $stringCampos = implode(",", $campos);
        $sql = "UPDATE inventarios SET $stringCampos WHERE id_inventario=:id_inventario";
        $valores[':id_inventario'] = $id_inventario;

        return ConexionPDO::execute($sql, $valores, false);
    }

    //Adicionar Inventario
    public static function add($data)
    {
        if (isset($data['id_inventario'])) {
            unset($data['id_inventario']);
        }

        $data = self::filtrarColumnas($data);
        if (count($data) == 0) {
            return false;
        }

        $columnas = array_keys($data);
        $parametros = array_map(fn($columna) => ":$columna", $columnas);
        $valores = [];

        foreach ($data as $columna => $valor) {
            $valores[":$columna"] = $valor;
        }

        $stringColumnas = implode(",", $columnas);
        $stringParametros = implode(",", $parametros);
        $sql = "INSERT INTO inventarios ($stringColumnas) VALUES ($stringParametros)";

        return ConexionPDO::execute($sql, $valores, true);
    }

    //Eliminar Inventario
    public static function delete($id_inventario)
    {
        $sql = "DELETE FROM inventarios WHERE id_inventario=:id_inventario";
        $valores = [
            ":id_inventario" => $id_inventario
        ];

        return ConexionPDO::execute($sql, $valores, false);
    }

    private static function filtrarColumnas($data)
    {
        $columnasPermitidas = ['id_producto', 'cantidad'];
        return array_filter(
            $data,
            fn($columna) => in_array($columna, $columnasPermitidas),
            ARRAY_FILTER_USE_KEY
        );
    }
}
