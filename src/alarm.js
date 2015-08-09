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
			this.trigger('fire');
			this.timerID = 0;
		}.bind(this), interval.asMilliseconds());

		console.log('Alarm set for %s.', next.calendar().toLowerCase());
	},

	/**
	 * Disables the alarm.
	 */
	disable: function () {
		if (this.timerID) {
			clearTimeout(this.timerID);
			this.timerID = 0;
		}
	}

});

module.exports = Alarm;
