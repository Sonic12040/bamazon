var mysql = require('mysql');
var inquirer = require('inquirer');

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
            customerPrompt();
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

function customerPrompt() {
    console.log('Customer Prompt Success!');
    showProducts();
};

function showProducts() {
    console.log('Show Products Success!');
};

function managerPrompt() {
    console.log('Manager Prompt Success!');
};

function supervisorPrompt() {
    console.log('Supervisor Prompt Success!');
};



loginPrompt();