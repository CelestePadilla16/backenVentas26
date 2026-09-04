<?php
include_once __DIR__ . "/../config/conexionDB.php";

class Pedidos
{
    //Mostrar Pedido
    public static function all()
    {
        $sql = "SELECT * FROM pedidos";
        return ConexionPDO::query($sql);
    }

    //Actualizar Pedido
    public static function update($id_pedido, $data)
    {
        if (isset($data['id_pedido'])) {
            unset($data['id_pedido']);
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
        $sql = "UPDATE pedidos SET $stringCampos WHERE id_pedido=:id_pedido";
        $valores[':id_pedido'] = $id_pedido;

        return ConexionPDO::execute($sql, $valores, false);
    }

    //Adicionar Pedido
    public static function add($data)
    {
        if (isset($data['id_pedido'])) {
            unset($data['id_pedido']);
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
        $sql = "INSERT INTO pedidos ($stringColumnas) VALUES ($stringParametros)";

        return ConexionPDO::execute($sql, $valores, true);
    }

    //Eliminar Pedido
    public static function delete($id_pedido)
    {
        $sql = "DELETE FROM pedidos WHERE id_pedido=:id_pedido";
        $valores = [
            ":id_pedido" => $id_pedido
        ];

        return ConexionPDO::execute($sql, $valores, false);
    }

    private static function filtrarColumnas($data)
    {
        $columnasPermitidas = ['id_cliente', 'id_empleado', 'fecha_pedido', 'estado'];
        return array_filter(
            $data,
            fn($columna) => in_array($columna, $columnasPermitidas),
            ARRAY_FILTER_USE_KEY
        );
    }
}
