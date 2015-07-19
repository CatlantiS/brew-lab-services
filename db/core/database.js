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
    execute(query, true, callback);
}

function find(query, callback) {
    execute(query, false, callback);
}

function findOne(query, callback) {
    execute(query, true, callback);
}

function execute(query, single, callback) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            done(client);

            callback(err);
        }

        client.query(query, function(err, result) {
            if(err) {
                done(client);

                callback(err);
            }

            callback(single ? result.rows[0] : result.rows);

            done(); //dizzity.
        });
    });
}

module.exports = {
    Database: Database
};