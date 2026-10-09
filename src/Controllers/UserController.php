<?php
require_once "../src/Models/Users.php";

class UserController
{
    public function getAll()
    {
        $user = Users::all();
        echo json_encode($user);
    }

    public function update($id_usuario)
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

        $user = Users::update($id_usuario, $data);
        if ($user) {
            echo json_encode([
                "estado" => true,
                "message" => "Usuario actualizado correctamente",
            ]);
            return;
        }
        echo json_encode($user);
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

        $user = Users::add($data);
        if ($user) {
            echo json_encode([
                "estado" => true,
                "message" => "Usuario adicionado correctamente",
                "id_usuario" => $user,
            ]);
            return;
        }
        echo json_encode($user);
    }

    public function delete($id_usuario)
    {
        $user = Users::delete($id_usuario);
        if ($user) {
            echo json_encode([
                "estado" => true,
                "message" => "Usuario eliminado correctamente",
            ]);
            return;
        }
        echo json_encode([
            "estado" => false,
            "message" => "No se pudo eliminar el usuario",
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

        if (!isset($data['usuario']) || trim($data['usuario']) == "") {
            $errores["usuario"] = "El campo usuario es obligatorio";
        }

        if (!isset($data['contraseña']) || trim($data['contraseña']) == "") {
            $errores["contraseña"] = "El campo contraseña es obligatorio";
        }

        if (!isset($data['rol']) || trim($data['rol']) == "") {
            $errores["rol"] = "El campo rol es obligatorio";
        } elseif (!in_array($data['rol'], ['Administrador', 'Empleado'])) {
            $errores["rol"] = "El campo rol debe ser Administrador o Empleado";
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
