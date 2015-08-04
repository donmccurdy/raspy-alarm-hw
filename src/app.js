var Alarm = require('./alarm'),
	Player = require('play-sound');

var ALARM_AUDIO = './alarm.mp3';
var ALARM_TIMES = [
	{id: 1, hours: 23, minutes: 55, days: [0,1,2,3,4,5,6]},
	{id: 2, hours: 23, minutes: 56, days: [0,1,2,3,4,5,6]}
];


var player = new Player({});

ALARM_TIMES.forEach(function (options) {
	var alarm = new Alarm(options);
	alarm.on('fire', function () {
		player.play(ALARM_AUDIO);
	});
	alarm.enable();
});
