'use strict';

var pg = require('pg');
var defer = require('node-promise').defer;

function PgConnection(connectionString) { this.connectionString = connectionString; }

PgConnection.prototype.connect = function(callback) {
    pg.connect(this.connectionString, function(err, client, done) {
        if (err) {
            done(client);

            if (callback) callback(null, err);

            return;
        }

        callback(new Database({ client: client, done: done }));
    });
};

function execute(connection, query, single) {
    var deferred = defer();

    connection.client.query(query, function(err, result) {
        if (err) {
            connection.done(connection.client);

            deferred.reject(err);

            return;
        }

        connection.done(); //dizzity.

        deferred.resolve(single ? result.rows[0] : result.rows);
    });

    return deferred.promise;
}

function Database(connection) { this.connection = connection; }

Database.prototype.insert = function(query) {
    return execute(this.connection, query, true);
};

Database.prototype.find = function(query) {
    return execute(this.connection, query);
};

Database.prototype.findOne = function(query) {
    return execute(this.connection, query, true);
};

Database.prototype.execute = function(query) {
    return execute(this.connection, query);
};

Database.prototype.executeOne = function(query) {
    return execute(this.connection, query, true);
};

Database.prototype.beginTransaction = function() {
    return execute(this.connection, 'BEGIN;');
};

Database.prototype.commit = function() {
    return execute(this.connection, 'COMMIT;');
};

Database.prototype.rollback = function() {
    return execute(this.connection, 'ROLLBACK;');
};

module.exports = function(connectionString) {
    return new PgConnection(connectionString);
};