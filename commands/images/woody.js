const { Command } = require('discord.js-commando');
const woody = require('../../resources/random.json').rapeywoody;

module.exports = class Woody extends Command {
	constructor(client) {
		super(client, {
			name: 'woody',
			group: 'images',
			memberName: 'woody',
			description: 'Posts a random rapeywoody image to the channel'
		});
	}

	async run(msg) {
		let number = Math.floor(Math.random() * woody.length);
		let channel = msg.channel;
		return msg
			.delete()
			.then(message => channel.send('', { files: [woody[number]] }));
	}
};
