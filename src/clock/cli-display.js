var _ = require('lodash'),
	chalk = require('chalk');



function CLIDisplay () {}

_.merge(CLIDisplay.prototype, {

	set: function (moment) {
		console.log(chalk.green( moment.calendar() ));
	},

	clear: function () {}

});

module.exports = CLIDisplay;
