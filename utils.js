'use strict';

var fs        = require('fs');
var Either    = require('./either.js');
var BbPromise = require('bluebird');
var R         = require('ramda');

// safeReturn :: Error a->b->Either a b
var safeReturn = function(err, val) {

  return (!!err) ? Either.fail(err) : Either.success(val);

};

// stringifyJson :: Number a->b->c
var stringifyJson= R.curry(function(spaces, val) {

  return JSON.stringify(val, null, spaces);

});

// safeJsonParse :: a->Either b
var safeJsonParse = function(val) {

  var json;

  try {

    json = JSON.parse(val);
    return Either.success(json);

  } catch (err) {

    return Either.fail(err);

  }

};

// debug :: a->b->b
var debug = R.curry(function(label, val) {

  console.log(label, val);
  return val;

});

// chain :: (_)->Monad a->b
var chain = R.curry(function(fn, monad) {

  return monad.map(fn).join();

});

// join :: Monad a->b
var join = function(monad) {

  return monad._val;

};

// map :: (_)->Monad a->Monad b
var map = R.curry(function(fn, monad) {

  return monad.map(fn);

});

// makeError :: a->Error b
var makeError = function(val) {

  return new Error(val);

};

// readFile :: (Path a->(Error b->c))->Path a->(Error b->c)->_
var readFile = R.curry(function(read, file, cb) {

  return read(file, cb);

});

// safeJsonRead :: Error a->b->c
var safeJsonRead = R.compose(

  Either.do(makeError, stringifyJson(2)),
  Either.do(Either.fail, safeJsonParse),
  safeReturn

);

// add :: a->b->c
var add = R.curry(function(a, b) {

  return a + b;

});

// toPromise :: a->Promise a
var toPromise = BbPromise.resolve;

// lazyFn :: (_)->(_)
var lazyFn = function(cb) {

  return function() {

    return cb();

  };

};

// freeze :: Object a->Frozen a
var freeze = function(object) {

  return Object.freeze(object);

};

module.exports.readFile =      readFile;
module.exports.freeze =        freeze;
module.exports.lazyFn =        lazyFn;
module.exports.toPromise =     toPromise;
module.exports.debug =         debug;
module.exports.safeJsonParse = safeJsonParse;
module.exports.safeReturn =    safeReturn;
module.exports.stringifyJson = stringifyJson;
module.exports.chain =         chain;
module.exports.join =          join;
module.exports.map =           map;
module.exports.makeError =     makeError;
module.exports.safeJsonRead =  safeJsonRead;
module.exports.add =           add;
