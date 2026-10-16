<?php
include_once __DIR__ . "/../config/conexionDB.php";

class Movimientos
{
    //Mostrar Movimiento
    public static function all()
    {
        $sql = "SELECT * FROM movimientos";
        return ConexionPDO::query($sql);
    }

    //Actualizar Movimiento
    public static function update($id_movimiento, $data)
    {
        if (isset($data['id_movimiento'])) {
            unset($data['id_movimiento']);
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
        $sql = "UPDATE movimientos SET $stringCampos WHERE id_movimiento=:id_movimiento";
        $valores[':id_movimiento'] = $id_movimiento;

        return ConexionPDO::execute($sql, $valores, false);
    }

    //Adicionar Movimiento
    public static function add($data)
    {
        if (isset($data['id_movimiento'])) {
            unset($data['id_movimiento']);
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
        $sql = "INSERT INTO movimientos ($stringColumnas) VALUES ($stringParametros)";

        return ConexionPDO::execute($sql, $valores, true);
    }

    //Eliminar Movimiento
    public static function delete($id_movimiento)
    {
        $sql = "DELETE FROM movimientos WHERE id_movimiento=:id_movimiento";
        $valores = [
            ":id_movimiento" => $id_movimiento
        ];

        return ConexionPDO::execute($sql, $valores, false);
    }

    private static function filtrarColumnas($data)
    {
        $columnasPermitidas = ['id_producto', 'id_usuario', 'tipo', 'cantidad', 'fecha_movimiento'];
        return array_filter(
            $data,
            fn($columna) => in_array($columna, $columnasPermitidas),
            ARRAY_FILTER_USE_KEY
        );
    }
}
