var RecentReport = require('./models/recentreport');

module.exports = function(io) {
	io.on('connection', function(socket){
  		RecentReport.find({}, function(err, reports) {
  			var allReports = [];

  			reports.forEach(function(report) {
     				allReports.push(report);
     			});

  			io.emit('networksUpdate', allReports);
  		});

		socket.on('disconnect', function() {});
	});
};