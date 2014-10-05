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
  'can insert record': function (test) {
    test.expect(2);
    var db = new Bourne(testName, {reset: true});
    db.insert(testRecord1, function (err, record) {
      test.equal(testRecord1.firstname, record.firstname, 'names should be equal');
      test.equal(record.id, 1, 'id should be 1');
      test.done();
    })
  },
  'can store record persistently': function (test) {
    var db1 = new Bourne(testName, {reset: true});
    db1.insert(testRecord1, function (err, record) {
      var db2 = new Bourne(testName);
      test.equal(db2.data[0].firstname, testRecord1.firstname, 'names should be equal');

      test.done();
    })
  }
};
