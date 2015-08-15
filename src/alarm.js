var _ = require('lodash'),
	Eventify = require('eventify'),
	Audio = require('./audio'),
	moment = require('moment');

var FIRE_DELAY = 6000;

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

	this.audio = new Audio();
	this.isFiring = true;
	this.timerID = 0;
	this.pauseID = 0;

	Eventify.enable(this);
	this.on('fire', this.fire.bind(this));
	this.audio.on('stop', this.delayedFire.bind(this));
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

	/**
	 * Wakey wakey.
	 */
	fire: function () {
		this.isFiring = true;
		this.audio.play();
		return this;
	},

	/**
	 * Pause briefly between audio loops, then fire.
	 */
	delayedFire: function () {
		if (this.isFiring) {
			this.pauseID = setTimeout(this.fire.bind(this), FIRE_DELAY);
		}
	},

	/**
	 * Disables the current alarm (if active) and
	 * rearms for the next appropriate day.
	 */
	reset: function () {
		this.isFiring = false;
		this.audio.stop();
		if (this.pauseID) {
			clearTimeout(this.pauseID);
			this.pauseID = 0;
		}
		this.enable();
		return this;
	}

});

module.exports = Alarm;
