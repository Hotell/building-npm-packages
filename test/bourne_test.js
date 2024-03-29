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
}, testRecord2 = {
  firstname: c.first(),
  lastname: c.last(),
  age: c.age(),
  birthday: c.birthday()
}, testRecord3 = {
  firstname: c.first(),
  lastname: c.last(),
  age: c.age(),
  birthday: c.birthday()
};

this.bourne_test = {
  setUp: function (done) {
    // setup here
    var db = this.db = new Bourne(testName, {reset: true});
    db.insert(testRecord1, function () {
      db.insert(testRecord2, function () {
        db.insert(testRecord3, done);
      });
    });
  },
  tearDown: function(done){
    this.db.destroy();
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
  },
  'find records by one key': function (test) {
    this.db.find({firstname: testRecord1.firstname}, function (err, records) {
      test.equal(records.length, 1, 'should find one record');
      test.equal(records[0].firstname, testRecord1.firstname, 'names should equal');
      test.done();
    })
  },
  'find records by multiple keys': function (test) {
    this.db.find({firstname: testRecord1.firstname, age: testRecord1.age}, function (err, records) {
      test.equal(records.length, 1, 'should find one record');
      test.equal(records[0].age, testRecord1.age, 'names should equal');
      test.done();
    })
  },
  'can find multiple records': function (test) {
    var r = {firstname: testRecord1.firstname, age: c.age()};

    var db = this.db;
    db.insert(r, function (err, records) {
      db.find({firstname: testRecord1.firstname}, function (err, records) {
        test.equal(records.length, 2, '2 records should be found');
        test.done();
      });
    });
  },
  'can use query operators': function (test) {
    var r = {firstname: c.first(), age: 10};
    var db = this.db;

    db.insert(r, function (err, records) {
      db.find({age: {$lt: 11}}, function (err, records) {
        test.notEqual(records.length, 0, 'should have at least 1 record');
        test.done();
      });

    });
  },
  'query operators': {
    '$lt': function (test) {
      operatorTest({age: 10}, {age: {$lt: 11}}, function (err, records) {
        test.notEqual(records.length, 0, 'should have at least 1 record');
        test.done();
      });
    },
    '$gt': function (test) {
      operatorTest({age: 10}, {age: {$gt: 9}}, function (err, records) {
        test.notEqual(records.length, 0, 'should have at least 1 record');
        test.done();
      });
    },
    '$lte': function (test) {
      operatorTest({age: 10}, {age: {$lte: 10}}, function (err, records) {
        test.notEqual(records.length, 0, 'should have at least 1 record');
        test.done();
      });
    },
    'multiple operators': function (test) {
      operatorTest({age: 10}, {age: {$lt: 11, $gt: 9}}, function (err, records) {
        test.notEqual(records.length, 0, 'should have at least 1 record');
        test.done();
      });
    }
  },
  'can register custom query operators': function (test) {
    Bourne.operator('$in', function (key, values, record) {
      for (var i = 0; i < values.length; i++) {
        if (record[key] === values[i]) {
          return true;
        }
      }
    });

    this.db.find({firstname: {$in: [testRecord1.firstname, testRecord2.firstname]}}, function (err, records) {
      test.equal(records.length, 2, 'should receive 2 records');
      test.done();
    });
  },
  'can find a single record': function (test) {
    this.db.findOne({firstname: testRecord1.firstname}, function (err, record) {
      test.equal(record.firstname, testRecord1.firstname, 'names should be equal');
      test.done();
    })
  },
  'can find all records': function (test) {
    this.db.find(function (err, records) {
      test.equal(records.length, 3, 'should find 3 records');
      test.done();
    });
  },
  'can update records': function (test) {
    this.db.update({firstname: testRecord1.firstname}, {age: 200}, function (err, records) {
      test.equal(records[0].age, 200, 'age should be updated');
      test.done();
    });
  },
  'can delete records': function (test) {
    var db = this.db;
    db.delete({firstname: testRecord1.firstname}, function () {
      db.find({firstname: testRecord1.firstname}, function (err, records) {
        test.equal(records.length, 0, 'no records should be found');
        test.done();
      });
    });
  }
};

function operatorTest(record, query, cb) {
  var db = new Bourne(testName, {reset: true});
  db.insert(record, function () {
    db.find(query, cb);
  });
}
