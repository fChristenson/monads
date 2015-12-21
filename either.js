'use strict';

var R = require('ramda');

// Left
function Left(val) {

  this._val = val;

}

Left.of = function(val) {

  return new Left(val);

};

Left.prototype.map = function() {

  return this;

};

Left.prototype.join = function() {

  return this;

};

Left.prototype.inspect = function() {

  return 'Left(' + this._val + ')';

};

// Right
function Right(val) {

  this._val = val;

}

Right.of = function(val) {

  return new Right(val);

};

Right.prototype.map = function(fn) {

  return Right.of(fn(this._val));

};

Right.prototype.join = function() {

  return this._val;

};

Right.prototype.inspect = function() {

  return 'Right(' + this._val + ')';

};

// Either
function Either () {

}

Either.do = R.curry(function(fn1, fn2, either) {

  switch (either.constructor.name) {

    case 'Left':
      return fn1(either._val);

    case 'Right':
      return fn2(either._val);

  }

});

Either.fail = function(val) {

  return new Left(val);

};

Either.success = function(val) {

  return new Right(val);

};

module.exports = Either;
