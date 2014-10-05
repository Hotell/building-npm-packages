/*
 * bourne
 * https://github.com/hotell/bourne
 *
 * Copyright (c) 2014 Martin Hochel
 * Licensed under the MIT license.
 */
(function () {
  'use strict';

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
