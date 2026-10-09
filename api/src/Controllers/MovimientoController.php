<?php
require_once "../src/Models/Movimientos.php";

class MovimientoController
{
    public function getAll()
    {
        $movimiento = Movimientos::all();
        echo json_encode($movimiento);
    }

    public function update($id_movimiento)
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

        $movimiento = Movimientos::update($id_movimiento, $data);
        if ($movimiento) {
            echo json_encode([
                "estado" => true,
                "message" => "Movimiento actualizado correctamente",
            ]);
            return;
        }
        echo json_encode($movimiento);
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

        $movimiento = Movimientos::add($data);
        if ($movimiento) {
            echo json_encode([
                "estado" => true,
                "message" => "Movimiento adicionado correctamente",
                "id_movimiento" => $movimiento,
            ]);
            return;
        }
        echo json_encode($movimiento);
    }

    public function delete($id_movimiento)
    {
        $movimiento = Movimientos::delete($id_movimiento);
        if ($movimiento) {
            echo json_encode([
                "estado" => true,
                "message" => "Movimiento eliminado correctamente",
            ]);
            return;
        }
        echo json_encode([
            "estado" => false,
            "message" => "No se pudo eliminar el movimiento",
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

        if (!isset($data['id_usuario']) || trim($data['id_usuario']) == "") {
            $errores["id_usuario"] = "El campo id_usuario es obligatorio";
        } elseif (!is_numeric($data['id_usuario']) || $data['id_usuario'] <= 0) {
            $errores["id_usuario"] = "El campo id_usuario debe ser numerico y mayor a 0";
        }

        if (!isset($data['tipo']) || trim($data['tipo']) == "") {
            $errores["tipo"] = "El campo tipo es obligatorio";
        } elseif (!in_array($data['tipo'], ['Entrada', 'Salida'])) {
            $errores["tipo"] = "El campo tipo debe ser Entrada o Salida";
        }

        if (!isset($data['cantidad']) || trim($data['cantidad']) == "") {
            $errores["cantidad"] = "El campo cantidad es obligatorio";
        } elseif (!is_numeric($data['cantidad']) || $data['cantidad'] <= 0) {
            $errores["cantidad"] = "El campo cantidad debe ser numerico y mayor a 0";
        }

        if (!isset($data['fecha_movimiento']) || trim($data['fecha_movimiento']) == "") {
            $errores["fecha_movimiento"] = "El campo fecha_movimiento es obligatorio";
        } else {
            $fecha = DateTime::createFromFormat('Y-m-d', $data['fecha_movimiento']);
            if (!$fecha || $fecha->format('Y-m-d') !== $data['fecha_movimiento']) {
                $errores["fecha_movimiento"] = "El campo fecha_movimiento debe tener formato YYYY-MM-DD";
            }
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
