const {Command} = require('discord.js-commando');

module.exports = class FinishMe extends Command {
	constructor(client) {
		super(client, {
			name: 'finishme',
			group: 'images',
			memberName: 'finishme',
			description: 'Posts a 'finishme' image to the channel'
		});
	}

	async run(msg) {
	}
};
