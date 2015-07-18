'use strict';

//Not using this right now, but might help with making parameterized DB queries more readable...

//http://stackoverflow.com/questions/18405736/is-there-a-c-sharp-string-format-equivalent-in-javascript
function format() {
    var args = arguments;

    return args[0].replace(/{(\d+)}/g, function(match, number) {
        var index = parseInt(number) + 1; //To account for first arg being input string.

        return typeof args[index] != 'undefined' ? args[index] : match;
    });
}

module.exports = {
    format: format
};
