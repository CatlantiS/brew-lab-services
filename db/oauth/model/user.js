var db = require('./db.js');
var crypto = require('crypto');

module.exports.getId = function(user) {
	return user.id;
};

module.exports.fetchById = function(userId, cb) {
	cb.conn.connect(function(conn) {
		conn.findOne('select * from users.users where id = ' + userId, function(data, err) {
			if (err) {
				cb(err, null);
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
		var hash = crypto.createHash('SHA1');
		hash.update(password, 'UTF8');
		var hashedPassword = hash.digest('HEX');
		console.log('hashedPassword = ' + hashedPassword);
		(user.password == hashedPassword) ? cb(null, true) : cb(null, false);
	}
	else {
		cb(null, false);
	}
};

module.exports.fetchFromRequest = function(req) {
	return req.session.user;
};