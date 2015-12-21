'use strict';

var R = require('ramda');

function IO (fn) {

  this.doImpureIo = fn;

}

IO.of = function(val) {

  return new IO(function() {

    return val;

  });

};

IO.prototype.map = function(fn) {

  return new IO(R.compose(fn, this.doImpureIo));

};

module.exports = IO;
