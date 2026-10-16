<?php
include_once __DIR__ . "/../config/conexionDB.php";

class Clientes
{
    //Mostrar Cliente
    public static function all()
    {
        $sql = "SELECT * FROM clientes";
        return ConexionPDO::query($sql);
    }

    //Actualizar Cliente
    public static function update($id_cliente, $data)
    {
        if (isset($data['id_cliente'])) {
            unset($data['id_cliente']);
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
        $sql = "UPDATE clientes SET $stringCampos WHERE id_cliente=:id_cliente";
        $valores[':id_cliente'] = $id_cliente;

        return ConexionPDO::execute($sql, $valores, false);
    }

    //Adicionar Cliente
    public static function add($data)
    {
        if (isset($data['id_cliente'])) {
            unset($data['id_cliente']);
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
        $sql = "INSERT INTO clientes ($stringColumnas) VALUES ($stringParametros)";

        return ConexionPDO::execute($sql, $valores, true);
    }

    //Eliminar Cliente
    public static function delete($id_cliente)
    {
        $sql = "DELETE FROM clientes WHERE id_cliente=:id_cliente";
        $valores = [
            ":id_cliente" => $id_cliente
        ];

        return ConexionPDO::execute($sql, $valores, false);
    }

    private static function filtrarColumnas($data)
    {
        $columnasPermitidas = ['nombre', 'telefono', 'direccion'];
        return array_filter(
            $data,
            fn($columna) => in_array($columna, $columnasPermitidas),
            ARRAY_FILTER_USE_KEY
        );
    }
}
