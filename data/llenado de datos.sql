INSERT INTO CLIENTE (CI, nombre, apellidos, direccion, telefono) VALUES
('2000001', 'Carlos', 'Mendoza Ruíz', 'Av. Las Américas No. 123', '71023456'),
('2000002', 'Ana María', 'Gómez Peralta', 'Calle Arce No. 45', '60012345'),
('2000003', 'Juan Pablo', 'Rodríguez Silva', 'Barrio Lindo, Cl. 3 Esquina', '72234567'),
('2000004', 'María José', 'Fernández López', 'Av. San Martín, Edif. Central Apt. 4B', '70543210'),
('2000005', 'Luis Fernando', 'Martínez Castro', 'Urb. Los Pinos, Pasaje C', '65098765'),
('2000006', 'Laura Sofía', 'Torres Suárez', 'Calle Bolívar No. 789', '77112233'),
('2000007', 'Diego Alejandro', 'Ramírez Chaves', 'Av. Circunvalación Km 2', '61234567'),
('2000008', 'Paula Andrea', 'Flores Benítez', 'Barrio San Pedro, Cl. Tarija', '70088990'),
('2000009', 'Andrés Felipe', 'Morales Gutiérrez', 'Zona Sud, Calle 4 No. 12', '76543219'),
('2000010', 'Diana Carolina', 'Pereira Delgado', 'Av. Melchor Pinto No. 550', '60987654'),
('2000011', 'Santiago', 'Vargas Ortiz', 'Condominio El Bosque, Casa 12', '73344556'),
('2000012', 'Natalia', 'Rojas Méndez', 'Calle Sucre No. 321', '68877665'),
('2000013', 'Sebastián', 'Castillo Núñez', 'Av. Banzer entre 3er y 4to Anillo', '71556677'),
('2000014', 'Camila', 'Paredes Espinoza', 'Barrio Equipetrol, Calle 8 Oeste', '72011223'),
('2000015', 'Javier', 'Sánchez Ortega', 'Zona Central, Calle Murillo', '60122334'),
('2000016', 'Valentina', 'Ríos Acosta', 'Av. Busch No. 840', '75566778'),
('2000017', 'Mateo', 'Guzmán Franco', 'Urb. El Recreo, Manzano 4 Lote 10', '70778899'),
('2000018', 'Isabella', 'Muñoz Medina', 'Calle Potosí No. 156', '61122334'),
('2000019', 'Nicolás', 'Salazar Herrera', 'Av. Roca y Coronado, Cl. Los Tajibos', '78899001'),
('2000020', 'Gabriela', 'Villalba Cruz', 'Barrio Urbarí, Calle Las Palmas No. 9', '60554433');

INSERT INTO empleado (CI, nombre, apellidos) VALUES
('1020304', 'Carlos', 'Mendoza Ruíz'),
('2030405', 'Ana María', 'Gómez Peralta'),
('3040506', 'Juan Pablo', 'Rodríguez Silva'),
('4050607', 'María José', 'Fernández López'),
('5060708', 'Luis Fernando', 'Martínez Castro'),
('6070809', 'Laura Sofía', 'Torres Suárez'),
('7080910', 'Diego Alejandro', 'Ramírez Chaves'),
('8091011', 'Paula Andrea', 'Flores Benítez'),
('9101112', 'Andrés Felipe', 'Morales Gutiérrez'),
('1122334', 'Diana Carolina', 'Pereira Delgado'),
('2233445', 'Santiago', 'Vargas Ortiz'),
('3344556', 'Natalia', 'Rojas Méndez'),
('4455667', 'Sebastián', 'Castillo Núñez'),
('5566778', 'Camila', 'Paredes Espinoza'),
('6677889', 'Javier', 'Sánchez Ortega'),
('7788990', 'Valentina', 'Ríos Acosta'),
('8899001', 'Mateo', 'Guzmán Franco'),
('9900112', 'Isabella', 'Muñoz Medina'),
('1234567', 'Nicolás', 'Salazar Herrera'),
('7654321', 'Gabriela', 'Villalba Cruz');

