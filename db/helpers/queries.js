//A convenience module for SQL statements.

'use strict';

var queries = {};

queries.selectUserById = function(userId) {
    return 'SELECT id, name FROM "Application"."User" WHERE id = ' + userId + ';';
}

queries.selectRecipesByUserId = function(userId) {
    return 'SELECT * FROM "Recipes"."Recipe" WHERE userId = ' + userId + ';';
}

queries.insertRecipe = function(recipe) {
    return 'INSERT INTO "Recipes"."Recipe" ("userId", name, volume, units, "yeastType") VALUES (' +
        recipe.userId + ', \'' + recipe.name + '\', ' + recipe.volume + ', \'' + recipe.units + '\', \'' + recipe.yeastType + '\') ' +
        'RETURNING id;';
}

queries.insertRecipeVersion = function(recipeVersion) {
    return 'INSERT INTO "Recipes"."RecipeVersion" ("userId", name, volume, units, "yeastType", "versionDate") VALUES (' +
        recipe.userId + ', \'' + recipe.name + '\', ' + recipe.volume + ', \'' + recipe.units + '\', \'' + recipe.yeastType + '\', ' + recipe.versionDate + ') ' +
        'RETURNING id;';
};

module.exports = queries;