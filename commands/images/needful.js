const {Command} = require('discord.js-commando');

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
	}
};
