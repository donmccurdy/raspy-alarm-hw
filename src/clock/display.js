var _ = require('lodash'),
	five = require('johnny-five'),
	Raspi = require('raspi-io');

var DIGITS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F],
	DEFAULTS = { brightess: 50 };

/**
 * Display
 *
 * Hardware-based display for Raspberry Pi, using a HT16K33 
 * backpack controller.
 */
function Display () {
	this.board = new five.Board({io: new Raspi()});
	this.matrix = null;

	this.board.on('ready', function () {
		// Create HT16K33 controller.
    	this.matrix = new five.Led.Matrix({controller: 'HT16K33'});
    	this.matrix.brightness(DEFAULTS.brightness);

    	// Set time, if provided.
    	if (this.moment) this.set(this.moment);
	}.bind(this));

}

_.merge(Display.prototype, {

	set: function (moment) {
		var hours = moment.format('hh'),
			minutes = moment.format('mm');

		this.moment = moment;

		if (this.matrix) {
			// Display time. This is a hack because the LEDControl assumes
			// that all HT16K33 controllers are driving matrices.
			// See: https://github.com/rwaldron/johnny-five/issues/905
			this.matrix.displaybuffers[0][0] = DIGITS[hours[0]];
			this.matrix.displaybuffers[0][1] = DIGITS[hours[1]];
			this.matrix.displaybuffers[0][2] = 0xFFFF;
			this.matrix.displaybuffers[0][3] = DIGITS[minutes[0]];
			this.matrix.displaybuffers[0][4] = DIGITS[minutes[1]];

			// Flush buffers.
			this.matrix.writeDisplay(0);
		}

	},

	clear: function () {
		this.matrix.clear();
	}

});

module.exports = Display;
