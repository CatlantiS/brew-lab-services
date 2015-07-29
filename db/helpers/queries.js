//A convenience module for SQL statements.

'use strict';

var queries = {};

queries.selectUserById = function(userId) {
    return 'SELECT id, name FROM "Application"."User" WHERE id = ' + userId + ';';
};

queries.selectRecipesByUserId = function(userId) {
    return 'SELECT * FROM "Recipes"."Recipe" WHERE "userId" = ' + userId + ';';
};

queries.selectRecipeById = function(recipeId) {
    return 'SELECT * FROM "Recipes"."Recipe" WHERE id = ' + recipeId + ';';
};

queries.insertRecipe = function(recipe) {
    return 'INSERT INTO "Recipes"."Recipe" ("userId", name, volume, units, "yeastType") VALUES (' +
        recipe.userId + ', \'' + recipe.name + '\', ' + recipe.volume + ', \'' + recipe.units + '\', \'' + recipe.yeastType + '\') ' +
        'RETURNING id;';
};

queries.versionRecipe = function(recipeId, versionDate) {
    return 'UPDATE "Recipes"."Recipe" SET "versionId" = ' + id + ', "versionDate" = ' + versionDate + ' WHERE id = ' + recipeId + ';';
};

module.exports = queries;