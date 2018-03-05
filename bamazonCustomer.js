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