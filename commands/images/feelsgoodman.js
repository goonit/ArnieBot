const { Command } = require('discord.js-commando');
const CONSTANTS = require('../../constants.js');

module.exports = class FeelsGoodMan extends Command {
	constructor(client) {
		super(client, {
			name: 'feelsgoodman',
			group: 'images',
			memberName: 'feelsgoodman',
			description: 'Posts a feelsgoodman meme to the channel'
		});
	}

	async run(msg) {
		let channel = msg.channel;
		return msg
			.delete()
			.then(message => channel.send('', { files: [CONSTANTS.FEELSGOODMAN] }));
	}
};
