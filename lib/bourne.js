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

    store.exist = fs.existsSync.bind(fs);
    store.remove = fs.unlinkSync.bind(fs);
    store.get = fs.readFileSync.bind(fs);
    store.set = fs.writeFile.bind(fs);
  } else {
    store.exist = function (key) {
      return localStorage.getItem(key) !== null;
    };
    store.remove = localStorage.removeItem.bind(localStorage);
    store.get = localStorage.getItem.bind(localStorage);
    store.set = function (key, value, cb) {
      localStorage.setItem(key, value);
      cb && cb();
    }
  }

  var Bourne = {};

  Bourne.awesome = function () {
    return 'awesome';
  };

  if (typeof exports !== 'undefined') {
    module.exports = Bourne;
  } else {
    window.Bourne = Bourne;
  }

}.call(this));
