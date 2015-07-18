'use strict';

var pg = require('pg');

var connectionString;

function Database(connString) {
    connectionString = connString;

    return {
        find: find
    };
}

function find(query, single, callback) {
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