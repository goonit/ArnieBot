const { Command } = require('discord.js-commando');

module.exports = class Clear extends Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			group: 'utils',
			memberName: 'clear',
			description: 'Clears x messages from the channel',
			args: [
				{
					key: 'clearnum',
					label: 'clearnum',
					prompt: 'How many messages would you like to remove from chat?',
					type: 'integer',
					default: 1,
					infinite: false
				}
			]
		});
	}

	async run(msg, args) {
		let deleteNum = args.clearnum + 1;

		msg.channel.fetchMessages({ limit: deleteNum }).then(messages => {
			msg.channel.bulkDelete(messages);
		});
	}
};
