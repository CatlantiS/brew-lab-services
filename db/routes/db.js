var express = require('express');
var router = express.Router();

var pg = require('pg');
//Would be nice to make this more configurable.
var connectionString = 'postgres://postgres:Brewlab1@blabdatadev01.cloudapp.net/BrewLabDB';

//Todo: look into using client pooling: https://www.npmjs.com/package/pg#client-pooling

router.get('/v1/users/:username', function(request, response) {
    var username = request.params.username,
        client = new pg.Client(connectionString);

    client.connect(function(err) {
        if (err)
            response.send(err);

        client.query('SELECT id, name FROM "Application"."User" WHERE name = \'' + username + '\';',
            function(err, result) {
                if(err)
                    response.send(err);

                response.send(result.rows[0]);

                client.end();
            });
    });
});

module.exports = router;