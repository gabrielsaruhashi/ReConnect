var express = require('express')
var app = express()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const mongoose = require('mongoose');
const env = require('dotenv').config();

const validator = require('validator');

mongoose.connect(process.env.MONGO_URL);


const Mailist = require('./models/mailist.js');
const Admin = require('./models/admin.js');


// Configure our app
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'sessions',
});
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: true,
})); // for parsing application/x-www-form-urlencoded
// Configure session middleware that will parse the cookies
// of an incoming request to see if there is a session for this cookie.
// respond with "hello world" when a GET request is made to the homepage

app.get('/', function (req, res) {
  res.render('index', {
  	mainpage: true
  });
});

app.post('/', (req, res) => {

  const email = req.body.email;
  console.log(email);

  if(!req.body.email || req.body.email.length === 0 || 
    req.body.email.length > 50 ) {

    res.locals.errors = ["Error Registering You"];
  }


  if (!validator.isEmail(email)) {
    res.locals.errors = ["Check your email"];
  }


  var newEmail = new Mailist();
  newEmail.email = req.body.email;

  console.log("Tá indo");
  newEmail.save(function(err, user){
    
    if(err || !user) {
      console.log("Erro no Save");
      res.render('index', { errors: 'Error saving task to the database.'} );
    } else {
      console.log("Sucesso");
      res.redirect('/');
    }
  });
});

app.get('/newcomer', function (req, res) {
  res.render('newcomer'); 
});

app.get('/hostfriend', function (req, res) {
  res.render('hostfriend'); 
});

app.get('/blog', function (req, res) {
  res.render('blog', {
  	blog: true
  });
});

app.get('/admin', function (req, res) {
  res.render('blog', {
    admin: true
  });
});

app.get('/donate', function (req, res) {
  res.render('donate', {
    shop: true
  });
});


app.use(express.static(__dirname + '/assets'));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});