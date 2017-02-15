const { Command } = require('discord.js-commando');

module.exports = class Lenny extends Command {
	constructor(client) {
		super(client, {
			name: 'lenny',
			group: 'text',
			memberName: 'lenny',
			description: 'Posts a lenny face to the channel',
			details: 'see description',
		});
	}

	async run(msg) {
		let channel = msg.channel;
		return msg.delete().then((message) => channel.sendMessage('( ͡° ͜ʖ ͡°)'));
	}
};
