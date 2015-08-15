//A convenience module for SQL statements.

'use strict';

var queries = {};

queries.selectUserById = function(userId) {
    return 'SELECT id, username, firstname, lastname, password, email FROM users.users WHERE id = ' + userId + ';';
};

queries.createUser = function(user) {
    return 'INSERT INTO users.users(username,firstname,lastname,email,password) VALUES (\'' + user.userName + '\',\''
     + user.firstName + '\',\'' + user.lastName + '\',\'' + user.email + '\',' + 'encode(digest(\'' + user.password + '\', \'SHA1\'),\'hex\')' + ')';
}

queries.selectUserByUsername = function(username) {
	return 'SELECT id, username, firstname, lastname, password, email FROM users.users where username = \'' + username + '\';';
}

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