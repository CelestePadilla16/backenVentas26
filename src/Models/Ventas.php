<?php
include_once __DIR__ . "/../config/conexionDB.php";

class Ventas
{
    //Mostrar Venta
    public static function all()
    {
        $sql = "SELECT * FROM ventas";
        return ConexionPDO::query($sql);
    }

    //Actualizar Venta
    public static function update($id_venta, $data)
    {
        if (isset($data['id_venta'])) {
            unset($data['id_venta']);
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
        $sql = "UPDATE ventas SET $stringCampos WHERE id_venta=:id_venta";
        $valores[':id_venta'] = $id_venta;

        return ConexionPDO::execute($sql, $valores, false);
    }

    //Adicionar Venta
    public static function add($data)
    {
        if (isset($data['id_venta'])) {
            unset($data['id_venta']);
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
        $sql = "INSERT INTO ventas ($stringColumnas) VALUES ($stringParametros)";

        return ConexionPDO::execute($sql, $valores, true);
    }

    //Eliminar Venta
    public static function delete($id_venta)
    {
        $sql = "DELETE FROM ventas WHERE id_venta=:id_venta";
        $valores = [
            ":id_venta" => $id_venta
        ];

        return ConexionPDO::execute($sql, $valores, false);
    }

    private static function filtrarColumnas($data)
    {
        $columnasPermitidas = ['id_cliente', 'id_producto', 'id_empleado', 'cantidad', 'total', 'fecha_venta'];
        return array_filter(
            $data,
            fn($columna) => in_array($columna, $columnasPermitidas),
            ARRAY_FILTER_USE_KEY
        );
    }
}
