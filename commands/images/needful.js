const { Command } = require('discord.js-commando');
const CONSTANTS = require('../../constants.js');

module.exports = class Needful extends Command {
  constructor(client) {
    super(client, {
      name: 'needful',
      group: 'images',
      memberName: 'needful',
      description: 'Posts a do the needful image to the channel'
    });
  }

  async run(msg) {
    let channel = msg.channel;
    return msg.delete().then(message => channel.send('', CONSTANTS.NEEDFUL));
  }
};
