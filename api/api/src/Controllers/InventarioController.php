<?php
require_once "../src/Models/Inventarios.php";

class InventarioController
{
    public function getAll()
    {
        $inventario = Inventarios::all();
        echo json_encode($inventario);
    }

    public function update($id_inventario)
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

        $inventario = Inventarios::update($id_inventario, $data);
        if ($inventario) {
            echo json_encode([
                "estado" => true,
                "message" => "Inventario actualizado correctamente",
            ]);
            return;
        }
        echo json_encode($inventario);
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

        $inventario = Inventarios::add($data);
        if ($inventario) {
            echo json_encode([
                "estado" => true,
                "message" => "Inventario adicionado correctamente",
                "id_inventario" => $inventario,
            ]);
            return;
        }
        echo json_encode($inventario);
    }

    public function delete($id_inventario)
    {
        $inventario = Inventarios::delete($id_inventario);
        if ($inventario) {
            echo json_encode([
                "estado" => true,
                "message" => "Inventario eliminado correctamente",
            ]);
            return;
        }
        echo json_encode([
            "estado" => false,
            "message" => "No se pudo eliminar el inventario",
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

        if (!isset($data['id_producto']) || trim($data['id_producto']) == "") {
            $errores["id_producto"] = "El campo id_producto es obligatorio";
        } elseif (!is_numeric($data['id_producto']) || $data['id_producto'] <= 0) {
            $errores["id_producto"] = "El campo id_producto debe ser numerico y mayor a 0";
        }

        if (!isset($data['cantidad']) || trim($data['cantidad']) == "") {
            $errores["cantidad"] = "El campo cantidad es obligatorio";
        } elseif (!is_numeric($data['cantidad']) || $data['cantidad'] < 0) {
            $errores["cantidad"] = "El campo cantidad debe ser numerico y mayor o igual a 0";
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
