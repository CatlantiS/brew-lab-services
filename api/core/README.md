# PgConnection

A wrapper for the [pg](https://github.com/brianc/node-postgres) library that supports transactions and uses promises.

## Basic usage

    pgConnection.connect(function(db) {
        var select = "SELECT * FROM myTable";

        db.find(select).then(function(data) {
            response.send(data);
        }, function(err) { throw err; );
    });
