'use strict';

var Model = require('../models/model');
var Ingredient = require('../models/recipeIngredient');
var Tag = require('../models/tag');
var RecipeTag = require('../models/recipeTag');
var command = require('../db/command');
var promise = require('node-promise');
var defer = promise.defer;
var allOrNone = promise.allOrNone;

var base = Model.prototype;

function Recipe(recipe, db) {
    Model.apply(this, arguments);
}

Recipe.prototype = Object.create(base);

Recipe.prototype.save = function() {
    var self = this, insertRecipe = command.insertRecipe(this);

    return this._store.insert(insertRecipe).then(function(recipeData) {
        var deferred = defer(), promises = [];

        if (self.ingredients && self.ingredients.length > 0) {
            var ingredientSaves = [];

            for (var i = 0; i < self.ingredients.length; i++) {
                var ingredient = new Ingredient(self.ingredients[i], self._store);

                ingredientSaves.push(ingredient.save(recipeData.recipeId).then(null, _throw));
            }

            promises.push(allOrNone(ingredientSaves));
        }

        if (self.tags && self.tags.length > 0) {
            var tagSaves = [];

            for (var j = 0; j < self.tags.length; j++) {
                var tag = self.tags[j];

                Tag.findOne(tag.name).then(function(data) {
                    if (data == null) {
                        tagSaves.push(new Tag(tag, self._store).save(function(tagData) {
                            return (new RecipeTag(null, self._store).save(recipeData.recipeId, tagData.tagId));
                        }, _throw));
                    }
                    else
                        tagSaves.push(new RecipeTag(null, self._store).save(recipeData.recipeId, data.tagId).then(null, _throw));
                });
            }

            promises.push(allOrNone(tagSaves));
        }

        allOrNone(promises).then(function() { deferred.resolve(recipeData); },
            function(err) { deferred.reject(err); });

        return deferred.promise;
    });
};

function _throw(err) { throw err; }

module.exports = Recipe;
