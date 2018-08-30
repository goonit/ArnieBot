const CONSTANTS = require('../../constants.js');

import { Message, TextChannel } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';

export class FeelsGoodMan extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'feelsgoodman',
			group: 'images',
			memberName: 'feelsgoodman',
			description: 'Posts a feelsgoodman meme to the channel'
		});
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let channel: TextChannel = msg.channel as TextChannel;

		await msg.delete();

		return channel.send('', { files: [CONSTANTS.FEELSGOODMAN] });
	}
}
