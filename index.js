var express = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('safe_entry_db', 'root');

var PORT = process.env.NODE_ENV || 3000;

var app = express();

var Entry = sequelize.define('Entry',{
  userName:{
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: true,
      len:{
        args:[10]
      }
    }
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [5, 500],
        check: function(messageVal){
          if(messageVal.length < 5) {
            throw new Error("Please Add More");
          }
          else if (messageVal.length > 500){
              throw new Error("Please Remove Some Text");
          }
        }
      }
    }
  }
});

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', function(req, res) {
  res.render('home');
})

app.post('/', function(req, res){
  Entry.create(req.body).then(function(entries){
    res.render('home',{ 
      entries: entries
    });
  });
});

sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("LISTNEING!");
  });
});