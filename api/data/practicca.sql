DROP DATABASE IF EXISTS DBVENTA;
CREATE DATABASE DBVENTA;
USE DBVENTA;
-- creamos la tabla de cliente 
CREATE TABLE CLIENTE (
id int not null PRIMARY KEY auto_increment,
ci VARCHAR(20) not null,
nombre VARCHAR(50) not NULL,
apellidos varchar(50) not null,
direccion varchar 250),
telefono Varchar(15)
)ENGINE=InnoDB;
-- crear la tabla empleado
CREATE TABLET EMPLEADO (
id int not null PRIMARY key auto_increment,
ci VARCHAR(20) not null,
nombre VARCHAR(50) not NULL
apellidos varchar (50) not NULL
)ENGINE=InnoDB;
-- crear la tabla pedidos
CREATE TABLE PEDIDOS(
id int not null PRIMARY key auto_increment,
cod_cliente int not null,
fecha_compra datetime not null,
cantidad int not null,
cod_empleado int not null,
FOREIGN KEY 
);