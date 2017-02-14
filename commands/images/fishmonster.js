const {Command} = require('discord.js-commando');

module.exports = class FishMonster extends Command {
	constructor(client) {
		super(client, {
			name: 'fishmonster',
			group: 'images',
			memberName: 'fishmonster',
			description: 'Posts a fishmonster image to the channel'
		});
	}

	async run(msg) {
	}
};
