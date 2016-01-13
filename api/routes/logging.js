module.exports = function(oauth2) {
    //Web
    var express = require('express');
    var router = express.Router();
    //DB
    var dbConfig = require('../configuration/dbConfig.js');
    var pgConnection = require('../core/pgConnection');
    var database = pgConnection(dbConfig.connectionString);
    var command = require('../db/command');

    var isAuthorized = [ oauth2.middleware.bearer ];

    //commenting this out until we can figure out how to add headers to ajaxappender
    router.post('/v1/logs/', isAuthorized, function(request, response) {
        var payload = JSON.parse(request.body.data)[0];
        var sql = command.createLog(payload.timestamp, payload.level, payload.url, request.oauth2.accessToken.userId, payload.message);

        database.connect(function(db) {
            db.insert(sql).then(function(data) {
                response.status(200).send('OK');
            });
        }, function(err) {
            response.status(500).send('ERROR' + err);
            throw err;
        });
    });

    router.get('/v1/logs/all', isAuthorized, function(request, response) {
        database.connect(function(db) {
            var sql = command.getAllLogs();
            db.find(sql).then(function(data) {
                response.status(200).send(data);
            }, function(err) { throw err; });
        });
    });

    return router;
}

