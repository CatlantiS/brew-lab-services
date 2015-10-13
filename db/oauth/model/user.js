var db = require('./db.js');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

module.exports.getId = function(user) {
	return user.id;
};

module.exports.fetchById = function(userId, cb) {
	cb.conn.connect(function(conn) {
		conn.findOne('select * from users.users where id = ' + userId, function(data, err) {
			if (err) {
				cb(err, null);
			}
			else if (data === undefined) {
				return cb(null, null);
			}
			else {
				var user = {
					id: data.id,
					userName: data.username,
					firstName: data.firstname,
					lastName: data.lastname,
					password: data.password
				};
				return cb(null, user);
			}
		});
	});
};

module.exports.fetchByUsername = function(username, cb) {
	db.conn.connect(function(conn) {
		conn.findOne('select * from users.users where username = \'' + username + '\'', function(data, err) {
			if (err) {
				cb(err, null);
			}
			else if (data === undefined) {
				return cb(null, null);
			}
			else {
				var user = {
					id: data.id,
					userName: data.username,
					firstName: data.firstname,
					lastName: data.lastname,
					password: data.password
				};
				console.log (' got user = ');
				console.dir(user);
				return cb(null, user);
			}
		});
	});
};

module.exports.checkPassword = function(user, password, cb) {
	if (user) {
		bcrypt.compare(password, user.password, function(err, res) {
			(res == true) ? cb(null, true) : cb(null, false);
		});
	}
	else {
		cb(null, false);
	}
};

module.exports.fetchFromRequest = function(req) {
	return req.session.user;
};