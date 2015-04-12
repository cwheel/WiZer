var Passport = require('passport');
var Report = require('./models/report');
var Device = require('./models/device');

module.exports = function(app) {
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
		var nets = JSON.parse(req.body.networks);
		for (var i = 0; i < nets.length; i++) {
			var newReport = new Report({BSSID : nets[i].BSSID, SSID : nets[i].SSID, frequency : nets[i].frequency, channel : nets[i].channel, quality : nets[i].quality, signal : nets[i].signal, time : nets[i].time, encrypted : nets[i].encrypted, securityType : nets[i].securityType, cypher : nets[i].cypher});
			newReport.save();
		}

		console.log("Recieved a network report from node: " + req.body.nodeName + " with " + nets.length + " networks!");

		res.send({ reportStatus: 'accepted' });
		/*if (keyIsValid(req.body.key)) {
			

			res.send({ reportStatus: 'accepted' });
		} else {
			res.send({ reportStatus: 'denied' });	
		}*/
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

	//Ensure that the key from the device is valid
	function keyIsValid(deviceKey) {
		if (deviceKey == null) {
			return false;
		}

		Device.findOne({ key : deviceKey }, function (err, device) {
		    if (!device) {
		    	return false;
		    } else {
		    	return true;
		    }
		});
	}
};