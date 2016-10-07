'use strict';

const bnet = require('battlenet-api')();
const apikey = require('../cuckbot-auth.json').bnetApiKey;
const util = require('util');
const wowClasses = require('../resources/wow-static-info.json').classes;
const wowRaces = require('../resources/wow-static-info.json').races;
// const superagent = require('superagent');

let WowArmory = {
  'wowarmory': {
    usage: '~wowarmory realm|playername',
    delete: true,
    type: 'battle.net api',
    process: (bot, msg) => {
      let commandOptions = msg.content.split(' ')[1].split('|');
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
      bnet.wow.character.items(params, {apikey}, function (err, body) {
        if (err) {
          console.log(`err: ${util.inspect(err)}`);
          msg.reply(`Something happened when trying to retrieve data, I blame Ben`);
          return;
        }
        let playerItemLvl = body.items.averageItemLevel;
        let playerEqItemLvl = body.items.averageItemLevelEquipped;
        let playerClass = wowClasses.find(c => { return c.id === body.class; }).name;
        let playerRace = wowRaces.find(race => { return race.id === body.race; }).name;
        let baseArmoryUrl = 'http://us.battle.net/wow/character/';
        msg.channel.sendMessage(`__**Player Information**__
        
\`\`\`ldif
Realm: ${body.realm}
Player Name: ${body.name}
Character: ${body.gender === 0 ? 'Male' : 'Female'} ${playerRace} ${playerClass}
Average Item Level: ${playerItemLvl}
Average Equipped Item Level: ${playerEqItemLvl}
\`\`\`

Armory Link: <${baseArmoryUrl}${body.realm}/${body.name}/simple>`);
      });
    }
  }
};

exports.WowArmory = WowArmory;
