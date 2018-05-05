# bamazon

A demo version of Amazon, with Customer and Manager views!

## Before You Start

Be sure to run the schema.sql file to have the database and table created prior to running the app. The app interacts with the database, so the database is required for function.

## Login

[login]: './assets/readme/login.png'

In order to log in as a customer, please type in customer as the username and password as the password.

In order to log in as a manager, please type in manager as the username and password as the password.

If you type in an invalid login, then you will be notified in the console of an unauthorized login, and be redirected back to the login prompt function.

## Customer View

Upon logging into the customer view, you will be shown a list of the current products, presented as a table in the console object via the console.table npm package.

After the list of products is shown, the customer will be directed to the customer prompt, which asks the customer to type the ID of the product they would like to purchase.

After selecting a valid product ID, select a quantity you would like to purchase. If your quantity of products is available, the purchase will be successful, the database will be updated, and you will be shown a total cost for products purchased. You will then be redirected to the start of the customer view.

## Manager View

Managers are not shown a list of the current products by default. Instead, they are prompted with a menu which allows them to Show Products, Check Low Inventory, Add to Inventory, or New Product.

### Show Products

This will show a list of the current products in the database using console.table, then redirect the manager back to the Manager Prompt.

### Low Inventory Check

This will show a list of the current products in the database, with a qualifier saying that the stock_quantity column of the table has a value of less than five.

### Add to Inventory

This will let the manager restock a product by selecting a product ID then the quantity to add to the database. If the addition is successful, the manager is notified, and then redirected back to the manager prompt.

### New Product

This will let the manager create a new product in the database. The manager is prompted for the product, department, quantity, and price, then the object is added to the database, and the manager is returned to the manager prompt


## Thank You

Thank you for your time in viewing this project! It was a fun foray into MySQL!