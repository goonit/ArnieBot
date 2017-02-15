const { Command } = require('discord.js-commando');
const request = require('superagent-promise')(require('superagent'), Promise);

const urbanApi = 'http://api.urbandictionary.com/v0/define?term=';

module.exports = class Urban extends Command {
	constructor(client) {
		super(client, {
			name: 'urban',
			group: 'misc',
			memberName: 'urban',
			description: 'Searches urban dictionary for phrase and returns search results',
			args: [
				{
					key: 'searchTerm',
					label: 'searchTerm',
					prompt: 'What would you like to search Urban Dictionary for?',
					type: 'string',
					infinite: false
				}
			]
		});
	}

	async run(msg, args) {
		request('GET', `${urbanApi}${args.searchTerm}`).then(json => {
			let result = JSON.parse(json.res.text).list[0];

			if(result === null) {
				msg.channel.sendMessage(`\`\`\`\n${args.searchTerm} has no definition!\n\`\`\``);
				return;
			}

			let response = `**${args.searchTerm}**\n\n\`\`\`\n${result.definition}\n\`\`\`\n\n**Example:** ${result.example}\n<${result.permalink}>`;

			let channel = msg.channel;
			return msg.delete().then((message) => channel.sendMessage(response));
		});
	}
};
