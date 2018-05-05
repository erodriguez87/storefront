//Main logic file -- Top section for declaring required variable packages
  var mysql = require("mysql");
  var inquirer = require("inquirer");
  var figlet = require("figlet");

// create the connection information for the sql database
  var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "SQLPassword!",
    database: "bamazon"
  });

// connect to the mysql server and sql database then call the read products function
  connection.connect(function(err) {
    if (err) throw err;
    readProducts();
  });

// find the products and display products from sql. call the buying function
  function readProducts() {
    connection.query("SELECT * FROM products;",function(err,res) {
        if (err) throw err;
        for (i=0;i<res.length; i++){
          console.log(`ID: ${res[i].item_id} | Product: ${res[i].product_name} | Price: $${res[i].price}`)
        }
        console.log(`\n`);
        buyWhat();
    });
  }

//Let the user pick what they want to buy. 
  function buyWhat(){
    //read from sql and create an array of items the user can pick from
    connection.query("SELECT * FROM products;", function(err, res) {
      if (err) throw err;
        var choiceArray = [];
        for (var i = 0; i < res.length; i++) {
          choiceArray.push(res[i].item_id);
        }
      
    inquirer
      .prompt([
        {
          name: "choices",
          type: "list",
          choices: ['1','2','3','4','5','6','7'],
          message: "These are the items available. Which one would you like to buy?"
        }, {
          type: 'input', 
          message: 'How many would you like to buy?', 
          name: 'qty'
        }, 
      ])
      .then(function(answer) {
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id == answer.choices) {
            chosenItem = res[i];
          }
        }
        console.log('\n===============You Chose a================');
        console.log('==========================================\n')  
        console.log(`ID: ${chosenItem.item_id} | Product: ${chosenItem.product_name} | Price: $${chosenItem.price}`)

        figgy(chosenItem.product_name);
        checkQty(chosenItem.item_id,answer.qty,chosenItem.product_name,chosenItem.price,chosenItem.stock_quantity);
        
      });
    });
  }

//the figlet drawings function
  function figgy(item){
    figlet(item, function(err, data) {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }
      console.log(data)
    });
  }

//check quantity before the order goes through
  function checkQty(id,qty,product,price,available){
    var canBuy = false;
    var remaining = parseInt(available) - parseInt(qty)
      if (remaining >=0){
        canBuy = true;
        console.log(`You are in great luck! There are enough available for your order\n`);
        console.log(`You are buying ${qty} of ${product} for a total price of ${qty*price}\n`);
          connection.query(`UPDATE products SET stock_quantity = '${remaining}' WHERE item_id='${id}';`, function(err, res) {
            if (err) throw err;
              });

          // add orders to a second table
          connection.query(
            "INSERT INTO bamazon.orders ?",
              {
                item_id: '1',
                product_name: product,
                department_name: 'tech',
                price: price,
                stock_quantity: qty
              },
              function(err, res) {
                console.log(`${qty} of ${product} purchased\n`)
              }          
          );
      } else {
        console.log('Sorry, we do not have enough in stock to fulfill your order');
      }

      connection.end();
  }