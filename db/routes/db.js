module.exports = function(oauth2) {

    var express = require('express');
    var router = express.Router();

//Todo: make conn string more configurable.
    var connectionString = 'postgres://postgres:samcool@localhost/brewlabdb';
    var Database = require('../core/database');
    var database = Database(connectionString);
    var queries = require('../helpers/queries');

//Todo: brush up on proper REST route conventions.
    router.get('/v1/users/:userId/recipes/', function (request, response) {
        var userId = request.params.userId;

        database.connect(function (db) {
            var select = queries.selectRecipesByUserId(userId);

            db.find(select, function (data) {
                response.send(data);
            });
        });
    });

    router.get('/v1/users/all', oauth2.middleware.bearer, function(request, response) {
     database.connect(function(db) {
        var select = "SELECT * from users.users";

        db.find(select, function(data, err) {
            if (err) throw err;

            response.send(data);
            });
        });
     });

    router.get('/v1/users/current', oauth2.middleware.bearer, function(request, response) {
        response.status(200).send({userId: request.oauth2.accessToken.userId});
    });

    router.post('/v1/users/create', oauth2.middleware.bearer, function(request, response) {
        var user = request.body;
        database.connect(function(db) {
            var sql = queries.createUser(user);
            db.insert(sql, function(data, err) {
                if (err) throw err;
                response.status(200).send('ok');
            });
        });
    });

    router.get('/v1/users/id/:userId', function (request, response) {
        var userId = request.params.userId;

        database.connect(function (db) {
            var select = queries.selectUserById(userId);

            db.findOne(select, function (data, err) {
                if (err) throw err;

                response.send(data);
            });
        });
    });

    router.get('/v1/users/name/:userName', function (request, response) {
        var userName = request.params.userName;

        database.connect(function (db) {
            var select = queries.selectUserByUsername(userName);

            db.findOne(select, function (data, err) {
                if (err) throw err;
                response.send(data);
            });
        });
    });

    router.post('/v1/recipes/', function (request, response) {
        var recipe = request.body;

        //Do we want to use a transaction in here?
        database.connect(function (db) {
            var insert = queries.insertRecipe(recipe);

            db.insert(insert, function (data) {
                response.send(data);
            });
        });
    });

    router.route('/v1/recipes/:recipeId')
        .get(function (request, response) {
            var recipeId = request.params.recipeId;

            database.connect(function (db) {
                var select = queries.selectRecipeById(recipeId);

                db.findOne(select, function (data) {
                    response.send(data);
                });
            });
        })
        .put(function (request, response) {
            var recipeId = request.params.recipeId;
            var recipe = request.body;
        });

    return router;
};