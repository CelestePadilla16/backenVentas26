-- ejercicio dos 
SELECT * 
FROM producto 
WHERE stock<=50;

-- ejercicio dos 
SELECT * 
FROM empleado 
WHERE apeliidos like "a%"
-- cliente mas su pedidos
SELECT c.nombre
       c.apellidos,
       p.fecha_compra,
       p.cantidad
FROM pedidos AS p, clientes as c
INNER JOIN cliente c ON c.Id = p.cod_cliente;
-- ejercicio dos 
SELECT e.apellidos,
       e.nombre,
			 COUT(e.id) as TotalVendido
FROM empleado e 
INNER JOIN pedidos p ON e.id=p.cod_empleado
GROUP BY e.id 

SELECT e.apellidos,
       e.nombre,
			 COUT(e.id) as TotalVendido
FROM empleado e 
LEFT JOIN pedidos p ON e.id=p.cod_empleado
GROUP BY e.id 


SELECT p.cod_barras,p.descripcion,p.precio_unitario
FROM producto p
ORDER BY precio_unitario DESC;