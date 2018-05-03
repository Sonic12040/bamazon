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
            showProducts();
            customerPrompt(inventory);
        }
        else if (res.user === 'manager' && res.pass === 'password') {
            managerPrompt();
        }
        else if (res.user === 'supervisor' && res.pass === 'password') {
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
            customerQuantityPrompt();
        } else {
            console.log('That product is not in our inventory. Please try again.');
            showProducts();
            customerPrompt(inventory);
        }
    });
};

function checkInventory(choice, inventory) {
    console.log('Check Inventory Success!');
    for (let i = 0; i < array.length; i++) {
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
    });
    return inventory;
};

function managerPrompt() {
    console.log('Manager Prompt Success!');
};

function supervisorPrompt() {
    console.log('Supervisor Prompt Success!');
};