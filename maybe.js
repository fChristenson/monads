'use strict';

var R = require('ramda');

// Maybe :: a->Maybe a
function Maybe(val) {

  this._val = val;

}

Maybe.prototype.map = function(fn) {

  return this.isNothing() ? new Maybe() : new Maybe(fn(this._val));

};

Maybe.prototype.isNothing = function() {

  if (typeof this._val === 'object') {

    return this._val.length < 1;

  } else {

    return this._val === null || this._val === undefined || this._val === '';

  }

};

Maybe.of = function(val) {

  return new Maybe(val);

};

Maybe.prototype.join = function() {

  return this.isNothing() ? new Maybe() : this._val;

};

Maybe.prototype.ap = function(otherMonad) {

  return otherMonad.map(this._val);

};

Maybe.prototype.inspect = function() {

  return 'Maybe(' + this._val + ')';

};

// do :: a->(a->b)->Monad b->c
Maybe.do = R.curry(function(val, fn, monad) {

  return monad.isNothing() ? val : fn(monad._val);

});

module.exports = Maybe;
