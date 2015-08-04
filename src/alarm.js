var _ = require('lodash'),
	Eventify = require('eventify'),
	moment = require('moment');

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
}

_.merge(Alarm.prototype, {

	/**
	 * Returns the interval until the next occurrence of the alarm.
	 * @return {int}
	 */
	interval: function () {
		var currentDate = moment();
		var dates = this.days.map(function (day) {
			var date = moment()
				.day(day)
				.hours(this.hours)
				.minutes(this.minutes);
			return date.isAfter(currentDate) ? date : date.day(day + 7);
		}.bind(this));
		return moment.duration(
			moment().diff(moment.min.apply(moment, dates))
		);
	},

	/**
	 * Enables the alarm.
	 */
	enable: function () {
		var interval = this.interval();

		if (interval.milliseconds() < 0) return;

		this.timerID = setTimeout(function () {
			this.trigger('fire');
			this.timerID = 0;
		}.bind(this), interval.milliseconds());

		console.log(
			'alarm set for %s (%d) from now',
			interval.humanize(),
			interval.milliseconds()
		);
	},

	/**
	 * Disables the alarm.
	 */
	disable: function () {
		if (this.timerID) {
			clearTimeout(this.timerID);
		}
	}

});

module.exports = Alarm;
