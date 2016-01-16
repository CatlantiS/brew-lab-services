'use strict';

var Model = require('../models/model');
var command = require('../db/command');

var base = Model.prototype;

function RecipeIngredient(ingredient, db) {
    Model.apply(this, arguments);
}

RecipeIngredient.prototype = Object.create(base);

RecipeIngredient.prototype.save = function(recipeId) {
    var insertIngredient = command.insertRecipeIngredient(this, recipeId);

    return this._store.insert(insertIngredient);
};

module.exports = RecipeIngredient;