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

mongoose.connect('mongodb://localhost/wizen');
app.use(bodyParser.urlencoded({
  extended: true
}));

/*
var User = require('./models/device');
var bcrypt = require('bcrypt');
var test1 = new User({key: "10af6925f0f94b400ddb3183569d958532232e2732de0a5bb4cc64de1e62", name : "WiZer-n1 (Edison)"});
var test2 = new User({key: "ed054f15f0c6482eb8eb673fac9b17b91972f5d95b176c1f811419f36107", name : "WiZer-n2 (Rasberry Pi)"});
test1.save();
test2.save();
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
http.listen(appEnv.port, function() {
  console.log("server starting on " + appEnv.url);
});