const { Command } = require('discord.js-commando');
const dongerino = require('../../resources/dongerinos.json').dongerino;

module.exports = class Dongerino extends Command {
	constructor(client) {
		super(client, {
			name: 'dongerino',
			group: 'text',
			memberName: 'dongerino',
			description: 'Posts a random ascii dongerino to the channel'
		});
	}

	async run(msg) {
		let number = Math.floor(Math.random() * dongerino.length);

		let channel = msg.channel;
		return msg.delete().then((message) => channel.sendMessage(dongerino[number]));
	}
};
