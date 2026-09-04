<?php
require_once "../src/Models/Empleados.php";

class EmpleadoController
{
    public function getAll()
    {
        $empleado = Empleados::all();
        echo json_encode($empleado);
    }

    public function update($id_empleado)
    {
        $data = $this->getJsonData();
        if ($data === null) {
            return;
        }

        $errores = $this->validar($data);
        if (count($errores) > 0) {
            $this->respuestaErrores($errores);
            return;
        }

        $empleado = Empleados::update($id_empleado, $data);
        if ($empleado) {
            echo json_encode([
                "estado" => true,
                "message" => "Empleado actualizado correctamente",
            ]);
            return;
        }
        echo json_encode($empleado);
    }

    public function add()
    {
        $data = $this->getJsonData();
        if ($data === null) {
            return;
        }

        $errores = $this->validar($data);
        if (count($errores) > 0) {
            $this->respuestaErrores($errores);
            return;
        }

        $empleado = Empleados::add($data);
        if ($empleado) {
            echo json_encode([
                "estado" => true,
                "message" => "Empleado adicionado correctamente",
                "id_empleado" => $empleado,
            ]);
            return;
        }
        echo json_encode($empleado);
    }

    public function delete($id_empleado)
    {
        $empleado = Empleados::delete($id_empleado);
        if ($empleado) {
            echo json_encode([
                "estado" => true,
                "message" => "Empleado eliminado correctamente",
            ]);
            return;
        }
        echo json_encode([
            "estado" => false,
            "message" => "No se pudo eliminar el empleado",
        ]);
    }

    private function getJsonData()
    {
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);

        if (json_last_error() != JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode([
                "estado" => false,
                "errores" => ["json" => json_last_error_msg()],
            ]);
            return null;
        }

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                "estado" => false,
                "errores" => ["datos" => "Debe enviar un objeto JSON valido"],
            ]);
            return null;
        }

        return $data;
    }

    private function validar($data)
    {
        $errores = [];

        if (!isset($data['nombre']) || trim($data['nombre']) == "") {
            $errores["nombre"] = "El campo nombre es obligatorio";
        }

        if (!isset($data['cargo']) || trim($data['cargo']) == "") {
            $errores["cargo"] = "El campo cargo es obligatorio";
        }

        if (!isset($data['telefono']) || trim($data['telefono']) == "") {
            $errores["telefono"] = "El campo telefono es obligatorio";
        }

        if (!isset($data['id_usuario']) || trim($data['id_usuario']) == "") {
            $errores["id_usuario"] = "El campo id_usuario es obligatorio";
        } elseif (!is_numeric($data['id_usuario']) || $data['id_usuario'] <= 0) {
            $errores["id_usuario"] = "El campo id_usuario debe ser numerico y mayor a 0";
        }

        return $errores;
    }

    private function respuestaErrores($errores)
    {
        http_response_code(400);
        echo json_encode([
            "estado" => false,
            "errores" => $errores,
        ]);
    }
}
