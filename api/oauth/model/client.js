var db = require('./db.js');

module.exports.fetchById = function(clientId, cb) {
    db.conn.connect(function(conn) {
        conn.findOne('select * from users.clients where id = ' + clientId).then(function(data) {
            var client = {
                clientId: data.id,
                name: data.name,
                secret: data.secret
            };
            return cb(null, client);
        }, function(err) { cb(err, null); });
    });
};

module.exports.getId = function(client) {
    return client.id;
}

module.exports.checkSecret = function(client, secret, cb) {
    return cb(null, client.secret == secret);
}