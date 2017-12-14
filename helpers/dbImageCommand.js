const { Command } = require('discord.js-commando');
const util = require('util');

module.exports = class DBImageCommand extends Command {
  constructor(client, customCommandObject) {
    super(client, {
      name: customCommandObject.commandText,
      group: 'custom',
      memberName: customCommandObject.commandText,
      description: `Posts a ${
        customCommandObject.commandText
      } image to the chat`,
      throttling: {
        usages: 2,
        duration: 7
      }
    });

    this.customCommand = customCommandObject;
  }

  async run(msg) {
    let channel = msg.channel;
    return msg
      .delete()
      .then(message => channel.send('', this.customCommand.imageUrl));
  }
};
