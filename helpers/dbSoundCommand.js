const {Command} = require('discord.js-commando');

module.exports = class DbSoundCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dbSoundCommand',
			group: 'custom',
			memberName: 'dbSoundCommand',
			description: 'Plays a ${customCommandObject.commandText} in a voice channel'
		});
	}

	async run(msg) {
	}
};
