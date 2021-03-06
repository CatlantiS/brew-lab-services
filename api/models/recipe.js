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
    var self = this, store = self._store, deferred = defer(), insertRecipe = command.insertRecipe(this);

    store.insert(insertRecipe).then(function(recipeData) {
        var promises = [];

        if (self.ingredients && self.ingredients.length > 0) {
            for (var i = 0; i < self.ingredients.length; i++) {
                var ingredient = new Ingredient(self.ingredients[i], store);

                //Do we even need to throw an error here or will it get handled as expected by allOrNone()?
                promises.push(ingredient.save(recipeData.recipeId).then(null, _throw));
            }
        }

        if (self.tags && self.tags.length > 0) {
            for (var j = 0; j < self.tags.length; j++)
                (function saveTag(tag) {
                    var d = defer();

                    Tag.findOne(tag.name, store).then(function(data) {
                        if (data == null) {
                            new Tag(tag, store).save().then(function(tagData) {
                                //This is getting hideous.
                                d.resolve(new RecipeTag(null, store).save(recipeData.recipeId, tagData.tagId).then(null, _throw)); }, _throw);
                        }
                        else
                            d.resolve(new RecipeTag(null, store).save(recipeData.recipeId, data.tagId).then(null, _throw));
                    });

                    promises.push(d.promise);
                })(self.tags[j]);
        }

        allOrNone(promises).then(function() { deferred.resolve(recipeData); },
            function(err) { deferred.reject(err); });
    });

    return deferred.promise;
};

function _throw(err) {
    throw err;
}

module.exports = Recipe;
