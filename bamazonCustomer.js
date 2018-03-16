//Required node packages
var mysql = require('mysql');
var inquirer = require('inquirer');

//Connection method to bamazon database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  //Start function after connection is made
  start();
});

//Invokes prompt to see all products in the store
function start() {

    inquirer.prompt([{
        type: "confirm",
        name: "confirm",
        message: "Bamazon! You Buy What We Have? Yes?",
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            inventory();
        } 
        else {
            console.log("Oh, You Cheap! Don't Come Back!");
        }
    });
}

//Displays all the product in the store
function inventory() {

        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {
			console.log('Product ID: ' + res[i].item_id + ' Product Name: ' + res[i].product_name + ' Price: ' + '$' + res[i].price + ' Quantity: ' + res[i].stock_quantity);
    		}
    	});
}

//Prompts if they want to buy a product
function buyingProduct() {

    inquirer.prompt([{

        type: "confirm",
        name: "buying",
        message: "Would you like to buy an item?",
        default: true

    }]).then(function(user) {
        if (user.buying === true) {
            selectingProduct();
        } 
        else {
            console.log("Oh, You're Really Cheap! Don't Come Back!");
        }
    });
}

//Prompts user on what they want to buy
function selectingProduct() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Enter the product ID you're buying!",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many do you want to buy?",

        }
    ]).then(function(userPurchase) {
    	//Find product in the database
        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {
                    console.log("We Have No More! Buy Something Else!");
                    start();
                } 
                else {
                	console.log("===================================");
                    console.log("Thank you! You just bought " + res[i].product_name);
                    console.log("Department: " + res[i].department_name);
                    console.log("Price: " + res[i].price);
                    console.log("Quantity: " + userPurchase.inputNumber);
                    console.log("----------------------");
                    console.log("Total: " + res[i].price * userPurchase.inputNumber);
                    console.log("===================================");

                    var updateStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
                    confirmProduct(updateStock, purchaseId);
                }
            }
        });
    });
}

function confirmProduct(updateStock, purchaseId) {
	//Makes sure user wants to buy product
    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Don't Play with Us! You Going to Buy It or Not?",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: updateStock
            }, {
                item_id: purchaseId
            }], function(err, res) {});

            console.log("=================================");
            console.log("Thank You for Your Business! Come Back!");
            console.log("=================================");
            start();
        } 
        else {
            console.log("=================================");
            console.log("Oh, You're Really Cheap! Don't Come Back!");
            console.log("=================================");
            start();
        }
    });
}