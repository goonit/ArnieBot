"use strict";

const request = require('superagent');
let exports = {};

// Format an amount of time given in seconds to MM:SS format.
exports.formatTime = (seconds) => {
  return `${Math.round((seconds - Math.ceil(seconds % 60)) / 60)}:${String('00' + Math.ceil(seconds % 60)).slice(-2)}`;
};

// Write some data to hastebin
exports.haste = function(data, cb) {
  request.post('http://hastebin.com/documents').send(data).end((error, result) => {
    if (error) {
      console.log('Error during haste: ' + error.stack);
      cb(false);
    } else {
      cb(result.body.key);
    }
  });
};

// Shuffle an array
exports.shuffle = (array) => {
  let counter = array.length;
  let temp;
  let index;

  // While there are elements in the array
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);

    counter--;

    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

module.exports = exports;
