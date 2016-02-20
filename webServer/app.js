var express = require('express');

var app = express();
var bodyParser = require('body-parser')
var multer  = require('multer')
var upload = multer({ dest: 'storage/' })
var mysql = require('mysql');
var env = require('node-env-file');
var rest = require("./rest.js");
var hash = require('password-hash');
if(process.env.NODE_ENV != "Production") {
	env('.env');
}
var connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json()); 
var router = express.Router();
app.use('/api', router);
app.set('views', './views');
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000))
var rest_router = new rest(router,connection,hash);

app.get('/', function(req, res) {
	connection.query('SELECT * FROM User', function (error, results, fields) {
  	//console.log();
  	res.render('index', {
    	title: 'Home ' + results[0].UserName,
    	user: {
    		fullName: "tgay"
    	}
  });
});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});