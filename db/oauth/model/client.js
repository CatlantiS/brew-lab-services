var db = require('./db.js');

module.exports.fetchById = function(clientId, cb) {
    db.conn.connect(function(conn) {
        conn.findOne('select * from users.clients where id = ' + clientId, function(data, err) {
            if (err) {
                cb(err, null);
            }
            else {
                var client = {
                    clientId: data.id,
                    name: data.name,
                    secret: data.secret
                };
                return cb(null, client);
            }
        });
    });
};

module.exports.getId = function(client) {
    return client.id;
}

module.exports.checkSecret = function(client, secret, cb) {
    return cb(null, client.secret == secret);
}