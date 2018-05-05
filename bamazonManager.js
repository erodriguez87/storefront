//Main logic file -- Top section for declaring required variable packages
  var mysql = require("mysql");
  var inquirer = require("inquirer");
  var figlet = require("figlet");
  var newStock = [];

// create the connection information for the sql database
  var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "SQLPassword!",
    database: "bamazon"
  });

// set up the inital connection and call the options menu
  connection.connect(function(err) {
    if (err) throw err;
    mgrOptions();
  });

// find the products and display products from sql. call the buying function
  function mgrOptions() {
    inquirer
    .prompt([
      {
        name: "mgr",
        type: "list",
        choices: ['View Products for Sale','View Low Inventory', 'Add to Inventory', 'Add New Product'],
        message: "Welcome Store Manager. What would you like to to do today?"
      }, 
    ])
    .then(function(answer) {
      switch (answer.mgr) {
        case "View Products for Sale":
          viewProducts();
          break;
  
        case "View Low Inventory":
          lowInv();
          break;
  
        case "Add to Inventory":
          addInv();
          break;
  
        case "Add New Product":
          addProd();
          break;
      }
    });
  }
         
// Show the manager what products are available
  function viewProducts() {
    connection.query("SELECT * FROM products;",function(err,res) {
      if (err) throw err;
        for (i=0;i<res.length; i++){
          console.log(`\nID: ${res[i].item_id} | Product: ${res[i].product_name} | Price: $${res[i].price}`)
        }
      console.log(`\n`);
    }); 
    connection.end();
  };

// Show the manager products that have less than 10 qty left
  function lowInv(){
    connection.query("SELECT * FROM products WHERE stock_quantity < '10';",function(err,res) {
      if (err) throw err;
        for (i=0;i<res.length; i++){
          console.log(`\nID: ${res[i].item_id} | Product: ${res[i].product_name} | Price: $${res[i].price}`)
        }
      console.log(`\n`);
    }); 
    connection.end();
  };

// Let the manager update inventory available. 
  function addInv(){
    connection.query("SELECT * FROM products;",function(err,res) {
      if (err) throw err;
        for (i=0;i<res.length; i++){
          console.log(`ID: ${res[i].item_id} | Product: ${res[i].product_name} | Price: $${res[i].price}`)
          newStock[i] = res[i].stock_quantity;
        }
      console.log(`\n`);
    }); 
    inquirer
    .prompt([
      {
        name: "addItem",
        type: "input",
        message: "What item would you like to add stock to??"
      }, 
      {
        name: "qtyAdd",
        type: "input",
        message: "How much inventory are you adding?"
      }
    ])
    .then(function(answer) {
      var updateStock = parseInt(newStock[answer.addItem-1]) + parseInt(answer.qtyAdd);
      connection.query(`UPDATE products SET stock_quantity = '${updateStock}' WHERE item_id='${answer.addItem}';`,function(err,res) {
        if (err) throw err;
        console.log(`\nAdded ${answer.qtyAdd} to the inventory of item ${answer.addItem}`);
         connection.end();
      })
    });
  };
    
// Let the manager update inventory available. 
  function addProd(){
    inquirer
    .prompt([
      {
        name: "sku",
        type: "input",
        message: "Welcome manager, what item would you like to add. Enter a SKU?"
      }, 
      {
        name: "product",
        type: "input",
        message: "what is the product name?"
      },
      {
        name: "department",
        type: "input",
        message: "What department??"
      },
      {
        name: "year",
        type: "input",
        message: "Enter a Year for the product?"
      },
      {
        name: "price",
        type: "input",
        message: "How much are you charging for this?"
      },
      {
        name: "stock",
        type: "input",
        message: "How much Inventory do you have?"
      }
    ])
    .then(function(answer) {
      connection.query(`INSERT INTO products (item_id, product_name, department_name, year, price, stock_quantity) VALUES ('${answer.sku}', '${answer.product}', '${answer.department}', '${answer.year}', '${answer.price}', '${answer.stock}');`,
      function(err,res) {
        if (err) throw err;
        console.log(`\nAdded ${answer.product} to the database`);
        connection.end();
      })
    });
  };

    // INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `year`, `price`, `stock_quantity`) VALUES ('10', 'Cup', 'Kitchen', '2018', '4', '200');

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