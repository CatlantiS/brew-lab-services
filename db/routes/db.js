module.exports = function(oauth2) {
    var express = require('express');
    var router = express.Router();

    var dbConfig = require('../configuration/dbConfig.js');
    var pgConnection = require('../core/pgConnection');
    var database = pgConnection(dbConfig.connectionString);
    var queries = require('../helpers/queries');
    var bcrypt = require('bcrypt');

    //commenting this out until we can figure out how to add headers to ajaxappender
    router.post('/v1/logs/', oauth2.middleware.bearer, function(request, response) {
        var payload = JSON.parse(request.body.data)[0];
        var sql = queries.createLog(payload.timestamp, payload.level, payload.url, request.oauth2.accessToken.userId, payload.message);

        database.connect(function(db) {
            db.insert(sql).then(function(data) {
                response.status(200).send('OK');
            });
        }, function(err) {
            response.status(500).send('ERROR' + err);
            throw err;
        });
    });

    router.get('/v1/logs/all', function(request, response) {
        database.connect(function(db) {
            var sql = queries.getAllLogs();
            db.find(sql).then(function(data) {
                response.status(200).send(data);
            }, function(err) { throw err; });
        });
    });

    router.get('/v1/users/all', oauth2.middleware.bearer, function(request, response) {
        database.connect(function(db) {
            var select = "SELECT * from users.users";

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { throw err; });
        });
    });

    router.get('/v1/users/current', oauth2.middleware.bearer, function(request, response) {
        response.status(200).send({userId: request.oauth2.accessToken.userId});
    });

    router.post('/v1/users/create', oauth2.middleware.bearer, function(request, response) {
        var user = request.body;
        database.connect(function(db) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    user.password = hash;
                    var sql = queries.createUser(user);
                    db.insert(sql).then(function(data) {
                        response.status(200).send('ok');
                    }, function(err) { throw err; });
                });
            });
        });
    });

    router.get('/v1/users/:userId', function(request, response) {
        var userId = request.params.userId;

        database.connect(function(db) {
            var select = queries.selectUserById(userId);

            db.findOne(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.get('/v1/users/name/:userName', function (request, response) {
        var userName = request.params.userName;

        database.connect(function (db) {
            var select = queries.selectUserByUsername(userName);

            db.findOne(select).then(function(data) {
                response.send(data);
            }, function(err) { throw err; });
        });
    });

    router.get('/v1/users/:userId/recipes/', function(request, response) {
        var userId = request.params.userId;

        database.connect(function(db) {
            var select = queries.selectRecipesByUserId(userId);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.get('/v1/recipes/currentUser', oauth2.middleware.bearer, function(request,response) {
            var userId = request.oauth2.accessToken.userId;

            database.connect(function(db) {
            var select = queries.selectRecipesByUserId(userId);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.post('/v1/recipes/', oauth2.middleware.bearer, function(request, response) {
        var recipe = request.body;
        recipe.userId = request.oauth2.accessToken.userId;
        
        //Do we want to use a transaction in here?
        database.connect(function(db) {
            db.beginTransaction();

            var insert = queries.insertRecipe(recipe);

            db.insert(insert).then(function(data) {
                db.commit();

                response.send(data);
            }, function(err) {
                db.rollback();

                errorHandler(err, response);
            });
        });
    });

    router.delete('/v1/recipes/:recipeId', function(request, response) {
        var recipeId = request.params.recipeId;

        database.connect(function(db) {
            var deleteSql = queries.deleteRecipe(recipeId);

            db.execute(deleteSql).then(function(data) {
                response.send();
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.route('/v1/recipes/:recipeId')
        .get(function(request, response) {
            var recipeId = request.params.recipeId;

            database.connect(function(db) {
                var select = queries.selectRecipeById(recipeId);

                db.findOne(select).then(function(data) {
                    response.send(data);
                }, function(err) { errorHandler(err, response); });
            });
        })
        .put(function(request, response) {
            var recipeId = request.params.recipeId;
            var recipe = request.body;
        });

    //Just ripped this off of app.js.
    //Do we want to add logging in here?
    function errorHandler(error, response) {
        response.status(500)
            .render('error', {
                message: error.message,
                error: error
            });
    }

    return router;
};