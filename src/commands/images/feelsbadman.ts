const CONSTANTS = require('../../constants.js');

import { Message, TextChannel } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';

export class FeelsBadMan extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'feelsbadman',
			group: 'images',
			memberName: 'feelsbadman',
			description: 'Posts a feelsbadman meme to the channel'
		});
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let channel: TextChannel = msg.channel as TextChannel;
		return msg
			.delete()
			.then(() => channel.send('', { files: [CONSTANTS.FEELSBADMAN] }));
	}
}
