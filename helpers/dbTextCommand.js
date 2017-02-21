const { Command } = require('discord.js-commando');

module.exports = class DbTextCommand extends Command {
	constructor(client, customCommandObject) {
		super(client, {
			name: customCommandObject.commandText,
			group: 'custom',
			memberName: customCommandObject.commandText,
			description: `Sends a ${customCommandObject.commandText} message in a channel`
		});

		this.customCommand = customCommandObject;
	}

	async run(msg) {
		let channel = msg.channel;
		return msg.delete().then((message) => channel.sendMessage(this.customCommand.commandResponse));
	}
};
