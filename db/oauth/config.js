(function() {
	/*var orig = console.log;

	console.log = function(msg) {
		//console.prototype.log.call(msg.bgBlue.yellow);
		orig(msg.bgBlue.yellow.bold);
	};*/

	module.exports = function() {
		console.log("calling oauth config");
		var oauth2lib = require('oauth20-provider/lib/');
		var obj = new oauth2lib({ log: { level: 0}});

		return obj;
	};
})();