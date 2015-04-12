var Passport = require('passport');
var Report = require('./models/report');
var RecentReport = require('./models/recentreport');
var Device = require('./models/device');
var Alert = require('./models/alert');
var User = require('./models/user');
var Crypto = require('crypto');
var shasum = Crypto.createHash('sha1');

module.exports = function(app,io) {
	var recentReports = 0;

	function requireAuth(req, res, next) {
		if (req.isAuthenticated()) {
	    	return next();
		}

	  	res.redirect('/');
	}

	//Handle login attempts
	app.post('/login', Passport.authenticate('local', { successRedirect: '/login/success', failureRedirect: '/login/failure', failureFlash: false }));
	app.get('/login/success', function(req, res){res.send({ loginStatus: 'success' });});
	app.get('/login/failure', function(req, res){res.send({ loginStatus: 'failure' });});
	app.get('/authed', function(req, res) {
		if (req.isAuthenticated()) {
			res.send({ loginStatus: 'valid' });
		} else {
			res.send({ loginStatus: 'invalid' });	
		}
	});

	//Logout
	app.get('/logout', requireAuth, function(req, res){
		req.logout();
		res.redirect("/");
   	});

	//Return the current users info
	app.get('/user/currentInfo', requireAuth, function(req, res) {
		res.send({ name: req.user.name });
	});

	//List all users
	app.get('/user/all', requireAuth, function(req, res) {
		User.find({}, function(err, users) {
			var allUsers = [];

			users.forEach(function(user) {
   				allUsers.push(user);
   			});

			res.send(allUsers);
		});
	});

	//Handle incoming node data
	app.post('/node/report', function(req, res) {
		Device.findOne({ key : req.body.key }, function (err, device) {
		    if (device == null) {
		    	console.log("Unautherized device with key: " + req.body.key + " was denied");
				res.send({ reportStatus: 'denied' });
		    } else {
		    	var nets = JSON.parse(req.body.networks);

		    	Device.count({}, function(err, count) {
		    	    if (recentReports == count) {
		    	    	console.log("Removing recent reports");
		    	    	recentReports = 0;
		    	    	RecentReport.remove({}, function (err) {});
		    	   	}

		    	   	recentReports++;

		    	   	for (var i = 0; i < nets.length; i++) {
		    	   		var newReport = new Report({BSSID : nets[i].BSSID, SSID : nets[i].SSID, frequency : nets[i].frequency, channel : nets[i].channel, quality : nets[i].quality, signal : nets[i].signal, time : nets[i].time, encrypted : nets[i].encrypted, securityType : nets[i].securityType, cypher : nets[i].cypher});
		    	   		newReport.save();

		    	   		var newrReport = new RecentReport({BSSID : nets[i].BSSID, SSID : nets[i].SSID, frequency : nets[i].frequency, channel : nets[i].channel, quality : nets[i].quality, signal : nets[i].signal, encrypted : nets[i].encrypted, securityType : nets[i].securityType, cypher : nets[i].cypher});
		    	   		newrReport.save();
		    	   	}

		    	   	console.log("Recieved a network report from node: " + device.name + " with " + nets.length + " networks!");
		    	   	
		    	});

				Alert.find({}, function(err, users) {
					users.forEach(function(alert) {
						for (net in nets) {
							if (net.SSID == alert.SSID) {
								if (alert.trigger == "0") {

								} else if (alert.trigger == "1") {
									if (Math.abs(parseInt(net.signal)) < Math.abs(parseInt(alert.gain))) {

									}
								} else if (alert.trigger == "2") {
									if (Math.abs(parseInt(net.signal)) > Math.abs(parseInt(alert.gain))) {
										
									}
								}
							}
						}
		   			});

		   			res.send({ reportStatus: 'accepted' });
				});
		    }
		});
	});

	//Show all recent reports
	app.get('/node/recentReports', requireAuth, function(req, res) {
		RecentReport.find({}, function(err, reports) {
			var allReports = [];

			reports.forEach(function(report) {
   				allReports.push(report);
   			});

			res.send(allReports);
		});
	});

	//Register a device
	app.post('/node/register', requireAuth, function(req, res) {
		var newDevice = new Device(req.body);
		newDevice.save();

		res.send({ reportStatus: 'accepted' });
	});

	//Delete a device
	app.post('/node/delete', requireAuth, function(req, res) {
		Device.remove({key : req.body.key}, function (err, device) {
			res.send({ reportStatus: 'accepted' });
		});		
	});

	//Count devices
	app.get('/node/count', requireAuth, function(req, res) {
		Device.count({}, function(err, count) {
			res.send({count : count});
		});		
	});

	//Generate a key
	app.get('/manage/genKey', requireAuth, function(req, res){
		res.send({ 'key' : Crypto.randomBytes(16).toString('hex')});
   	});

   	//List all devices
   	app.get('/node/all', requireAuth, function(req, res) {
		Device.find({}, function(err, users) {
			var devices = [];

			users.forEach(function(user) {
   				devices.push(user);
   			});

			res.send(devices);
		});
	});

	//List all alerts
   	app.get('/alert/all', requireAuth, function(req, res) {
		Alert.find({}, function(err, users) {
			var devices = [];

			users.forEach(function(user) {
   				devices.push(user);
   			});

			res.send(devices);
		});
	});

	//Register an alert
	app.post('/alert/register', requireAuth, function(req, res) {
		var newDevice = new Alert(req.body);
		newDevice.save();

		res.send({ alert: 'accepted' });
	});

	//Delete an alert
	app.post('/alert/delete', requireAuth, function(req, res) {
		Alert.remove(req.body, function (err, device) {
			res.send({ alert: 'accepted' });
		});		
	});

	app.get('*', function(req, res){
		res.redirect('/');
	});
};