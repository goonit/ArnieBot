const {Command} = require('discord.js-commando');

module.exports = class Urban extends Command {
	constructor(client) {
		super(client, {
			name: 'urban',
			group: 'misc',
			memberName: 'urban',
			description: 'Searches urban dictionary for phrase and returns search results'
		});
	}

	async run(msg) {
	}
};
