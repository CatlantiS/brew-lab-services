'use strict';

var queries = {};

queries.selectUserById = function(userId) {
    return 'SELECT id, name FROM "Application"."User" WHERE id = \'' + userId + '\';';
}

queries.selectRecipesByUserId = function(userId) {
    return 'SELECT * FROM "Recipes"."Recipe" WHERE userId = \'' + userId + '\';';
}

module.exports = queries;