-- DROP DATABASE IF EXISTS tienda_abarrotes;
-- CREATE DATABASE tienda_abarrotes;
-- USE tienda_abarrotes;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(100) NOT NULL,
    rol ENUM('Administrador','Empleado') NOT NULL
) ENGINE=InnoDB;

-- Tabla de empleados
CREATE TABLE empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(50),
    telefono VARCHAR(20),
    id_usuario INT,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

-- Tabla de clientes
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(150)
) ENGINE=InnoDB;

-- Tabla de productos
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    precio_compra DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    fecha_vencimiento DATE,
    estado ENUM('Disponible','Agotado') DEFAULT 'Disponible'
) ENGINE=InnoDB;

-- Tabla de inventarios
CREATE TABLE inventarios (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    cantidad INT NOT NULL,

    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
) ENGINE=InnoDB;

-- Tabla de pedidos
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_empleado INT,
    fecha_pedido DATE,
    estado ENUM('Pendiente','Entregado','Cancelado') DEFAULT 'Pendiente',

    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
) ENGINE=InnoDB;

-- Tabla de movimientos
CREATE TABLE movimientos (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
		id_usuario INT,
    tipo ENUM('Entrada','Salida'),
    cantidad INT,
    fecha_movimiento DATE,

    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
		FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
		
) ENGINE=InnoDB;

-- Tabla de ventas
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_producto INT,
    id_empleado INT,
    cantidad INT,
    total DECIMAL(10,2),
    fecha_venta DATE,

    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
) ENGINE=InnoDB;