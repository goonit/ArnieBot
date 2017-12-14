const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class Dinos extends Command {
  constructor(client) {
    super(client, {
      name: 'dinos',
      group: 'sounds',
      memberName: 'dinos',
      description: `Play 'Who killed the dinos' in voice channel`,
      throttling: {
        usages: 3,
        duration: 7
      }
    });
  }

  async run(msg) {
    let soundArgs = {
      sound: CONSTANTS.DINOS,
      options: {
        quality: 'highest',
        volume: 0.5
      }
    };

    return new PlaySound().run(msg, soundArgs);
  }
};
