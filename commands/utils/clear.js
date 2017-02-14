const {Command} = require('discord.js-commando');

module.exports = class Clear extends Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			group: 'utils',
			memberName: 'clear',
			description: 'Clears x messages from the channel'
		});
	}

	async run(msg) {
	}
};
