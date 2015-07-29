'use strict';

var pg = require('pg');

var connectionString;

function connect(callback) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            done(client);

            if (callback)
                callback(null, err);

            return;
        }

        callback(new Database({ client: client, done: done }));
    });
}

function execute(connection, query, callback, single) {
    connection.client.query(query, function(err, result) {
        if (err) {
            connection.done(connection.client);

            if (callback)
                callback(null, err);

            return;
        }

        connection.done(); //dizzity.

        if (callback)
            callback(single ? result.rows[0] : result.rows);
    });
}

function Database(connection) {
    //Lazily doing this to mark as private rather than use closures.  Can change this.
    this._connection = connection;
}

Database.prototype.insert = function(query, callback) {
    execute(this._connection, query, callback);
};

Database.prototype.find = function(query, callback) {
    execute(this._connection, query, callback);
};

Database.prototype.findOne = function(query, callback) {
    execute(this._connection, query, callback, true);
};

Database.prototype.beginTransaction = function() {
    execute(this._connection, 'BEGIN;');
};

Database.prototype.commit = function() {
    execute(this._connection, 'COMMIT;');
};

Database.prototype.rollback = function() {
    execute(this._connection, 'ROLLBACK;');
};

module.exports = function(connString) {
    connectionString = connString;

    return {
        connect: connect
    };
};
