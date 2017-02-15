const { Command } = require('discord.js-commando');
const CONSTANTS = require('../../constants.js');

module.exports = class FinishMe extends Command {
	constructor(client) {
		super(client, {
			name: 'finishme',
			group: 'images',
			memberName: 'finishme',
			description: 'Posts a finishme image to the channel'
		});
	}

	async run(msg) {
		let channel = msg.channel;
		return msg.delete().then((message) => channel.sendFile(CONSTANTS.FINISHME));
	}
};
