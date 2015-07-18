var express = require('express');
var router = express.Router();

var pg = require('pg');
//Would be nice to make this more configurable.
var connectionString = 'postgres://postgres:Brewlab1@blabdatadev01.cloudapp.net/BrewLabDB';

router.get('/v1/users/:username', function(request, response) {
    var username = request.params.username;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            done(client);

            response.send(err);
        }

        client.query('SELECT id, name FROM "Application"."User" WHERE name = \'' + username + '\';',
            function(err, result) {
                if(err) {
                    done(client);

                    response.send(err);
                }

                response.send(result.rows[0]);

                done(); //dizzity.
            });
    });
});

module.exports = router;