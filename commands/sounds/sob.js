const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class SOB extends Command {
  constructor(client) {
    super(client, {
      name: 'sob',
      group: 'sounds',
      memberName: 'sob',
      description: `Play 'You Son of a Bitch' in voice channel`,
      throttling: {
        usages: 3,
        duration: 7
      }
    });
  }

  async run(msg) {
    let soundArgs = {
      sound: CONSTANTS.SOB,
      options: {
        quality: 'highest',
        volume: 0.5
      }
    };

    return new PlaySound().run(msg, soundArgs);
  }
};
