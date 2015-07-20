var express = require('express');
var router = express.Router();

//Todo: make conn string more configurable.
var connectionString = 'postgres://postgres:Brewlab1@blabdatadev01.cloudapp.net/BrewLabDB';
var Database = require('../core/database');
var database = Database(connectionString);
var queries = require('../helpers/queries');

//Todo: brush up on proper REST route conventions.
router.get('/v1/users/:userId/recipes/', function(request, response) {
    var userId = request.params.userId;

    var select = queries.selectRecipesByUserId(userId);

    database.find(select, function(data) {
        response.send(data);
    });
});

router.get('/v1/users/:userId', function(request, response) {
    var userId = request.params.userId;

    var select = queries.selectUserById(userId);

    database.findOne(select, function(data) {
        response.send(data);
    });
});

router.post('/v1/recipes/', function(request, response) {
    var recipes = request.body;

    (Array.isArray(recipes) ? recipes : [recipes]).forEach(function(recipe) {
        var insert = queries.insertRecipe(recipe);

        database.insert(insert, function(data) {
            response.send(data);
        });
    });

});

router.route('/v1/recipes/:recipeId')
    .get(function(request, response) {
        var recipeId = request.params.recipeId;

        var select = queries.selectRecipeById(recipeId);

        database.findOne(select, function(data) {
            response.send(data);
        });
    })
    .put(function(request, response) {
        var recipeId = request.params.recipeId;
        var recipe = request.body;

        var transaction = [
            queries.insertRecipe(recipe),
            queries.versionRecipe(recipeId, new Date())
        ];

        database.transaction(transaction, function(data) {
            //Should we check how big results are before sending?
            response.send(data);
        });
    });

module.exports = router;