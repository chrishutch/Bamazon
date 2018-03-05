//Required node packages
var mysql = require('mysql');
var inquirer = require('inquirer');

//Connection method to bamazon database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3000,
  user: "root",
  password: "123456",
  database: "bamazon"
})