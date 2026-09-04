<?php
require_once "../src/Models/Pedidos.php";

class PedidoController
{
    public function getAll()
    {
        $pedido = Pedidos::all();
        echo json_encode($pedido);
    }

    public function update($id_pedido)
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

        $pedido = Pedidos::update($id_pedido, $data);
        if ($pedido) {
            echo json_encode([
                "estado" => true,
                "message" => "Pedido actualizado correctamente",
            ]);
            return;
        }
        echo json_encode($pedido);
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

        $pedido = Pedidos::add($data);
        if ($pedido) {
            echo json_encode([
                "estado" => true,
                "message" => "Pedido adicionado correctamente",
                "id_pedido" => $pedido,
            ]);
            return;
        }
        echo json_encode($pedido);
    }

    public function delete($id_pedido)
    {
        $pedido = Pedidos::delete($id_pedido);
        if ($pedido) {
            echo json_encode([
                "estado" => true,
                "message" => "Pedido eliminado correctamente",
            ]);
            return;
        }
        echo json_encode([
            "estado" => false,
            "message" => "No se pudo eliminar el pedido",
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

        if (!isset($data['id_cliente']) || trim($data['id_cliente']) == "") {
            $errores["id_cliente"] = "El campo id_cliente es obligatorio";
        } elseif (!is_numeric($data['id_cliente']) || $data['id_cliente'] <= 0) {
            $errores["id_cliente"] = "El campo id_cliente debe ser numerico y mayor a 0";
        }

        if (!isset($data['id_empleado']) || trim($data['id_empleado']) == "") {
            $errores["id_empleado"] = "El campo id_empleado es obligatorio";
        } elseif (!is_numeric($data['id_empleado']) || $data['id_empleado'] <= 0) {
            $errores["id_empleado"] = "El campo id_empleado debe ser numerico y mayor a 0";
        }

        if (!isset($data['fecha_pedido']) || trim($data['fecha_pedido']) == "") {
            $errores["fecha_pedido"] = "El campo fecha_pedido es obligatorio";
        } else {
            $fecha = DateTime::createFromFormat('Y-m-d', $data['fecha_pedido']);
            if (!$fecha || $fecha->format('Y-m-d') !== $data['fecha_pedido']) {
                $errores["fecha_pedido"] = "El campo fecha_pedido debe tener formato YYYY-MM-DD";
            }
        }

        if (!isset($data['estado']) || trim($data['estado']) == "") {
            $errores["estado"] = "El campo estado es obligatorio";
        } elseif (!in_array($data['estado'], ['Entregado', 'Pendiente', 'Cancelado'])) {
            $errores["estado"] = "El campo estado debe ser Entregado, Pendiente o Cancelado";
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
