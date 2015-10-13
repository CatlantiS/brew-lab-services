	var connectionString = 'postgres://postgres:samcool@shaycraft.cloudapp.net/brewlabdb';
	module.exports.conn = require('../../core/pgConnect')(connectionString);
	module.exports.queries = require('../../helpers/queries');

