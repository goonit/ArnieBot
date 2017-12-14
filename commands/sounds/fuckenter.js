const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class FuckEnter extends Command {
  constructor(client) {
    super(client, {
      name: 'fuckenter',
      group: 'sounds',
      memberName: 'fuckenter',
      description: `Play 'Fuck Enter' in voice channel`,
      throttling: {
        usages: 3,
        duration: 7
      }
    });
  }

  async run(msg) {
    let soundArgs = {
      sound: CONSTANTS.FUCKENTER,
      options: {
        quality: 'highest',
        volume: 0.5
      }
    };

    return new PlaySound().run(msg, soundArgs);
  }
};
