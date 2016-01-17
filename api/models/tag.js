'use strict';

var Model = require('../models/model');
var command = require('../db/command');
var promise = require('node-promise');
var defer = promise.defer;

var base = Model.prototype;

function Tag(tag, db) {
    Model.apply(this, arguments);
}

Tag.prototype = Object.create(base);

Tag.prototype.save = function() {
    var insertTag = command.insertTag(this);

    return this._store.insert(insertTag);
};

//Static find methods.
Tag.find = function(name, store) {
    var self = this, deferred = defer(), selectTags = command.selectTagsByName(name);

    store.find(selectTags).then(function(data) {
        var tags;

        //Lazy check if array.
        if (data && data.length)
            tags = data.map(function(tag) { return new Tag(tag, self._store); });

        deferred.resolve(tags);
    });

    return deferred.promise;
};

Tag.findOne = function(name, store) {
    var self = this, deferred = defer(), selectTag = command.selectTagByName(name);

    store.find(selectTag).then(function(tags) {
        var tag = tags[0];

        deferred.resolve(tag != null ? new Tag(tag, self._store) : null);
    }, function(err) { throw err; });

    return deferred.promise;
};

module.exports = Tag;