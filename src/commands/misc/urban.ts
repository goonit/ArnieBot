const request = require('superagent-promise')(require('superagent'), Promise);
const Embed = require('discord.js').RichEmbed;

import { Message, TextChannel } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';

const urbanApi = 'http://api.urbandictionary.com/v0/define?term=';

export class Urban extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'urban',
			group: 'misc',
			memberName: 'urban',
			description:
				'Searches urban dictionary for phrase and returns search results',
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

	public async run(
		msg: CommandMessage,
		args: any
	): Promise<Message | Message[]> {
		request('GET', `${urbanApi}${args.searchTerm}`).then(async (json: any) => {
			let result = JSON.parse(json.res.text).list[0];

			if (result === null) {
				return msg.channel.send(
					`\`\`\`\n${args.searchTerm} has no definition!\n\`\`\``
				);
			}

			let embed = new Embed();
			embed.color = 0x00ff00;
			embed.addField(args.searchTerm, result.definition);
			embed.addField('Example', result.example);
			embed.addField('Link', `<${result.permalink}>`);

			let channel: TextChannel = msg.channel as TextChannel;
			channel.send('', embed);
		});

		return await msg.delete();
	}
}
