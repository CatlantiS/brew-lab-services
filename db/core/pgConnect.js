'use strict';

var pg = require('pg');

function PgConnect(connectionString) { this.connectionString = connectionString; return this; }

PgConnect.prototype.connect = function(callback) {
    pg.connect(this.connectionString, function(err, client, done) {
        if (err) {
            done(client);

            if (callback)
                callback(null, err);

            return;
        }

        callback(new Database({ client: client, done: done }));
    });
};

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

function Database(connection) { this.connection = connection; return this; }

Database.prototype.insert = function(query, callback) {
    execute(this.connection, query, callback, true); return this;
};

Database.prototype.find = function(query, callback) {
    execute(this.connection, query, callback); return this;
};

Database.prototype.findOne = function(query, callback) {
    execute(this.connection, query, callback, true); return this;
};

Database.prototype.execute = function(query, callback) {
    execute(this.connection, query, callback); return this;
};

Database.prototype.executeOne = function(query, callback) {
    execute(this.connection, query, callback, true); return this;
};

Database.prototype.beginTransaction = function() {
    execute(this.connection, 'BEGIN;'); return this;
};

Database.prototype.commit = function() {
    execute(this.connection, 'COMMIT;'); return this;
};

Database.prototype.rollback = function() {
    execute(this.connection, 'ROLLBACK;'); return this;
};

module.exports = function(connectionString) {
    return new PgConnect(connectionString);
};