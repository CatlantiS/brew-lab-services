module.exports = function(oauth2) {
    //Web
    var express = require('express');
    var router = express.Router();

    //DB
    var dbConfig = require('../configuration/dbConfig.js');
    var pgConnection = require('../core/pgConnection');
    var database = pgConnection(dbConfig.connectionString);
    var queries = require('../helpers/queries');

    var bcrypt = require('bcrypt');

    var all = require('node-promise').all;

    //Todo: tighten all these up with oauth2.middleware.bearer once we're done with initial dev.

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

    router.get('/v1/logs/all', oauth2.middleware.bearer, function(request, response) {
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
        var userId = request.oauth2.accessToken.userId;

        database.connect(function(db) {
            var select = queries.selectUserById(userId);

            db.findOne(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
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

    router.get('/v1/users/:userId/recipes/', oauth2.middleware.bearer, function(request, response) {
        var userId = request.params.userId;

        database.connect(function(db) {
            var select = queries.selectRecipesByUserId(userId);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.get('/v1/currentUser/recipes/', oauth2.middleware.bearer, function(request,response) {
        var userId = request.oauth2.accessToken.userId;

        database.connect(function(db) {
            var select = queries.selectRecipesByUserId(userId);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.get('/v1/currentUser/recipes/:recipeId', oauth2.middleware.bearer, function(request,response) {
        var recipeId = request.params.recipeId,
            userId = request.oauth2.accessToken.userId;

        database.connect(function(db) {
            var select = queries.selectRecipeByUserIdAndRecipeId(userId, recipeId);

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
            var insert = queries.insertRecipe(recipe);

            db.insert(insert).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.delete('/v1/recipes/:recipeId', oauth2.middleware.bearer, function(request, response) {
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
        //Todo: change this to use versioning.
        .put(function(request, response) {
            var recipeId = request.params.recipeId,
                recipe = request.body;

            if (recipeId != recipe.recipeId) {
                errorHandler('Recipe ID in query param does not match recipe ID in body.', response);

                return;
            }

            database.connect(function(db) {
                var update = queries.updateRecipe(recipe);

                db.executeOne(update).then(function() {
                    response.status(200).send('ok');
                }, function(err) { errorHandler(err, response); });
            });
        });

    router.get('/v1/definitions/:definition', function(request, response) {
        var definition = request.params.definition;

        database.connect(function(db) {
            var select = queries.selectDefinitions(definition);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    //Returning all definitions in a single object to minimize calls.
    router.get('/v1/brewMaster/definitions/', function(request, response) {
        database.connect(function(db) {
            var ingredient = db.find(queries.selectDefinitions('ingredient'))
                    .then(function(data) { return { name: 'ingredient', data: data }; }),
                units = db.find(queries.selectDefinitions('units'))
                    .then(function(data) { return { name: 'units', data: data }; });

            all(ingredient, units).then(function(data) {
                var merged = {};

                for (var i = 0; i < data.length; i++) {
                    var definitionType = data[i],
                        definitions = merged[definitionType.name] = {};

                    for (var j = 0; j < definitionType.data.length; j++) {
                        var definition = definitionType.data[j];

                        //Shouldn't ever have a null or empty type, but just in case...
                        if (definition.type != null && definition.type !== '') {
                            var type = definition.type.toLowerCase();

                            definitions[type] = definitions[type] || [];
                            definitions[type].push(definition);
                        }
                    }
                }

                response.send(merged);
            }, function(err) { errorHandler(err, response); });
        });
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