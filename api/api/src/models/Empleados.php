<?php
include_once __DIR__ . "/../config/conexionDB.php";

class Empleados
{
    //Mostrar Empleado
    public static function all()
    {
        $sql = "SELECT * FROM empleados";
        return ConexionPDO::query($sql);
    }

    //Actualizar Empleado
    public static function update($id_empleado, $data)
    {
        if (isset($data['id_empleado'])) {
            unset($data['id_empleado']);
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
        $sql = "UPDATE empleados SET $stringCampos WHERE id_empleado=:id_empleado";
        $valores[':id_empleado'] = $id_empleado;

        return ConexionPDO::execute($sql, $valores, false);
    }

    //Adicionar Empleado
    public static function add($data)
    {
        if (isset($data['id_empleado'])) {
            unset($data['id_empleado']);
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
        $sql = "INSERT INTO empleados ($stringColumnas) VALUES ($stringParametros)";

        return ConexionPDO::execute($sql, $valores, true);
    }

    //Eliminar Empleado
    public static function delete($id_empleado)
    {
        $sql = "DELETE FROM empleados WHERE id_empleado=:id_empleado";
        $valores = [
            ":id_empleado" => $id_empleado
        ];

        return ConexionPDO::execute($sql, $valores, false);
    }

    private static function filtrarColumnas($data)
    {
        $columnasPermitidas = ['nombre', 'cargo', 'telefono', 'id_usuario'];
        return array_filter(
            $data,
            fn($columna) => in_array($columna, $columnasPermitidas),
            ARRAY_FILTER_USE_KEY
        );
    }
}