INSERT INTO producto (cod_barras, descripcion, stock, precio_unitario) VALUES
('7501055312341', 'Arroz Integral Extra 1kg', 150, 2.50),
('7501055312342', 'Aceite de Girasol 1L', 85, 3.80),
('7501055312343', 'Leche Entera Larga Vida 1L', 200, 1.20),
('7501055312344', 'Fideos Spaguetti 500g', 120, 0.95),
('7501055312345', 'Café Tostado Molido 250g', 45, 4.50),
('7501055312346', 'Azúcar Blanca Refinada 1kg', 90, 1.10),
('7501055312347', 'Sal Yodada de Mesa 500g', 300, 0.50),
('7501055312348', 'Atún en Agua en Lata 140g', 180, 1.75),
('7501055312349', 'Galletas de Agua Pack x3', 75, 1.30),
('7501055312350', 'Harina de Trigo 0000 1kg', 110, 0.85),
('7501055312351', 'Detergente Líquido Ropa 3L', 40, 8.90),
('7501055312352', 'Jabón de Tocador Glicerina', 160, 1.05),
('7501055312353', 'Shampoo Control Caspa 400ml', 55, 3.20),
('7501055312354', 'Papel Higiénico 4 Rollos', 130, 2.10),
('7501055312355', 'Crema Dental Triple Acción', 95, 1.90),
('7501055312356', 'Jugo de Naranja Natural 1L', 60, 1.65),
('7501055312357', 'Agua Mineral Sin Gas 2L', 250, 0.90),
('7501055312358', 'Cereal de Maíz Integral 500g', 35, 3.40),
('7501055312359', 'Salsa de Tomate Pomarola 400g', 140, 1.15),
('7501055312360', 'Mermelada de Frutilla 390g', 50, 2.30);

SELECT * FROM CLIENTE;
SELECT * FROM empleado;
SELECT * FROM producto;



INSERT INTO pedido (cod_cliente, fecha_compra, cantidad, cod_empleado) VALUES
(1, '2026-05-29 09:15:00', 3, 1),
(2, '2026-05-29 10:45:00', 8, 2),
(3, '2026-05-29 11:30:00', 2, 3),
(4, '2026-05-29 13:20:00', 15, 4),
(5, '2026-05-29 14:05:00', 1, 5,
(6, '2026-05-29 15:55:00', 6, 6),
(7, '2026-05-29 16:40:00', 4, 7),
(8, '2026-05-29 17:10:00', 9, 8),
(9, '2026-05-29 18:00:00', 5, 9),
(10, '2026-05-29 19:25:00', 11, 10);

INSERT INTO pedido_producto (cod_producto, cod_pedido, cantidad, precio_unitario, descuento) VALUES
(1, 11, 3, 8.90, 1.00),  -- pedido 1: Monitor
(2, 12, 8, 3.20, 0.00),  -- pedido 2:Shampoos 
(3, 13, 2, 1.90, 0.20),  -- pedido 3:Crema
(4, 14, 15, 1.05, 1.50), -- pedido 4:Jabone
(5, 15, 1, 2.10, 0.00),  -- pedido 5:Papel
(6, 16, 6, 1.65, 0.50),  -- pedido 6:Jugo
(7, 17, 4, 3.40, 0.00),  -- pedido 7:Cereal
(8, 18, 9, 2.30, 1.20),  -- pedido 8:Mermelada
(9, 19, 5, 0.90, 0.00),  -- pedido 9:Agua
(10, 20, 11, 1.15, 0.75); -- pedido 10:Salsa

INSERT INTO empleado_pedido (cod_pedido, cod_empleado, fecha) VALUES
(1, 5, '2026-05-10'),
(2, 12, '2026-05-11'),
(3, 3, '2026-05-11'),
(4, 8, '2026-05-12'),
(5, 20, '2026-05-12'),
(6, 1, '2026-05-13'),
(7, 14, '2026-05-14'),
(8, 7, '2026-05-14'),
(9, 19, '2026-05-15'),
(10, 2, '2026-05-15');

SELECT * FROM pedido;
SELECT * FROM pedido_producto;
SELECT * FROM empleado_pedido;