'use strict';

var pg = require('pg');

var connectionString;

function Database(connString) {
    connectionString = connString;

    return {
        find: find,
        findOne: findOne
    };
}

function find(query, callback) {
    _find(query, true, callback);
}

function findOne(query, callback) {
    _find(query, true, callback);
}

function _find(query, single, callback) {
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