var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3307,
	user: 'ClassUser',
	password: 'password',
	database: 'bamazon'
});
var user = '';

connection.connect(function(err) {
	if (err) throw err;
	console.log('Connection success!');
	loginPrompt();
});

function loginPrompt() {
	//Ask for UserName and Password
	inquirer.prompt([
		{
			type: 'input',
			name: 'user',
			message: 'What is your username?'
		},
		{
			type: 'input',
			name: 'pass',
			message: 'What is your password?'
		}
	]).then(function(res) {
		//Switch sending the user down the appropriate view.
		if (res.user === 'customer' && res.pass === 'password') {
			user = 'customer';
			showProducts();
		}
		else if (res.user === 'manager' && res.pass === 'password') {
			user = 'manager';
			managerPrompt();
		}
		else {
			console.log('Unauthorized Account. Try again.');
			loginPrompt();
		}
	});
}

function customerPrompt(inventory) {
	inquirer.prompt([
		{
			type: 'input',
			name: 'productChoice',
			message: 'Type the ID of the product you would like to purchase!'
		}
	]).then(function(val) {
		let choice = parseInt(val.productChoice);
		let product = checkInventory(choice, inventory);
		if (product) {
			customerQuantityPrompt(product);
		} else {
			console.log('That product is not in our inventory. Please try again.');
			showProducts();
		}
	});
}

function checkInventory(choice, inventory) {
	for (let i = 0; i < inventory.length; i++) {
		if (inventory[i].item_id === choice) {
			return inventory[i];
		}
	}
	return null;
}

function showProducts() {
	let query = 'SELECT * from products';
	connection.query(query, function(err, inventory) {
		console.table(inventory);
		if (user === 'customer') {
			customerPrompt(inventory);
		}
		else if (user === 'manager') {
			managerPrompt(inventory);
		}
	});

}

function customerQuantityPrompt(product) {
	inquirer.prompt([
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to purchase?'
		}
	]).then(function(val) {
		let quantity = parseInt(val.quantity);
		if (quantity > product.stock_quantity) {
			console.log('There aren\'t enough of that product in stock. Please try again.');
			showProducts();
		} else {
			makePurchase(product, quantity);
		}
	});
}

function makePurchase(product, quantity) {
	connection.query(
		'UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
		[quantity, product.item_id],
		function(err, res) {
			console.log('Your purchase was a success!');
			console.log('The total came to ' + (quantity * product.price));
			showProducts();
		}
	);
}

function managerPrompt() {
	inquirer.prompt([
		{
			type: 'list',
			name: 'managerChoice',
			message: 'What would you like to do?',
			choices: ['Show Products', 'Low Inventory Check', 'Add to Inventory', 'New Product']
		}
	]).then(function(res) {
		console.log(res.managerChoice);
		if (res.managerChoice === 'Show Products') {
			showProducts();
		}
		else if (res.managerChoice === 'Low Inventory Check') {
			lowInventoryCheck();
		}
		else if (res.managerChoice === 'Add to Inventory') {
			addToInventory();
		}
		else if (res.managerChoice === 'New Product') {
			newItem();
		} else {
			console.log('Error Occurred in Choice.');
			managerPrompt();
		}
	});
}

function lowInventoryCheck() {
	connection.query(
		'SELECT * FROM products WHERE stock_quantity <=5',
		function (err, lowinventory) {
			if (err) throw err;
			console.table(lowinventory);
			managerPrompt();
		}
	);
}

function addToInventory() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'productID',
			message: 'What is the ID of the product you would like to replenish?'
		},
		{
			type: 'input',
			name: 'qtyAdded',
			message: 'How many would you like to add to inventory?'
		}
	]).then(function(res) {
		let inputs = ['qtyAdded', 'productID'];
		let query = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?';
		connection.query(query, inputs, function(err, res) {
			if (err) throw err;
			console.log('Product replenished. Returning to the Main Menu!');
			managerPrompt();
		});
	});
}

function newItem() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'addedProduct',
			message: 'What product would you like to add?'
		},
		{
			type: 'input',
			name: 'productDept',
			message: 'What department is this product in?'
		},
		{
			type: 'input',
			name: 'qtyAdded',
			message: 'How many of the product would you like to add?'
		},
		{
			type: 'input',
			name: 'addedProductPrice',
			message: 'What is the price of the product you are adding?'
		}

	]).then(function(res) {
		let inputs = [res.addedProduct, res.productDept, parseFloat(res.addedProductPrice), parseInt(res.qtyAdded)];
		let query = 'INSERT INTO products SET product_name=?, department_name=?, price=?, stock_quantity=?';
		connection.query(query, inputs, function(err, result) {
			if (err) throw err;
			console.log('Your product has been added to the database!');
			managerPrompt();
		});
	});

}