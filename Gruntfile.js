var sqlite3 = require('sqlite3'),
	chalk = require('chalk');

module.exports = function (grunt) {

	var DATABASE = '../data/alarms.sqlite3';

	grunt.initConfig({
		nodemon: {
			dev: {
				script: 'src/app.js',
				options: {
					nodeArgs: ['--harmony'],
					env: {DATABASE: DATABASE},
					watch: ['src'],
					ignore: [
						'node_modules/**',
						'bower_components/**'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-nodemon');

	/**
	 * Launch the hardware controller.
	 */
	grunt.registerTask('default', ['nodemon']);

	/**
	 * Provision a new SQLite3 database.
	 */
	grunt.registerTask('provision', 'initialize the db', function () {
		var db = new sqlite3.Database(DATABASE);
		db.serialize(function () {
			console.log(chalk.dim('Creating database...'));
			db.run(''
				+ 'CREATE TABLE alarms ('
				+	'id PRIMARY KEY, '
				+	'hours INTEGER, '
				+	'minutes INTEGER, '
				+	'days TEXT '
				+ ')');
			console.log(chalk.dim('Inserting initial alarm...'));
			db.run('INSERT INTO alarms VALUES (1, 8, 0, "[0,1,2,3,4,5,6]")');
			db.close();
			console.log(chalk.bgGreen('Database provisioned.'));
		});
	});

};
