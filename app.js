var express = require('express');
var cfenv = require('cfenv');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var session = require('express-session');
var Passport = require('passport');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var RecentReport = require('./models/recentreport');

var options = {
  user: '4d980289-5340-4dd1-9837-895cbed44ac8',
  pass: 'd3855fae-8af4-4165-b156-ac51582026cf'
}

mongoose.connect('mongodb://192.155.243.54/wizen', options);
RecentReport.remove({}, function (err) {})

app.use(bodyParser.urlencoded({
  extended: true
}));


/* Add a test user to Mongo

var User = require('./models/user');
var bcrypt = require('bcrypt');
var test = new  User({username: "test", password : bcrypt.hashSync("test", 10), name  : "Test User"});
test.save();
*/

app.use(cookieParser());
app.use(session({
	secret: 'testsecret', 
	saveUninitialized: true, 
	resave: true
}));

app.use(Passport.initialize());
app.use(Passport.session());

app.use(express.static(__dirname + '/public'));

require('./auth')();
require('./routes')(app, io);

var appEnv = cfenv.getAppEnv();
http.listen(appEnv.port, appEnv.bind, function() {
  console.log("server starting on " + appEnv.url);
});