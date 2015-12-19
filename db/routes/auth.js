module.exports = function(oauth2) {
    var express = require('express');
    var router = express.Router();

    router.post('/v1/authorize', oauth2.controller.token);

    router.get('/v1/secure', oauth2.middleware.bearer, function (req, res) {
        if (!req.oauth2.accessToken) return res.status(403).send('Forbidden');
        if (!req.oauth2.accessToken.userId) return res.status(403).send('Forbidden');
        res.send('Hi! Dear user ' + req.oauth2.accessToken.userId + '!');
    });

    function isAuthorized(req, res, next) {
        if (req.session.authorized) next();
        else {
            console.log('sorry not authorized brah');
            req.send(401);
        }
    }

    return router;
}

