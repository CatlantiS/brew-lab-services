//A convenience module for SQL statements.

'use strict';

var queries = {},
    recipeJoin = 'SELECT r."recipeId", r."userId", r.name, r.volume, r.units, i."recipeIngredientId", i.ingredient, i.type, i.volume AS "ingredientVolume", i.units AS "ingredientUnits" FROM recipes.recipe r LEFT OUTER JOIN recipes.recipe_ingredient i ON r."recipeId" = i."recipeId"';

queries.selectUserById = function(userId) {
    return 'SELECT id, username, firstname, lastname, password, email FROM users.users WHERE id = ' + userId + ';';
};

queries.createUser = function(user) {
    return 'INSERT INTO users.users(username,firstname,lastname,email,password) VALUES (\'' + user.userName + '\',\''
     + user.firstName + '\',\'' + user.lastName + '\',\'' + user.email + '\',\'' + user.password + '\')';
}

queries.selectUserByUsername = function(username) {
	return 'SELECT id, username, firstname, lastname, password, email FROM users.users where username = \'' + username + '\';';
}

queries.selectRecipesByUserId = function(userId) {
    return recipeJoin + ' WHERE r."userId" = ' + userId + ';';
};

queries.selectRecipeById = function(recipeId) {
    return recipeJoin + ' WHERE r."recipeId" = ' + recipeId + ';';
};

queries.selectRecipeIngredientsByRecipeId = function(recipeId) {
    return 'SELECT * FROM recipes.recipe_ingredient WHERE "recipeId" = ' + recipeId + ';';
};

//Alright, this is getting out of control.
queries.selectRecipeByUserIdAndRecipeId = function(userId, recipeId) {
    return recipeJoin + ' WHERE r."userId" = ' + userId + ' AND r."recipeId" = ' + recipeId + ';';
};

queries.insertRecipe = function(recipe) {
    return 'INSERT INTO recipes.recipe ("userId", name, volume, units) VALUES (' +
        recipe.userId + ', \'' + recipe.name + '\', ' + recipe.volume + ', \'' + recipe.units + '\') ' +
        'RETURNING "recipeId";';
};

//Most likely get rid of this once we have versioning in place.
queries.updateRecipe = function(recipe) {
    return 'UPDATE recipes.recipe SET name = \'' + recipe.name + '\', volume = ' + recipe.volume + ', units = \'' + recipe.units + '\' WHERE "recipeId" = ' + recipe.recipeId + ';';
};

queries.deleteRecipe = function(recipeId) {
    return 'DELETE FROM recipes.recipe WHERE "recipeId" = ' + recipeId + ';';
};

queries.selectDefinitions = function(definition) {
    return 'SELECT * FROM definitions.' + definition + ';';
};

// NOTE:  use this to have postgres grab the current time(but this will be server time)
// SELECT TIMESTAMP WITHOUT TIME ZONE 'epoch' + 1440037552357 * INTERVAL '1 millisecond';
// select CAST(NOW() at time zone 'UTC' as timestamp);

queries.createLog = function(timestamp,level,url,userId,message) {
    return 'INSERT INTO logs.logs(utcdate,level,url,userid,message) SELECT TIMESTAMP WITHOUT TIME ZONE \'epoch\' + ' + timestamp + ' * INTERVAL \'1 millisecond\''
    + ',\'' + level + '\',\'' + url + '\',' + userId + ',\'' + message + '\'';
};

queries.getAllLogs = function() {
    return 'SELECT * FROM logs.logs';
};

module.exports = queries;