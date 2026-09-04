<?php
require_once "../src/Models/Clientes.php";

class ClienteController
{
    public function getAll()
    {
        $cliente = Clientes::all();
        echo json_encode($cliente);
    }

    //Actualizar cliente
    public function update($id_cliente)
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

        $cliente = Clientes::update($id_cliente, $data);
        if ($cliente) {
            echo json_encode([
                "estado" => true,
                "message" => "Cliente actualizado correctamente",
            ]);
            return;
        }
        echo json_encode($cliente);
    }

    //Adicionar cliente
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

        $cliente = Clientes::add($data);
        if ($cliente) {
            echo json_encode([
                "estado" => true,
                "message" => "Cliente adicionado correctamente",
                "id_cliente" => $cliente,
            ]);
            return;
        }
        echo json_encode($cliente);
    }

    //Eliminar cliente
    public function delete($id_cliente)
    {
        $cliente = Clientes::delete($id_cliente);
        if ($cliente) {
            echo json_encode([
                "estado" => true,
                "message" => "Cliente eliminado correctamente",
            ]);
            return;
        }
        echo json_encode([
            "estado" => false,
            "message" => "No se pudo eliminar el cliente",
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
                "errores" => [
                    "json" => json_last_error_msg()
                ],
            ]);
            return null;
        }

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                "estado" => false,
                "errores" => [
                    "datos" => "Debe enviar un objeto JSON valido"
                ],
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

        if (!isset($data['telefono']) || trim($data['telefono']) == "") {
            $errores["telefono"] = "El campo telefono es obligatorio";
        }

        if (!isset($data['direccion']) || trim($data['direccion']) == "") {
            $errores["direccion"] = "El campo direccion es obligatorio";
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
