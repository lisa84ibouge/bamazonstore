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
if (err) throw err;
console.log("connected at ID" + connection.threadId)
})
function displayItems () {
    connection.query("SELECT * FROM products", function(err, response){
        if (err) throw err;
        console.table(response);
        promptCustomer(response);
        
    })

}

var promptCustomer = function(response) {
    inquirer.prompt([{
        type: 'input', 
        name: 'choice', 
        message: "What would you like to purchase? [Quit with Q]"
    }]).then(function(answer){
        var correct =  false; 
        if (answer.choice.toUpperCase()=='Q'){
            process.exit();
        }
        for (var i = 0; i < response.length; i++){
            //console.log('answer.choice "' + answer.choice + '" vs response "' + response[i].product_name + '"');
            if (response[i].product_name==answer.choice)
            
            {

                correct = true; 
                var product = answer.choice; 
                var id = i;
                inquirer.prompt({
                    type: 'input', 
                    name: 'quantity', 
                    message: 'How many would you like to buy?', 
                    validate: function(value){
                        if (isNaN(value)==false){
                            return true; 
                        } else { 
                            return false ;
                        }
                    }
                }).then(function(answer){
                    console.log()
                    if((response[id].stock_quantity-answer.quantity) >= 0){
                        var sql = "UPDATE products SET stock_quantity='" + (response[id].stock_quantity-answer.quantity)+ "'WHERE product_name = '" + product + "'";
                        connection.query(sql, function(err, res2){
                            console.log("Product Bought!");
                            displayItems();
                        })
                    }else { 
                        console.log('Not a valid selection! 2');
                        promptCustomer(response);
                    }
                })
            }
        }
        if (i == response.length && correct == false){
            console.log("Not a valid selection!");
            promptCustomer(response);
        }
    })
}

displayItems();
