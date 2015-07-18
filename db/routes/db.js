var express = require('express');
var router = express.Router();

//Todo: make conn string more configurable.
var connectionString = 'postgres://postgres:Brewlab1@blabdatadev01.cloudapp.net/BrewLabDB';
var database = require('../core/database').Database(connectionString);

//Todo: brush up on proper REST route conventions.
router.get('/v1/users/:userId/recipes/', function(request, response) {
    var userId = request.params.userId;

    var query = 'SELECT * FROM "Recipes"."Recipe" WHERE userId = \'' + userId + '\';';

    database.find(query, false, function(data) {
        response.send(data);
    });
});

router.get('/v1/users/:userId', function(request, response) {
    var userId = request.params.userId;

    var query = 'SELECT id, name FROM "Application"."User" WHERE id = \'' + userId + '\';';

    database.find(query, true, function(data) {
        response.send(data);
    });
});

module.exports = router;