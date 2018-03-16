const woody = require('../../resources/random.json').rapeywoody;

import { Message, TextChannel } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';

export class Woody extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'woody',
			group: 'images',
			memberName: 'woody',
			description: 'Posts a random rapeywoody image to the channel'
		});
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let num: number = Math.floor(Math.random() * woody.length);
		let channel: TextChannel = msg.channel as TextChannel;

		return msg.delete().then(() => channel.send('', { files: [woody[num]] }));
	}
}
