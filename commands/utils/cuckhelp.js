const {Command} = require('discord.js-commando');

module.exports = class CuckHelp extends Command {
	constructor(client) {
		super(client, {
			name: 'cuckhelp',
			group: 'utils',
			memberName: 'cuckhelp',
			description: 'Send the user an embed with help information abotu the bot as a dm.'
		});
	}

	async run(msg) {
	}
};
