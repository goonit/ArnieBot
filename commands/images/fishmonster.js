const { Command } = require('discord.js-commando');
const CONSTANTS = require('../../constants.js');

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
		let channel = msg.channel;
		return msg
			.delete()
			.then(message => channel.send('', { files: [CONSTANTS.FISHMONSTER] }));
	}
};
