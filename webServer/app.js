var express = require('express');

var app = express();
var bodyParser = require('body-parser')
var multer  = require('multer')
var upload = multer({ dest: 'storage/' })
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json()); 
app.set('views', './views');
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000))


app.get('/', function(req, res) {
  res.render('index', {
    title: 'Home Page'
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});