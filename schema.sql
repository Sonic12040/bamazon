DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES 
('Sour Patch Kids', 'Grocery', 4.09, 200), 
('Milk', 'Grocery', 2.79, 20), 
('Super Mario Odyssey', 'Toys and Games', 59.99, 3), 
('Nail Clippers', 'Grooming', 3.79, 16), 
('Dresser', 'Furniture', 199.99, 4), 
('The Last Starfighter', 'Movies and TV', 24.99, 6000), 
('Nintendo Switch', 'Toys and Games', 249.99, 100), 
('iPhone X', 'Mobile Devices', 999.99, 16), 
('iPhone 7', 'Mobile Devices', 499.99, 4), 
('XPS 15', 'Computers', 3299.99, 2);