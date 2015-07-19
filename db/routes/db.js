var express = require('express');
var router = express.Router();

//Todo: make conn string more configurable.
var connectionString = 'postgres://postgres:Brewlab1@blabdatadev01.cloudapp.net/BrewLabDB';
var database = require('../core/database').Database(connectionString);
var queries = require('../helpers/queries');

//Todo: brush up on proper REST route conventions.
router.get('/v1/users/:userId/recipes/', function(request, response) {
    var userId = request.params.userId;

    var query = queries.selectRecipesByUserId(userId);

    database.find(query, function(data) {
        response.send(data);
    });
});

router.get('/v1/users/:userId', function(request, response) {
    var userId = request.params.userId;

    var query = queries.selectUserById(userId);

    database.findOne(query, function(data) {
        response.send(data);
    });
});

router.post('/v1/recipes/', function(request, response) {
    var recipes = request.body;

    (Array.isArray(recipes) ? recipes : [recipes]).forEach(function(recipe) {
        var query = queries.insertRecipe(recipe);

        database.insert(query, function(data) {
            response.send(data);
        });
    });

});

module.exports = router;