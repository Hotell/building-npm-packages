'use strict';
if (typeof require !== 'undefined') {
  var Bourne = require('../lib/bourne.js');
  var Chance = require('chance');
}

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

var c = new Chance();
var testName = (typeof __dirname !== 'undefined') ? __dirname + '/' : '';
testName += c.string({pool: 'abcsdhoixhodsfkel'});

var testRecord1 = {
  firstname: c.first(),
  lastname: c.last(),
  age: c.age(),
  birthday: c.birthday()
};

this.bourne_test = {
  setUp: function (done) {
    // setup here
    done();
  },
  'can create Bourne instance': function (test) {
    test.expect(1);
    // tests here
    test.doesNotThrow(function () {
      var db = new Bourne(testName, {reset: true});
    });
    test.done();
  },
  }
};
