'use strict';

var Model = require('../models/model');
var command = require('../db/command');

var base = Model.prototype;

function RecipeTag(recipeTag, db) {
    Model.apply(this, arguments);
}

RecipeTag.prototype = Object.create(base);

RecipeTag.prototype.save = function(recipeId, tagId) {
    var insertRecipeTag = command.insertRecipeTag(recipeId, tagId);

    return this._store.insert(insertRecipeTag);
};

module.exports = RecipeTag;