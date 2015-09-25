var _ = require('lodash'),
	five = require('johnny-five'),
	Raspi = require('raspi-io');

/**
 * Display
 *
 * Hardware-based display for Raspberry Pi, using a HT16K33 
 * backpack controller.
 */
function Display () {
	this.board = new five.Board({io: new Raspi()});
	this.led = null;

	this.board.on('ready', function () {
		// Create HT16K33 controller.
		this.led = new five.Led.Digits({controller: 'HT16K33', digits: 5});
		// Set time, if provided.
		if (this.moment) this.set(this.moment);
	}.bind(this));
}

_.merge(Display.prototype, {

	set: function (moment) {
		this.moment = moment;
		if (this.led) {
			this.led.print(moment.format('hh:mm'));
		}
	},

	clear: function () {
		this.led.clear();
	}

});

module.exports = Display;
