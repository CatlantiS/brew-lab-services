var refreshTokens = [];
var crypto = require('crypto');

module.exports.removeByUserIdClientId = function(userId, clientId, cb) {
    for (var i in refreshTokens) {
        if (refreshTokens[i].userId == userId && refreshTokens[i].clientId == clientId)
            refreshTokens.splice(i, 1);
    }
    cb();
};

module.exports.create = function(userId, clientId, scope, cb) {
    var token = crypto.randomBytes(64).toString('hex');
    var obj = {token: token, userId: userId, clientId: clientId, scope: scope};
    refreshTokens.push(obj);
    cb(null, token);
};