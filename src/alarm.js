var Eventify = require('eventify');

function Alarm (hours, minutes) {
	this.hours = +hours;
	this.minutes = +minutes;
	this.timerID = 0;
	Eventify.enable(this);
}

Alarm.prototype.interval = function () {
	var date = new Date();
	var minutesMS = (date.getMinutes() - this.minutes) * 60 * 1000;
	var hoursMS = (date.getHours() - this.hours) * 60 * 60 * 1000;
	return hoursMS + minutesMS;
};

Alarm.prototype.enable = function () {
	this.timerID = setTimeout(function () {
		this.trigger('fire');
		this.timerID = 0;
	}.bind(this), this.interval());
};

Alarm.prototype.disable = function () {
	if (this.timerID) {
		clearTimeout(this.timerID);
	}
};

module.exports = Alarm;
