'use strict';

var Model = require('../models/model');
var Ingredient = require('../models/recipeIngredient');
var command = require('../db/command');
var promise = require('node-promise');
var defer = require('node-promise').defer;
var allOrNone = promise.allOrNone;

var base = Model.prototype;

function Recipe(recipe, db) {
    Model.apply(this, arguments);
}

Recipe.prototype = Object.create(base);

Recipe.prototype.save = function() {
    var self = this, insertRecipe = command.insertRecipe(this);

    return this._store.insert(insertRecipe).then(function(recipeData) {
        var deferred = defer();

        if (self.ingredients && self.ingredients.length > 0) {
            var ingredientSaves = [];

            for (var i = 0; i < self.ingredients.length; i++) {
                var ingredient = new Ingredient(self.ingredients[i], self._store);

                ingredientSaves.push(ingredient.save(recipeData.recipeId).then(null,
                    function (err) { throw (err); }));
            }

            allOrNone(ingredientSaves).then(function() {
                deferred.resolve(recipeData);
            }, function(err) { deferred.reject(err); });
        }
        else
            deferred.resolve(recipeData);

        return deferred.promise;
    });
};

module.exports = Recipe;
