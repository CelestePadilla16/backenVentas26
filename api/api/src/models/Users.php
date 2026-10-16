<?php
include_once __DIR__ . "/../config/conexionDB.php";

class Users
{
    //Mostrar Usuario
    public static function all()
    {
        $sql = "SELECT * FROM usuarios";
        return ConexionPDO::query($sql);
    }

    //Actualizar Usuario
    public static function update($id_usuario, $data)
    {
        if (isset($data['id_usuario'])) {
            unset($data['id_usuario']);
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
        $sql = "UPDATE usuarios SET $stringCampos WHERE id_usuario=:id_usuario";
        $valores[':id_usuario'] = $id_usuario;

        return ConexionPDO::execute($sql, $valores, false);
    }

    //Adicionar Usuario
    public static function add($data)
    {
        if (isset($data['id_usuario'])) {
            unset($data['id_usuario']);
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
        $sql = "INSERT INTO usuarios ($stringColumnas) VALUES ($stringParametros)";

        return ConexionPDO::execute($sql, $valores, true);
    }

    //Eliminar Usuario
    public static function delete($id_usuario)
    {
        $sql = "DELETE FROM usuarios WHERE id_usuario=:id_usuario";
        $valores = [
            ":id_usuario" => $id_usuario
        ];

        return ConexionPDO::execute($sql, $valores, false);
    }

    private static function filtrarColumnas($data)
    {
        $columnasPermitidas = ['usuario', 'contraseña', 'rol'];
        return array_filter(
            $data,
            fn($columna) => in_array($columna, $columnasPermitidas),
            ARRAY_FILTER_USE_KEY
        );
    }
}
