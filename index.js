var express = require('express')
var app = express()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

// setup app
const host = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8000;

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
  	mainpage: 1
  });
});

app.get('/newcomer', function (req, res) {
  res.render('newcomer', {
  	other_page: 1
  });
});

app.get('/blog', function (req, res) {
  res.render('blog', {
  	blog: 1
  });
});


app.use(express.static(__dirname + '/assets'));

// server start
const server = app.listen(port, host, function () {
  console.log(
    'Example app listening at http://%s:%s',
    server.address().address,
    server.address().port
  );
});