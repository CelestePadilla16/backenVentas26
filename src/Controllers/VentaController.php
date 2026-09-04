<?php
require_once "../src/Models/Ventas.php";

class VentaController
{
    public function getAll()
    {
        $venta = Ventas::all();
        echo json_encode($venta);
    }

    public function update($id_venta)
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

        $venta = Ventas::update($id_venta, $data);
        if ($venta) {
            echo json_encode([
                "estado" => true,
                "message" => "Venta actualizada correctamente",
            ]);
            return;
        }
        echo json_encode($venta);
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

        $venta = Ventas::add($data);
        if ($venta) {
            echo json_encode([
                "estado" => true,
                "message" => "Venta adicionada correctamente",
                "id_venta" => $venta,
            ]);
            return;
        }
        echo json_encode($venta);
    }

    public function delete($id_venta)
    {
        $venta = Ventas::delete($id_venta);
        if ($venta) {
            echo json_encode([
                "estado" => true,
                "message" => "Venta eliminada correctamente",
            ]);
            return;
        }
        echo json_encode([
            "estado" => false,
            "message" => "No se pudo eliminar la venta",
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

        foreach (['id_cliente', 'id_producto', 'id_empleado'] as $campo) {
            if (!isset($data[$campo]) || trim($data[$campo]) == "") {
                $errores[$campo] = "El campo $campo es obligatorio";
            } elseif (!is_numeric($data[$campo]) || $data[$campo] <= 0) {
                $errores[$campo] = "El campo $campo debe ser numerico y mayor a 0";
            }
        }

        if (!isset($data['cantidad']) || trim($data['cantidad']) == "") {
            $errores["cantidad"] = "El campo cantidad es obligatorio";
        } elseif (!is_numeric($data['cantidad']) || $data['cantidad'] <= 0) {
            $errores["cantidad"] = "El campo cantidad debe ser numerico y mayor a 0";
        }

        if (!isset($data['total']) || trim($data['total']) == "") {
            $errores["total"] = "El campo total es obligatorio";
        } elseif (!is_numeric($data['total']) || $data['total'] < 0) {
            $errores["total"] = "El campo total debe ser numerico y mayor o igual a 0";
        }

        if (!isset($data['fecha_venta']) || trim($data['fecha_venta']) == "") {
            $errores["fecha_venta"] = "El campo fecha_venta es obligatorio";
        } else {
            $fecha = DateTime::createFromFormat('Y-m-d', $data['fecha_venta']);
            if (!$fecha || $fecha->format('Y-m-d') !== $data['fecha_venta']) {
                $errores["fecha_venta"] = "El campo fecha_venta debe tener formato YYYY-MM-DD";
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
