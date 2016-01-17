'use strict';

function Model(obj, store) {
    if (obj != null)
        for (var prop in obj)
            if (obj.hasOwnProperty(prop))
                this[prop] = obj[prop];

    this._store = store;
}

Model.prototype.save = function() { throw 'Not implemented'; };

//Todo: have not implemented error for static methods...

module.exports = Model;
