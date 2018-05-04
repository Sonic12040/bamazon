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
})

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
        else if (res.user === 'supervisor' && res.pass === 'password') {
            user = 'supervisor';
            supervisorPrompt();
        } else {
            console.log("Unauthorized Account. Try again.");
            loginPrompt();
        };
    });
};

function customerPrompt(inventory) {
    console.log('Customer Prompt Success!');
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
};

function checkInventory(choice, inventory) {
    console.log('Check Inventory Success!');
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choice) {
            return inventory[i];
        };
    };
    return null;
};

function showProducts() {
    console.log('Show Products Success!');
    let query = 'SELECT * from products';
    connection.query(query, function(err, inventory) {
        console.table(inventory);
        if (user === 'customer') {
            customerPrompt(inventory);
        }
        else if (user === 'manager') {
            managerPrompt(inventory);
        } 
        else if (user === 'supervisor'){
            supervisorPrompt(inventory);
        };
    });

};

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
        };
    });
};

function makePurchase(product, quantity) {
    connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
        [quantity, product.item_id],
        function(err, res) {
            console.log('Your purchase was a success!');
            console.log('The total came to ' + (quantity * product.price));
            showProducts();
        }
    )
};

function managerPrompt() {
    console.log('Manager Prompt Success!');
    inquirer.prompt([
        {
            type: 'list',
            name: 'managerChoice',
            message: 'What would you like to do?',
            choices: ["Show Products", "Low Inventory Check", "Add to Inventory", "New Product"]
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
        };
    });
};

function lowInventoryCheck() {
    console.log('Low Inventory Check Success!');
    managerPrompt();
};

function addToInventory() {
    console.log('Add to Inventory Success!');
    managerPrompt();
};

function newItem() {
    console.log('New Item Success!');
    managerPrompt();
};

function supervisorPrompt() {
    console.log('Supervisor Prompt Success!');
};