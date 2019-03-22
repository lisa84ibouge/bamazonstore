var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'Redmond2017',
    database: 'bamazon'


});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected at ID" + connection.threadId)
})


function displayForSale() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.table(response);


    })

}


function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 10", function (err, response) {
        if (err) throw err;
        console.table(response);
    })

}

function addToInventory() {
    inquirer.prompt([{
        message: "Which product would you like to add inventory to?",
        type: "rawlist",
        name: "addInventoryChoices",
        choices: ["gioseppo sneakers", "gioseppo sandals", "gioseppo boots", "gioseppo heels", "gioseppo dress shoes"]
    }]).then(function (answer) {
        inquirer.prompt([{
            message: "How much would you like to add?",
            type: "input",
            name: "chooseQuantity",

        }]).then(function (answerStock) {
            if ((parseInt(answerStock.chooseQuantity)) >= 1) {
                var sql = "UPDATE products SET stock_quantity=stock_quantity + " + (answerStock.chooseQuantity) + " WHERE product_name = '" + answer.addInventoryChoices + "'";
                connection.query(sql, function (err, res2) {
                    console.log("Inventory Added!");
                    displayForSale();
                })
            }

        })
    })
}

function createNewProduct() {
    inquirer.prompt([{
        message: "What product would you like to add?",
        type: "input",
        name: "addNewProduct",

    }]).then(function (answerNewProduct) {
        inquirer.prompt([{
            message: "What department will this be for?",
            type: "input",
            name: "chooseNewDepartment",



        }]).then(function (answerNewDepartment) {
            
            inquirer.prompt([{
                message: "What would you like the price to be?",
                type: "input",
                name: "chooseNewProductPrice",

            }]).then(function (answerProductPrice) {
            
                inquirer.prompt([{
                    message: "How much would you like to add?",
                    type: "input",
                    name: "chooseProductQuantity",

                }]).then(function (answerProductQuantity) {
                    
                     
                        var sqlNewProduct = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answerNewProduct.addNewProduct + "', '" + answerNewDepartment.chooseNewDepartment + "', " + answerProductPrice.chooseNewProductPrice + ", " + answerProductQuantity.chooseProductQuantity + ")";
                        connection.query(sqlNewProduct, function (err, res3) {
                            if (err) throw err;
                            console.log("New Product Added!");
                            displayForSale();
                            promptManager();
                        })
                   

                })
            })
        })
    })
};

var promptManager = function (response) {
    inquirer.prompt([{
        message: "What would you like to do?",
        type: "rawlist",
        name: "todolist",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (answer) {
        var correct = false;
        console.log(answer.todolist);
        if (answer.todolist == 'View Products for Sale') {
            displayForSale();

        } else if (answer.todolist == "View Low Inventory") {
            viewLowInventory()
        } else if (answer.todolist == "Add to Inventory") {
            addToInventory()
        } else if (answer.todolist == "Add New Product") {
            createNewProduct();
        } else {
            process.exit()
            promptManager();
        }

        /*    for (var i = 0; i < response.length; i++) {
                //console.log('answer.choice "' + answer.choice + '" vs response "' + response[i].product_name + '"');
                if (response[i].product_name == answer.choice)

                {

                    correct = true;
                    var product = answer.choice;
                    var id = i;
                    inquirer.prompt({
                        type: 'input',
                        name: 'quantity',
                        message: 'How many would you like to buy?',
                        validate: function (value) {
                            if (isNaN(value) == false) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function (answer) {
                        console.log()
                        if ((response[id].stock_quantity - answer.quantity) >= 0) {
                            var sql = "UPDATE products SET stock_quantity='" + (response[id].stock_quantity - answer.quantity) + "'WHERE product_name = '" + product + "'";
                            connection.query(sql, function (err, res2) {
                                console.log("Product Bought!");
                                displayItems();
                            })
                        } else {
                            console.log('Not a valid selection! 2');
                            promptCustomer(response);
                        }
                    })
                }
            }
            if (i == response.length && correct == false) {
                console.log("Not a valid selection!");
                promptCustomer(response);
            }
            */
    })
}










promptManager()
