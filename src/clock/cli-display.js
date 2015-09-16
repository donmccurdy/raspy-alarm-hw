var _ = require('lodash'),
	chalk = require('chalk');


/**
 * CLIDisplay
 *
 * CLI-based display for debugging on machines without IO.
 */
function CLIDisplay () {}

_.merge(CLIDisplay.prototype, {

	set: function (moment) {
		console.log(chalk.green( moment.calendar() ));
	},

	clear: function () {}

});

module.exports = CLIDisplay;
