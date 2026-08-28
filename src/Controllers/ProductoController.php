<?php
require_once "../src/Models/Productos.php";
class ProductoController
{
    public function getAll()
    {
        $producto=Productos::all();
        echo json_encode($producto);
         
    }
//Actualizar producto
public function update($id_producto)
    {
        $jsonData=file_get_contents('php://input');
        $data= json_decode($jsonData,true);

        if (json_last_error() != JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode([
                "estado" => false,
                "errores" => [
                    "json" => json_last_error_msg()
                ],
            ]);
            return;
        }

        $errores = [];

        if (!is_array($data)) {
            $errores["datos"] = "Debe enviar un objeto JSON valido";
        } else {
            if (!isset($data['nombre']) || trim($data['nombre']) == "") {
                $errores["nombre"] = "El campo nombre es obligatorio";
            }

            if (!isset($data['categoria']) || trim($data['categoria']) == "") {
                $errores["categoria"] = "El campo categoria es obligatorio";
            }

            if (!isset($data['precio_compra']) || trim($data['precio_compra']) == "") {
                $errores["precio_compra"] = "El campo precio_compra es obligatorio";
            } elseif (!is_numeric($data['precio_compra']) || $data['precio_compra'] < 0) {
                $errores["precio_compra"] = "El campo precio_compra debe ser numerico y mayor o igual a 0";
            }

            if (!isset($data['precio_venta']) || trim($data['precio_venta']) == "") {
                $errores["precio_venta"] = "El campo precio_venta es obligatorio";
            } elseif (!is_numeric($data['precio_venta']) || $data['precio_venta'] < 0) {
                $errores["precio_venta"] = "El campo precio_venta debe ser numerico y mayor o igual a 0";
            }

            if (!isset($data['fecha_vencimiento']) || trim($data['fecha_vencimiento']) == "") {
                $errores["fecha_vencimiento"] = "El campo fecha_vencimiento es obligatorio";
            } else {
                $fecha = DateTime::createFromFormat('Y-m-d', $data['fecha_vencimiento']);
                if (!$fecha || $fecha->format('Y-m-d') !== $data['fecha_vencimiento']) {
                    $errores["fecha_vencimiento"] = "El campo fecha_vencimiento debe tener formato YYYY-MM-DD";
                }
            }

            if (!isset($data['estado']) || trim($data['estado']) == "") {
                $errores["estado"] = "El campo estado es obligatorio";
            } elseif (!in_array($data['estado'], ['Disponible', 'Agotado'])) {
                $errores["estado"] = "El campo estado debe ser Disponible o Agotado";
            }
        }

        if (count($errores) > 0) {
            http_response_code(400);
            echo json_encode([
                "estado" => false,
                "errores" => $errores,
            ]);
            return;
        }
     
        $producto = Productos::update($id_producto, $data);
        if($producto){
            echo json_encode([
                "estado" => true,
                "message" => "Producto actualizado correctamente",
            ]);
            return;
        }
        echo json_encode($producto);
         
    }

//Adicionar producto
public function add()
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
            return;
        }

        $errores = [];

        if (!is_array($data)) {
            $errores["datos"] = "Debe enviar un objeto JSON valido";
        } else {
            if (!isset($data['nombre']) || trim($data['nombre']) == "") {
                $errores["nombre"] = "El campo nombre es obligatorio";
            }

            if (!isset($data['categoria']) || trim($data['categoria']) == "") {
                $errores["categoria"] = "El campo categoria es obligatorio";
            }

            if (!isset($data['precio_compra']) || trim($data['precio_compra']) == "") {
                $errores["precio_compra"] = "El campo precio_compra es obligatorio";
            } elseif (!is_numeric($data['precio_compra']) || $data['precio_compra'] < 0) {
                $errores["precio_compra"] = "El campo precio_compra debe ser numerico y mayor o igual a 0";
            }

            if (!isset($data['precio_venta']) || trim($data['precio_venta']) == "") {
                $errores["precio_venta"] = "El campo precio_venta es obligatorio";
            } elseif (!is_numeric($data['precio_venta']) || $data['precio_venta'] < 0) {
                $errores["precio_venta"] = "El campo precio_venta debe ser numerico y mayor o igual a 0";
            }

            if (!isset($data['fecha_vencimiento']) || trim($data['fecha_vencimiento']) == "") {
                $errores["fecha_vencimiento"] = "El campo fecha_vencimiento es obligatorio";
            } else {
                $fecha = DateTime::createFromFormat('Y-m-d', $data['fecha_vencimiento']);
                if (!$fecha || $fecha->format('Y-m-d') !== $data['fecha_vencimiento']) {
                    $errores["fecha_vencimiento"] = "El campo fecha_vencimiento debe tener formato YYYY-MM-DD";
                }
            }

            if (!isset($data['estado']) || trim($data['estado']) == "") {
                $errores["estado"] = "El campo estado es obligatorio";
            } elseif (!in_array($data['estado'], ['Disponible', 'Agotado'])) {
                $errores["estado"] = "El campo estado debe ser Disponible o Agotado";
            }
        }

        if (count($errores) > 0) {
            http_response_code(400);
            echo json_encode([
                "estado" => false,
                "errores" => $errores,
            ]);
            return;
        }

         $producto = Productos::add($data);
         if ($producto) {
             echo json_encode([
                 "estado" => true,
                 "message" => "Producto adicionado correctamente",
                 "id_producto" => $producto,
             ]);
             return;
         }
        echo json_encode($producto);
    }

//Eliminar producto
public function delete($id_producto)
    {
        $producto = Productos::delete($id_producto);
        if ($producto) {
            echo json_encode([
                "estado" => true,
                "message" => "Producto eliminado correctamente",
            ]);
            return;
        }
        echo json_encode([
            "estado" => false,
            "message" => "No se pudo eliminar el producto",
        ]);
    }
}
