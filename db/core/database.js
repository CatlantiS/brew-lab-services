'use strict';

var pg = require('pg');

var connectionString;

function Database(connString) {
    connectionString = connString;

    return {
        insert: insert,
        find: find,
        findOne: findOne
    };
}

function insert(query, callback) {
    execute(query, callback);
}

function find(query, callback) {
    execute(query, callback);
}

function findOne(query, callback) {
    execute(query, callback, true);
}

function execute(query, callback, single) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            done(client);

            if (callback)
                callback(err);

            return;
        }

        client.query(query, function(err, result) {
            if(err) {
                done(client);

                if (callback)
                    callback(err);

                return;
            }

            done(); //dizzity.

            if (callback)
                callback(single ? result.rows[0] : result.rows);
        });
    });
}

module.exports = Database;