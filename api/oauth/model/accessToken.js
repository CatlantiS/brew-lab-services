var accessTokens = [];
var crypto = require('crypto');

module.exports.getToken = function(accessToken) {
    return accessToken.token;
};

module.exports.create = function(userId, clientId, scope, ttl, cb) {
    var token = crypto.randomBytes(64).toString('hex');
    var obj = {token: token, userId: userId, clientId: clientId, scope: scope, ttl: new Date().getTime() + ttl * 1000};
    accessTokens.push(obj);
    cb(null, token);
};

module.exports.fetchByToken = function(token, cb) {
    for (var i in accessTokens) {
        if (accessTokens[i].token == token) return cb(null, accessTokens[i]);
    }
    cb();
};

module.exports.deleteToken = function(token, cb) {
    for (var i in accessTokens) {
        if (accessTokens[i].token == token) {
            accessTokens.splice(i, 1);
            return cb(null, 'Success');
        }
    }
    cb('Token not found', null);
}

module.exports.checkTTL = function(accessToken) {
    return (accessToken.ttl > new Date().getTime());
};

module.exports.getTTL = function(accessToken, cb) {
    var ttl = moment(accessToken.ttl).diff(new Date(),'seconds');
    return cb(null, ttl>0?ttl:0);
};