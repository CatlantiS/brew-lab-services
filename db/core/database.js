'use strict';

var pg = require('pg');
//Can we just add our own transaction wrapping rather than depending on another third party module?
var Transaction = require('pg-transaction');

var connectionString;

function Database(connString) {
    connectionString = connString;

    return {
        insert: insert,
        find: find,
        findOne: findOne,
        transaction: transaction
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

//Todo: get rid of this pile of effluence.  Need something that gives caller more control over results for each individual query.
function transaction(queries, callback) {
    if (!Array.isArray(queries))
        //Elegant as...
        callback('Transaction requires queries array.');

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            done(client);
            callback(err);

            return;
        }

        var results = [];

        var transaction = new Transaction(client);
        transaction.begin();

        for (var i = 0; i < queries.length; i++) {
            var query = queries[i];

            transaction.query(query, function(err, result) {
                if (err) {
                    transaction.abort();
                    done(client);
                    callback(err);

                    return;
                }

                results.push(result);
            });
        }

        transaction.commit();

        done();
        //Feels like a bad idea returning an array of all results.
        callback(results);
    });
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

module.exports = {
    Database: Database
};