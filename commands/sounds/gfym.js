const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class GFYM extends Command {
  constructor(client) {
    super(client, {
      name: 'gfym',
      group: 'sounds',
      memberName: 'gfym',
      description: `Play the worst sound of all time in voice channel`,
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  async run(msg) {
    let soundArgs = {
      sound: CONSTANTS.GFYM,
      options: {
        quality: 'highest',
        volume: 0.5
      }
    };

    return new PlaySound().run(msg, soundArgs);
  }
};
