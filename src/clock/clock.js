var _ = require('lodash'),
	Display = require('./display'),
	CLIDisplay = require('./cli-display');

function Clock () {
	if (process.env.ENABLE_IO === 'true') {
		this.display = new Display();
	} else {
		this.display = new CLIDisplay();
	}
}

_.merge(Clock.prototype, {

	// TODO

});

module.exports = Clock;