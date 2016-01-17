module.exports = function(oauth2) {
    //Web
    var express = require('express');
    var router = express.Router();
    //DB
    var dbConfig = require('../configuration/dbConfig.js');
    var pgConnection = require('../core/pgConnection');
    var database = pgConnection(dbConfig.connectionString);
    var command = require('../db/command');
    var Recipe = require('../models/recipe');
    //Auth
    var bcrypt = require('bcrypt');
    //Promise
    var promise = require('node-promise');
    var all = promise.all;
    var allOrNone = promise.allOrNone;

    //All api routes secured with oauth.
    router.use(oauth2.middleware.bearer);

    //Some pretty redundant data in here, can reduce the payload.
    router.get('/v1/users/roles/', function(request, response) {
        database.connect(function(db) {
            var select = "SELECT * FROM users.role r, users.role_type t WHERE r.type = t.type";

            db.find(select).then(function(data) {
                var types = {};

                for (var i = 0; i < data.length; i++) {
                    var role = data[i];

                    (types[role.type] = types[role.type] || {
                            type: role.type,
                            isAdmin: role.isAdmin,
                            roles: []
                        }).roles.push(role);
                }

                response.send(types);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.get('/v1/users/all', function(request, response) {
        database.connect(function(db) {
            var select = "SELECT * from users.users";

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { throw err; });
        });
    });

    router.get('/v1/users/current', function(request, response) {
        var userId = request.oauth2.accessToken.userId;

        database.connect(function(db) {
            var select = command.selectUserById(userId);

            db.findOne(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.post('/v1/users/create', function(request, response) {
        var user = request.body;
        database.connect(function(db) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    user.password = hash;
                    var sql = command.createUser(user);
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
            var select = command.selectUserById(userId);

            db.findOne(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.get('/v1/users/name/:userName', function (request, response) {
        var userName = request.params.userName;

        database.connect(function (db) {
            var select = command.selectUserByUsername(userName);

            db.findOne(select).then(function(data) {
                response.send(data);
            }, function(err) { throw err; });
        });
    });

    router.get('/v1/users/:userId/recipes/', function(request, response) {
        var userId = request.params.userId;

        database.connect(function(db) {
            var select = command.selectRecipesByUserId(userId);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.get('/v1/currentUser/recipes/', function(request,response) {
        var userId = request.oauth2.accessToken.userId;

        database.connect(function(db) {
            var select = command.selectRecipesByUserId(userId);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.get('/v1/currentUser/recipes/:recipeId', function(request,response) {
        var recipeId = request.params.recipeId,
            userId = request.oauth2.accessToken.userId;

        database.connect(function(db) {
            var select = command.selectRecipeByUserIdAndRecipeId(userId, recipeId);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.post('/v1/recipes/', function(request, response) {
        var recipe = request.body;
        recipe.userId = request.oauth2.accessToken.userId;

        try {
            database.connect(function(db) {
                db.beginTransaction().then(function() {
                    (new Recipe(recipe, db)).save().then(function(data) {
                        db.commit().then(function () {
                            response.send(data);
                        },
                        function (err) { throw (err); });
                    }, function (err) {
                        db.rollback();

                        errorHandler(err, response);
                    });
                });
            });
        }
        catch (exception) {
            errorHandler(exception, response);
        }
    });

    router.delete('/v1/recipes/:recipeId', function(request, response) {
        var recipeId = request.params.recipeId;

        try {
            database.connect(function(db) {
                db.beginTransaction().then(function() {
                    var deleteRecipeIngredients = command.deleteRecipeIngredients(recipeId);

                    db.execute(deleteRecipeIngredients).then(function() {
                        var deleteRecipe = command.deleteRecipe(recipeId);

                        db.execute(deleteRecipe).then(function(data) {
                            db.commit().then(function() {
                                response.send();
                            }, function(err) {
                                db.rollback();

                                errorHandler(err, response);
                            });
                        }, function(err) {
                            db.rollback();

                            errorHandler(err, response);
                        });
                    }, function(err) {
                        db.rollback();

                        errorHandler(err, response);
                    });
                });
            });
        }
        catch (exception) {
            errorHandler(exception, response);
        }
    });

    //Todo: secure this.
    router.route('/v1/recipes/:recipeId')
        .get(function(request, response) {
            var recipeId = request.params.recipeId;

            database.connect(function(db) {
                var select = command.selectRecipeById(recipeId);

                db.findOne(select).then(function(data) {
                    response.send(data);
                }, function(err) { errorHandler(err, response); });
            });
        })
        //Todo: add api for versioning recipes.
        //A lot of redundancy between this and post api.  Might be able to refactor.
        .put(function(request, response) {
            var recipeId = request.params.recipeId,
                recipe = request.body;
;
            //Is this necessary?
            if (recipeId != recipe.recipeId) {
                errorHandler('Recipe ID in query param does not match recipe ID in body.', response);

                return;
            }

            database.connect(function(db) {
                var updateRecipe = command.updateRecipe(recipe);

                db.beginTransaction().then(function() {
                    db.executeOne(updateRecipe).then(function() {
                        //We just blow away existing ingredients and re-add rather than try to determine which have changed and which haven't.
                        var deleteIngredients = command.deleteRecipeIngredients(recipeId);

                        db.executeOne(deleteIngredients).then(function() {
                            var ingredientInserts = [];

                            for (var i = 0; i < recipe.ingredients.length; i++) {
                                var ingredient = recipe.ingredients[i],
                                    insertIngredient = command.insertRecipeIngredient(ingredient, recipeId);

                                ingredientInserts.push(db.executeOne(insertIngredient).then(function () { },
                                    function (err) { throw (err); }));
                            }

                            allOrNone(ingredientInserts).then(function (data) {
                                db.commit().then(function () {
                                    response.send();
                                }, function (err) {
                                    db.rollback();

                                    errorHandler(err, response);
                                });
                            }, function (err) {
                                db.rollback();

                                errorHandler(err, response);
                            });
                        }, function(err) {
                            db.rollback();

                            errorHandler(err, response);
                        });
                    }, function(err) {
                        db.rollback();

                        errorHandler(err, response);
                    });
                }, function(err) {
                    db.rollback();

                    errorHandler(err, response);
                });
            });
        });

    router.get('/v1/recipeIngredients/:recipeId', function(request,response) {
        var recipeId = request.params.recipeId;

        database.connect(function(db) {
            var select = command.selectRecipeIngredientsByRecipeId(recipeId);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    router.get('/v1/definitions/:definition', function(request, response) {
        var definition = request.params.definition;

        database.connect(function(db) {
            var select = command.selectDefinitions(definition);

            db.find(select).then(function(data) {
                response.send(data);
            }, function(err) { errorHandler(err, response); });
        });
    });

    //Returning all definitions in a single object to minimize calls.
    router.get('/v1/brewMaster/definitions/', function(request, response) {
        database.connect(function(db) {
            var ingredient = db.find(command.selectDefinitions('ingredient'))
                    .then(function(data) { return { name: 'ingredient', data: data }; }),
                units = db.find(command.selectDefinitions('units'))
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