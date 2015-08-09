var Alarm = require('./alarm'),
	Player = require('play-sound'),
	sqlite3 = require('sqlite3');

require('dotenv').load();

var db = new sqlite3.Database(process.env.DATABASE),
	player = new Player({});

db.each('SELECT * FROM alarms', function (error, row) {
	if (error) throw error;

	row.days = JSON.parse(row.days);

	var alarm = new Alarm(row);
	alarm.on('fire', function () {
		player.play('./alarm.mp3');
	});
	alarm.enable();
});
