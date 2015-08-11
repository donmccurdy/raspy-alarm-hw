var _ = require('lodash'),
	Eventify = require('eventify'),
	Player = require('play-sound'),
	moment = require('moment');

var audio = new Player({});

/**
 * Instance of a single-use or recurring alarm.
 *
 * @param {array<int>} days 	Array of zero-indexed integers.
 * @param {int} hours			Hours.
 * @param {int} minutes			Minutes.
 */
function Alarm (options) {
	this.id = options.id;
	this.days = options.days;
	this.hours = options.hours;
	this.minutes = options.minutes;
	this.timerID = 0;

	Eventify.enable(this);
	this.on('fire', this.fire.bind(this));
}

_.merge(Alarm.prototype, {

	/**
	 * Returns the next moment the alarm should fire.
	 * @return {Moment}
	 */
	next: function () {
		var currentDate = moment();
		var dates = this.days.map(function (day) {
			var date = moment()
				.day(day)
				.hours(this.hours)
				.minutes(this.minutes)
				.seconds(0);
			return date.isAfter(currentDate) ? date : date.day(day + 7);
		}.bind(this));
		return moment.min.apply(moment, dates);
	},

	/**
	 * Enables the alarm.
	 */
	enable: function () {
		var next = this.next();
		var interval = moment.duration(next.diff(moment()));
		if (interval.asMilliseconds() < 0) {
			throw 'Cannot set alarm for negative duration.';
		}

		this.timerID = setTimeout(function () {
			this.timerID = 0;
			this.trigger('fire');
		}.bind(this), interval.asMilliseconds());

		console.log('Alarm SET for %s.', next.calendar().toLowerCase());
		return this;
	},

	/**
	 * Disables the alarm.
	 */
	disable: function () {
		if (this.timerID) {
			clearTimeout(this.timerID);
			this.timerID = 0;
			console.log(
				'Alarm DISABLED for %s.',
				this.next().calendar().toLowerCase()
			);
		}
		return this;
	},

	fire: function () {
		audio.play('./alarm.mp3');
		this.enable();
		return this;
	},

	/**
	 * Disables the current alarm (if active) and
	 * rearms for the next appropriate day.
	 */
	reset: function () {
		throw 'Not implemented.';
	}

});

module.exports = Alarm;
