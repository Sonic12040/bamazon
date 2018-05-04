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
            let user = 'customer';
            showProducts();
        }
        else if (res.user === 'manager' && res.pass === 'password') {
            let user = 'manager';
            managerPrompt();
        }
        else if (res.user === 'supervisor' && res.pass === 'password') {
            let user = 'supervisor';
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
            managerPrompt();
        } 
        else if (user === 'supervisor'){
            supervisorPrompt();
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
        managerPrompt();
    })
};

function supervisorPrompt() {
    console.log('Supervisor Prompt Success!');
};