INSERT INTO usuarios (usuario, contraseña, rol) VALUES
('juan_admin', '$2y$10$e0myZ4g3.MTRK7O...', 'Administrador'),
('maria_dev', '$2y$10$92IXUNpkjO0rO...', 'Empleado'),
('carlos_mgr', '$2y$10$L1kR8wV6qTYUo...', 'Administrador'),
('ana_sales', '$2y$10$vX5zN2b4pQWEm...', 'Empleado'),
('luis_support', '$2y$10$mK9bF3v7xPLAs...', 'Empleado');

INSERT INTO empleados (nombre, cargo, telefono, id_usuario) VALUES
('Juan Pérez', 'Administrador de Sistemas', '555-0123', 1),
('María López', 'Desarrolladora Senior', '555-0456', 2),
('Carlos Mendoza', 'Gerente de TI', '555-0789', 3),
('Ana Gómez', 'Ejecutiva de Ventas', '555-0111', 4),
('Luis Torres', 'Soporte Técnico', '555-0222', 5);

INSERT INTO clientes (nombre, telefono, direccion) VALUES
('Alejandro Silva', '555-8765', 'Av. Intercomunal, Res. El Parque, Apto 4B'),
('Laura Sofía Benítez', '555-4321', 'Calle 50 #12-34, Barrio San José'),
('Distribuidora Norte C.A.', '555-9988', 'Zona Industrial Castillito, Galpón 7'),
('Carlos Eduardo Ruiz', '555-5566', 'Carrera 19 con Calle 30, Edif. Centro'),
('Patricia Delgado', '555-2233', 'Urbanización Las Mercedes, Calle París, Qta. Paty');

INSERT INTO productos (nombre, categoria, precio_compra, precio_venta, fecha_vencimiento, estado) VALUES
('Leche Entera 1L', 'Lácteos', 0.85, 1.20, '2026-08-15', 'Disponible'),
('Arroz Integral 1kg', 'Abarrotes', 1.10, 1.75, '2027-03-20', 'Disponible'),
('Yogurt de Fresa 250g', 'Lácteos', 0.45, 0.75, '2026-07-10', 'Agotado'),
('Detergente Líquido 2L', 'Limpieza', 3.20, 5.50, NULL, 'Disponible'),
('Pan de Molde Familiar', 'Panadería', 1.20, 2.10, '2026-06-25', 'Disponible');

SELECT * FROM usuarios; 
SELECT * FROM empleados;
SELECT * FROM clientes;
SELECT * FROM productos;

INSERT INTO inventarios (id_producto, cantidad) VALUES
(1, 50),  -- Relacionado con Leche Entera
(2, 120), -- Relacionado con Arroz Integral
(3, 0),   -- Relacionado con Yogurt de Fresa (Agotado)
(4, 35),  -- Relacionado con Detergente Líquido
(5, 15);  -- Relacionado con Pan de Molde

INSERT INTO pedidos (id_cliente, id_empleado, fecha_pedido, estado) VALUES
(1, 4, '2026-06-01', 'Entregado'), -- Cliente Alejandro atendido por Ana Gómez
(3, 4, '2026-06-05', 'Entregado'), -- Cliente Distribuidora Norte atendido por Ana Gómez
(2, 5, '2026-06-10', 'Pendiente'), -- Cliente Laura atendido por Luis Torres
(5, 5, '2026-06-11', 'Pendiente'), -- Cliente Patricia atendido por Luis Torres
(4, 4, '2026-06-12', 'Cancelado'); -- Cliente Carlos atendido por Ana Gómez

INSERT INTO movimientos (id_producto, id_usuario, tipo, cantidad, fecha_movimiento) VALUES
(1, 2, 'Entrada', 50, '2026-06-01'),  -- María López registró entrada de 50 Leches
(2, 2, 'Entrada', 120, '2026-06-02'), -- María López registró entrada de 120 Arroz
(1, 4, 'Salida', 5, '2026-06-05'),    -- Ana Gómez registró salida (venta) de 5 Leches
(4, 2, 'Entrada', 35, '2026-06-10'),  -- María López registró entrada de 35 Detergentes
(5, 5, 'Salida', 2, '2026-06-12');    -- Luis Torres registró salida de 2 Panes de Molde

INSERT INTO ventas (id_cliente, id_producto, id_empleado, cantidad, total, fecha_venta) VALUES
(1, 1, 4, 5, 6.00, '2026-06-05'),   -- Alejandro compró 5 Leches ($1.20 c/u) con Ana
(3, 2, 4, 20, 35.00, '2026-06-06'), -- Dist. Norte compró 20 Arroz ($1.75 c/u) con Ana
(2, 4, 5, 2, 11.00, '2026-06-10'),  -- Laura compró 2 Detergentes ($5.50 c/u) con Luis
(5, 5, 5, 1, 2.10, '2026-06-11'),   -- Patricia compró 1 Pan ($2.10) con Luis
(4, 1, 4, 10, 12.00, '2026-06-12'); -- Carlos compró 10 Leches ($1.20 c/u) con Ana

SELECT * FROM inventarios; 
SELECT * FROM pedidos;
SELECT * FROM movimientos;
SELECT * FROM ventas;