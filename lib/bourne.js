/*
 * bourne
 * https://github.com/hotell/bourne
 *
 * Copyright (c) 2014 Martin Hochel
 * Licensed under the MIT license.
 */
(function () {
  'use strict';

  var store = {};

  if (typeof require !== 'undefined') {
    var fs = require('fs');

    store.exists = fs.existsSync.bind(fs);
    store.remove = fs.unlinkSync.bind(fs);
    store.get = fs.readFileSync.bind(fs);
    store.set = fs.writeFile.bind(fs);
  } else {
    store.exists = function (key) {
      return localStorage.getItem(key) !== null;
    };
    store.remove = localStorage.removeItem.bind(localStorage);
    store.get = localStorage.getItem.bind(localStorage);
    store.set = function (key, value, cb) {
      localStorage.setItem(key, value);
      cb && cb();
    }
  }

  var Bourne = function (name, options) {
    options = options || {};
    this.name = name;
    this.data = [];
    this._id = 1;
    this.store = options.store || store;

    if (this.store.exists(this.name)) {
      if (options.reset) {
        this.store.remove(name);
      } else {
        this.data = JSON.parse(this.store.get(name) || {});
        this._id = Math.max.apply(Math, this.data.map(function (row) {
          return row.id
        }));
      }
    } else {
      this.store.set(this.name, JSON.stringify(this.data));
    }

    // Lazy Method
    //if (this.store.exists(this.name) && options && !options.reset) {
    //  this.data = JSON.parse(this.store.get(name) || {});
    //  this._id = Math.max.apply(Math, this.data.map(function (row) {
    //    return row.id
    //  }));
    //}
  };

  Bourne.prototype.insert = function (record, cb) {
    record.id = this._id++;
    this.data.push(record);
    this.store.set(this.name, JSON.stringify(this.data), function () {
      cb && cb(null, record);
    });
  };

  Bourne.prototype.find = function (query, cb) {
    var data = this.data.filter(function (record) {
      for (var key in query) {
        if (Object.prototype.hasOwnProperty.call(query, key)) {
          if (!record[key] || record[key] !== query[key]) {
            return false;
          }
        }
      }
      return true;
    });
    cb(null, data);
  };
// export module
  if (typeof exports !== 'undefined') {
    module.exports = Bourne;
  } else {
    window.Bourne = Bourne;
  }

}.call(this));
