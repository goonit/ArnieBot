'use strict';

const bnet = require('battlenet-api')();
const apikey = require('../cuckbot-auth.json').bnetApiKey;
const util = require('util');
// const superagent = require('superagent');

let WowArmory = {
  'wowarmory': {
    usage: '~wowarmory realm|playername',
    delete: true,
    type: 'battle.net api',
    process: (bot, msg) => {
      let commandOptions = msg.split(' ')[1].split('|');
      if (commandOptions.length > 2 || commandOptions.length < 2) {
        msg.reply(`Incorrect number of parameters passed into the command. Correct usage: ${this.usage}`);
        return;
      }

      let realm = commandOptions[0];
      let name = commandOptions[1];

      let params = {
        origin: 'us',
        realm,
        name
      };
      bnet.wow.character.profile(params, {apikey}, function (err, body, res) {
        if (err) {
          console.log(`err: ${util.inspect(err)}`);
        }
        console.log(util.inspect(body));
      });
    }
  }
};

exports.WowArmory = WowArmory;
