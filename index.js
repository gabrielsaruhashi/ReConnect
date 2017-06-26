var express = require('express')
var app = express()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const env = require('dotenv').config();

const validator = require('validator');
const nodemailer = require('nodemailer');


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
    
  });
});

app.get('/about', function (req, res) {
  res.render('about', {
    
  });
});

app.get('/supportus', function (req, res) {
  res.render('supportus', {
  });
});

app.get('/contact', function (req, res) {
  res.render('contact', {
  });
});

app.post('/contact', function (req, res) {
  var mailOpts, smtpTrans;
  //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
  smtpTrans = nodemailer.createTransport( {
      service: 'Gmail',
      auth: {
          user: "-",
          pass: "-" 
      }
  });
  //Mail options
  mailOpts = {
      from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
      to: 'gabriel.saruhashi@gmail.com',
      subject: 'Website contact form',
      text: req.body.message
  };
  console.log(req.body.message);
  console.log(req.body.name);
  console.log(req.body.email);
  smtpTrans.sendMail(mailOpts, function (error, response) {
      //Email not sent
      if (error) {
          res.render('contact', { title: 'Raging Flame Laboratory - Contact', msg: 'Error occured, message not sent.', err: true, page: 'contact' })
          console.log('Failure');
      }
      //Yay!! Email sent
      else {
          res.render('contact', { title: 'Raging Flame Laboratory - Contact', msg: 'Message sent! Thank you.', err: false, page: 'contact' })
          console.log("success");
      }
  });
});

app.use(express.static(__dirname + '/assets'));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
  console.log(`http://127.0.0.1:${process.env.PORT}`);
});