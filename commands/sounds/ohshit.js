const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class OhShit extends Command {
  constructor(client) {
    super(client, {
      name: 'ohshit',
      group: 'sounds',
      memberName: 'ohshit',
      description: `Play 'Oh Shit' in voice channel`,
      throttling: {
        usages: 3,
        duration: 7
      }
    });
  }

  async run(msg) {
    let soundArgs = {
      sound: CONSTANTS.OHSHIT,
      options: {
        quality: 'highest',
        volume: 0.5
      }
    };

    return new PlaySound().run(msg, soundArgs);
  }
};
