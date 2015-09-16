var _ = require('lodash'),
	moment = require('moment');

var INTERVAL = 5000;

/**
 * Clock
 *
 * Responsible for keeping track of the current time and updating
 * a display (hardware or CLI) appropriately.
 */
function Clock () {
	// Load hardware display if available, otherwise use stdout.
	if (process.env.ENABLE_IO === 'true') {
		var Display = require('./display');
		this.display = new Display();
	} else {
		var CLIDisplay = require('./cli-display');
		this.display = new CLIDisplay();
	}

	// Start ticking.
	this.start();
}

_.merge(Clock.prototype, {

	start: function () {
		this.tick();
		this.timerID = setInterval(this.tick.bind(this), INTERVAL);
	},

	stop:  function () {
		this.clearTimeout(this.timerID);
	},

	tick: function () {
		this.display.set(moment());
	},

	setDisplay: function (display) {
		this.display = display;
	}

});

module.exports = Clock;