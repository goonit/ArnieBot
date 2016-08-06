"use strict";

//todo: remove me?

const fs = require('fs');

let exports = {
};

const FILENAME = 'cuckbot-config.json';
const AUTHFILENAME = 'cuckbot-auth.json';

// var botHasNickname = true;

let reload = () => {
  try {
    exports = {
      auth: {}
    };

    let parsed = JSON.parse(fs.readFileSync(FILENAME, 'utf8'));

    for (var key in parsed) {
      exports[key] = parsed[key];
    }

    exports.reload = reload;

    let parsed = JSON.parse(fs.readFileSync(AUTHFILENAME, 'utf8'));

    exports.auth = {};

    for (var key in parsed) {
      exports.auth[key] = parsed[key];
    }

    exports.reload = reload;
  } catch (e) {
    if (e.code == 'ENOENT') {
      // File doesn't exist
      console.log(`Error: The file ${e.path} doesn't exist!`);
    } else {
      console.log(e);
    }
  }
};

reload();

module.exports = exports;
