	var connectionString = 'postgres://postgres:samcool@localhost/brewlabdb';
	module.exports.conn = require('../../core/database')(connectionString);
	module.exports.queries = require('../../helpers/queries');

