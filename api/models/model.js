'use strict';

function Model(obj, store) {
    for (var prop in obj)
        if (obj.hasOwnProperty(prop))
            this[prop] = obj[prop];

    this._store = store;
}

module.exports = Model;
