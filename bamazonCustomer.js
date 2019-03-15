var mysql = require('mysql')
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',

  port: 3306,

  user: 'root',

  password: 'Redmond2017',
  database: 'bamazon'


});

connection.connect(function (err){
if (err) throw err
console.log("connected at ID" + connection.threadId)
})
function displayItems () {
    connection.query("SELECT * FROM products", function(err, response){
        if (err) throw err
        console.table(response)
    })
}

displayItems();