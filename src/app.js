require('dotenv').load();

var fs = require('fs'),
	Clock = require('./clock/clock'),
	Alarm = require('./alarm'),
	sqlite3 = require('sqlite3'),
	db = new sqlite3.Database(process.env.DATABASE);

var alarms = [],
	clock = new Clock();

function load () {
	alarms.forEach(function (alarm) { alarm.disable(); });

	db.all('SELECT * FROM alarms', function (error, rows) {
		if (error) throw error;
		alarms = rows.map(function (row) {
			row.days = JSON.parse(row.days);
			var alarm = new Alarm(row);
			return alarm.enable();
		});
	});
}

fs.watch(process.env.DATABASE, load);
load();
