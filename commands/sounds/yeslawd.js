const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class YesLawd extends Command {
  constructor(client) {
    super(client, {
      name: 'yeslawd',
      group: 'sounds',
      memberName: 'yeslawd',
      description: `Play 'Yes Lawd' in voice channel`,
      throttling: {
        usages: 3,
        duration: 7
      }
    });
  }

  async run(msg) {
    let soundArgs = {
      sound: CONSTANTS.YESLAWD,
      options: {
        quality: 'highest',
        volume: 0.5
      }
    };

    return new PlaySound().run(msg, soundArgs);
  }
};
