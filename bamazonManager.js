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

//Prompt user for another purchase
function newPurchase(){
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to perform another transaction?'
	}]).then(function(answer){
		if (answer.choice === true) {
			start();
		}
		else {
			console.log("You So Cheap! Leave!");
		}
	})
}

function start(){
	inquirer.prompt([{
		type: 'list',
		name: 'input',
		message: 'You are a manager, Do your job or something!',
		choices: ['1. View Products for sale', '2. View low inventory', '3. Add to inventory', '4. Add new product']
	}]).then(function(answer) {
		if (answer.input === '1. View Products for sale') {
			connection.query('SELECT * FROM products', function(err, res){
			if (err) throw err;
			console.log('===================== Products =====================');
			for (i = 0; i < res.length; i++) {
				console.log('Product ID:' + res[i].item_id);
				console.log('Name: ' + res[i].product_name);
				console.log('Price: ' + '$' + res[i].price);
				console.log('Quantity: ' + res[i].stock_quantity);
				console.log('==========================');
			}
			newPurchase();
			})
		}
		else if (answer.input === '2. View low inventory') {
			connection.query('SELECT * FROM products WHERE StockQuantity < 5', function(err, res){
				if (err) throw err;
				console.log('')
				console.log('===================== Low Stock =====================');
				for (i = 0; i < res.length; i++) {
					console.log('Name: ' + res[i].product_name);
					console.log('Product ID: ' + res[i].item_id);
					console.log('Quantity: ' + res[i].stock_quantity);
					console.log('====================');
				}
				newPurchase();
			})
		}
		else if (answer.input === '3. Add to inventory') {
			inquirer.prompt([{
				name: 'item',
				message: 'Enter the product ID of the item you want to update:',
				validate: function(value){
					var valid = value.match(/^[0-9]+$/);
					if (valid === true) {
						return true
					}
						return 'Please enter a real value'
					}
			},{
				name: 'number',
				message: 'How many items would you like to add to the current stock?',
				validate: function(value){
					var valid = value.match(/^[0-9]+$/);
					if (valid === true) {
						return true
					}
						return 'Please enter a real value'
					}
			}]).then(function(answer){
				connection.query('SELECT * FROM products WHERE id = ?', [answer.item], function(err, res){
						connection.query('UPDATE products SET ? Where ?', [{
							stock_quantity: res[0].stock_quantity + parseInt(answer.number)
						},{
							id: answer.item
						}], function(err, res){});
				})
				console.log('Inventory was updated!');
				newPurchase();
			})
		}
		else if (answer.input === '4. Add new product') {
			inquirer.prompt([{
				name: 'product',
				message: 'Enter name of product:'
			},{
				name: 'department',
				message: 'Enter a department for this product'
			},{
				name: 'price',
				message: 'Enter a price for this product',
				validate: function(value){
					var valid = value.match(/^[0-9]+$/);
					if (valid === true) {
						return true
					}
						return 'Please enter a real value'
					}
			},{
				name: 'stock',
				message: 'Please enter a stock quantity for this product',
				validate: function(value){
					var valid = value.match(/^[0-9]+$/)
					if (valid === true) {
						return true
					}
						return 'Please enter a real value'
					}
			}]).then(function(answer){
				connection.query('INSERT into products SET ?', {
					product_name: answer.product,
					department_name: answer.department,
					price: answer.price,
					stock_quantity: answer.stock
				}, function(err, res){});
				console.log('Product Was Added Successfully!');
				newPurchase();
			})
		}
	})
};

