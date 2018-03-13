const { Command } = require('discord.js-commando');
const CONSTANTS = require('../../constants.js');

module.exports = class FeelsBadMan extends Command {
	constructor(client) {
		super(client, {
			name: 'feelsbadman',
			group: 'images',
			memberName: 'feelsbadman',
			description: 'Posts a feelsbadman meme to the channel'
		});
	}

	async run(msg) {
		let channel = msg.channel;
		return msg
			.delete()
			.then(() => channel.send('', { files: [CONSTANTS.FEELSBADMAN] }));
	}
};
