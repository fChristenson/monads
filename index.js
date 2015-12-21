'use strict';

var R            = require('ramda');
var add          = require('./utils.js').add;
var Maybe        = require('./maybe.js');
var Either       = require('./either.js');
var IO           = require('./io.js');
var assert       = require('assert');
var readJsonFile = require('./utils.js').readJsonFile;
var toPromise    = require('./utils.js').toPromise;
var lazyFn       = require('./utils.js').lazyFn;
var fs           = require('fs');
var safeJsonRead = require('./utils.js').safeJsonRead;
var readFile     = require('./utils.js').readFile;

describe('Tests', function() {

  describe('Maybe', function() {

    it('should make a maybe', function(done) {

      var result = Maybe.of(1);
      assert.ok(result);
      assert.equal(1, result._val, '_val not 1');
      done();

    });

    describe('isNothing', function() {

      it('should return true for empty types', function(done) {

        var monad1 = Maybe.of(null);
        var monad2 = Maybe.of();
        var monad3 = Maybe.of('');
        var monad4 = Maybe.of({});
        var monad5 = Maybe.of([]);

        assert.ok(monad1.isNothing);
        assert.ok(monad2.isNothing);
        assert.ok(monad3.isNothing);
        assert.ok(monad4.isNothing);
        assert.ok(monad5.isNothing);
        done();

      });

    });

    describe('do', function() {

      it('should return 0', function(done) {

        var monad = Maybe.of();
        var result = Maybe.do(0, add, monad);
        assert.equal(0, result, 'result not 0');
        done();

      });

      it('should return 2', function(done) {

        var monad = Maybe.of(1);
        var result = Maybe.do(0, add(1), monad);
        assert.equal(2, result, 'result not 2');
        done();

      });

      it('should curry', function(done) {

        var monad = Maybe.of(1);
        var add1 = Maybe.do(0, add(1));
        var result = add1(monad);
        assert.equal(2, result, 'result not 2');

        monad = Maybe.of();
        add1 = Maybe.do(0, add(1));
        result = add1(monad);
        assert.equal(0, result, 'result not 0');
        done();

      });

    });

    describe('map', function() {

      it('should map', function(done) {

        var result = Maybe.of(1).map(add(1)).join();
        assert.equal(2, result, 'result not 2');
        done();

      });

    });

    describe('join', function() {

      it('should join', function(done) {

        var result = Maybe.of(1).join();
        assert.equal(1, result, 'result not 1');
        done();

      });

    });

  });

  describe('Either', function() {

    it('should make either', function(done) {

      var either = new Either();
      assert.ok(either, 'either not ok');
      done();

    });

    it('should make a fail case', function(done) {

      var result = Either.fail(0).map(add(1)).join()._val;
      assert.equal(0, result, 'result not 0');
      done();

    });

    it('should make a success case', function(done) {

      var result = Either.success(0).map(add(1)).join();
      assert.equal(1, result, 'result not 1');
      done();

    });

    it('should pick the fail case', function(done) {

      var fail = Either.fail(0);
      var result = Either.do(add(0), add(1), fail);
      assert.equal(0, result, 'result not 0');
      done();

    });

    it('should pick the success case', function(done) {

      var success = Either.success(1);
      var result = Either.do(add(0), add(1), success);
      assert.equal(2, result, 'result not 2');
      done();

    });

  });

  describe('IO', function() {

    it('should make an IO', function(done) {

      var io = new IO();
      assert.ok(io, 'io not ok');
      done();

    });

    describe('doImpureIo', function() {

      it('should do impure action', function(done) {

        var result = IO.of(add(1, 1)).doImpureIo();
        assert.equal(2, result, 'result not 2');
        done();

      });

      it('should do impure action with map', function(done) {

        var result = IO.of(1).map(add(1)).doImpureIo();
        assert.equal(2, result, 'result not 2');
        done();

      });

      it('should read file', function(done) {

        var io = new IO(console.log);
        fs.readFile('./package.json', R.compose(done, io.doImpureIo, safeJsonRead));

      });

      it('should handle read file error', function(done) {

        var io = new IO(console.log);
        readFile(fs.readFile, './fail', R.compose(done, io.doImpureIo, safeJsonRead));

      });

    });

  });

  describe('Promise', function() {

    it('should return a promise', function(done) {

      toPromise(1).then(lazyFn(done));

    });

    it('should compose promise', function(done) {

      var result = R.composeP(lazyFn(done), add(1), toPromise);
      result(1);

    });

  });

});
