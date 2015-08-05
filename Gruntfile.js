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
	grunt.registerTask('provision', function () {
		var done = this.async();
		var db = new sqlite3.Database(DATABASE);
		db.serialize(function () {
			db.run('DROP TABLE IF EXISTS alarms');

			db.run(''
				+ 'CREATE TABLE alarms ('
				+	'id INTEGER PRIMARY KEY, '
				+	'hours INTEGER, '
				+	'minutes INTEGER, '
				+	'days TEXT'
				+ ')',
				function (error) {
					if(error) {
						console.log(error);
						console.log(chalk.red('Failed to create table.'));
						console.log(chalk.bgRed('Provisioning failed.'));
						done();
					} else {
						console.log(chalk.dim('Created table.'));
					}
				}
			);

			db.run(
				'INSERT INTO alarms VALUES (1, 8, 0, "[0,1,2,3,4,5,6]")',
				function (error) {
					if (error) {
						console.log(chalk.red('Failed to insert initial alarm'));
						console.log(chalk.bgRed('Provisioning failed.'));
					} else {
						console.log(chalk.dim('Created initial alarm.'));
						console.log('\n' + chalk.bgGreen('Database provisioned.') + ' 🍺');
					}
					done();
				}
			);
		});
		db.close();
	});

};
