//A convenience module for SQL statements.

'use strict';

var queries = {};

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

queries.deleteRecipe = function(recipeId) {
    return 'DELETE FROM "Recipes"."Recipe" WHERE id = ' + recipeId + ';';
};

queries.versionRecipe = function(recipeId, versionDate) {
    return 'UPDATE "Recipes"."Recipe" SET "versionId" = ' + id + ', "versionDate" = ' + versionDate + ' WHERE id = ' + recipeId + ';';
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