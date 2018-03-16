DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id MEDIUMINT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (100) NOT NULL,
    department_name VARCHAR (50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT (10) NOT NULL,
    PRIMARY KEY (item_id)
);

SElECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
    ("Xbox One X","Electronics",499.99,100),
    ("A Wrinkle in Time","Books",9.99,200),
    ("Hamilton Beach Waffle Maker","Applicances",24.99,50),
    ("Ray Ban Sunglasses","Fashion",199.00,20),
    ("Levi Jeans","Clothing",45.99,25),
    ("Incase Backpack","Luggage",99.99,45),
    ("Xbox One Controller","Electronics",59.99,50),
    ("Keurig Coffee Maker","Applicances",79.99,50),
    ("Game of Thrones Blu-Ray Box Set","Entertainment",89.99,35),
    ("La Croix","Food",5.99,20);