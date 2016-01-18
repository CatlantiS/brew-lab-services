//A convenience module for SQL statements also the reason ORMs were invented.

'use strict';

var command = {},
    selectRecipe = 'SELECT * FROM recipes.recipe',
    selectRecipeAndIngredients = 'SELECT r."recipeId", r."userId", r.name, r.volume, r.units, i."recipeIngredientId", i.name AS "name", i.type, i.volume AS "ingredientVolume", i.units AS "ingredientUnits" FROM recipes.recipe r LEFT OUTER JOIN recipes.recipe_ingredient i ON r."recipeId" = i."recipeId"';

command.selectUserById = function(userId) {
    return 'SELECT id, username, firstname, lastname, password, email FROM users.users WHERE id = ' + userId + ';';
};

command.createUser = function(user) {
    return 'INSERT INTO users.users(username,firstname,lastname,email,password) VALUES (\'' + user.userName + '\',\''
     + user.firstName + '\',\'' + user.lastName + '\',\'' + user.email + '\',\'' + user.password + '\')';
};

command.selectUserByUsername = function(username) {
	return 'SELECT id, username, firstname, lastname, password, email FROM users.users where username = \'' + username + '\';';
};

command.selectRecipesByUserId = function(userId) {
    return selectRecipe + ' WHERE "userId" = ' + userId + ';';
};

command.selectRecipeById = function(recipeId) {
    return selectRecipe + ' WHERE "recipeId" = ' + recipeId + ';';
};

command.selectRecipeIngredientsByRecipeId = function(recipeId) {
    return 'SELECT * FROM recipes.recipe_ingredient WHERE "recipeId" = ' + recipeId + ';';
};

//Alright, this is getting out of control.
command.selectRecipeByUserIdAndRecipeId = function(userId, recipeId) {
    return selectRecipe + ' WHERE "userId" = ' + userId + ' AND "recipeId" = ' + recipeId + ';';
};

command.insertRecipe = function(recipe) {
    return 'INSERT INTO recipes.recipe ("userId", name, volume, units, style) VALUES (' +
        recipe.userId + ', \'' + recipe.name + '\', ' + valueOrDbNull(recipe.volume, false) + ', ' +
        valueOrDbNull(recipe.units, true) + ', ' + valueOrDbNull(recipe.style, true) + ') RETURNING "recipeId";';
};

command.updateRecipe = function(recipe) {
    return 'UPDATE recipes.recipe SET name = \'' + recipe.name + '\', volume = ' +
        valueOrDbNull(recipe.volume, false) + ', units = ' + valueOrDbNull(recipe.units, true) +
        ' WHERE "recipeId" = ' + recipe.recipeId + ';';
};

command.insertRecipeIngredient = function(recipeIngredient, recipeId) {
    return 'INSERT INTO recipes.recipe_ingredient ("recipeId", name, type, volume, units) VALUES (' +
        (recipeId != null ? recipeId : recipeIngredient.recipeId) + ', \'' + recipeIngredient.name + '\', \'' + recipeIngredient.type + '\', ' +
        valueOrDbNull(recipeIngredient.volume, false) + ', ' + valueOrDbNull(recipeIngredient.units, true) + ') ' +
        'RETURNING "recipeIngredientId";';
};

command.updateRecipeIngredient = function(recipeIngredient) {
    return 'UPDATE recipes.recipe_ingredient SET "recipeId" = ' + recipeIngredient.recipeId + ', name = \'' +
        recipeIngredient.name + '\', volume = ' + valueOrDbNull(recipeIngredient.volume, false) + ', units = '
        + valueOrDbNull(recipeIngredient.units, true) + ' WHERE "recipeIngredientId" = ' + recipeIngredient.recipeIngredientId + ';';
};

command.deleteRecipe = function(recipeId) {
    return 'DELETE FROM recipes.recipe WHERE "recipeId" = ' + recipeId + ';';
};

command.deleteRecipeIngredients = function(recipeId) {
    return 'DELETE FROM recipes.recipe_ingredient WHERE "recipeId" = ' + recipeId + ';';
};

command.selectTagByName = function(name) {
    return 'SELECT * FROM recipes.tag WHERE name = \'' + name + '\';';
};

command.selectTagsByName = function(name) {
    return 'SELECT * FROM recipes.tag WHERE name LIKE \'%' + name + '%\';';
};

command.insertTag = function(tag) {
    return 'INSERT INTO recipes.tag (name) VALUES (\'' + tag.name + '\') RETURNING "tagId";';
};

command.insertRecipeTag = function(recipeId, tagId) {
    return 'INSERT INTO recipes.recipe_tag ("recipeId", "tagId") VALUES (' + recipeId + ', ' + tagId + ') RETURNING "recipeTagId";';
};

command.selectDefinitions = function(definition) {
    return 'SELECT * FROM definitions.' + definition + ';';
};

// NOTE:  use this to have postgres grab the current time(but this will be server time)
// SELECT TIMESTAMP WITHOUT TIME ZONE 'epoch' + 1440037552357 * INTERVAL '1 millisecond';
// select CAST(NOW() at time zone 'UTC' as timestamp);

command.createLog = function(timestamp,level,url,userId,message) {
    return 'INSERT INTO logs.logs(utcdate,level,url,userid,message) SELECT TIMESTAMP WITHOUT TIME ZONE \'epoch\' + ' + timestamp + ' * INTERVAL \'1 millisecond\''
    + ',\'' + level + '\',\'' + url + '\',' + userId + ',\'' + message + '\'';
};

command.getAllLogs = function() {
    return 'SELECT * FROM logs.logs';
};

function valueOrDbNull(value, isString) {
    return value == null ? 'null' :
        isString ? '\'' + value + '\'' : value;
}

module.exports = command;