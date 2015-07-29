'use strict';

var pg = require('pg');

var connectionString;

function connect(callback) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            done(client);

            if (callback)
                callback(err);

            return;
        }

        callback(new Database({ client: client, done: done }));
    });
}

function execute(connection, query, callback, single) {
    connection.client.query(query, function(err, result) {
        if(err) {
            connection.done(connection.client);

            if (callback)
                callback(err);

            return;
        }

        connection.done(); //dizzity.

        if (callback)
            callback(single ? result.rows[0] : result.rows);
    });
}

function Database(connection) {
    this.connection = connection;
}

Database.prototype.insert = function(query, callback) {
    execute(this.connection, query, callback);
};

Database.prototype.find = function(query, callback) {
    execute(this.connection, query, callback);
};

Database.prototype.findOne = function(query, callback) {
    execute(this.connection, query, callback, true);
};

Database.prototype.beginTransaction = function() {
    execute(this.connection, 'BEGIN;');
};

Database.prototype.commit = function() {
    execute(this.connection, 'COMMIT;');
};

Database.prototype.rollback = function() {
    execute(this.connection, 'ROLLBACK;');
};

module.exports = function(connString) {
    connectionString = connString;

    return {
        connect: connect
    };
};
