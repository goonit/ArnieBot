const CONSTANTS = require('../../constants.js');

import { Message, TextChannel } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';

export class Needful extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'needful',
			group: 'images',
			memberName: 'needful',
			description: 'Posts a do the needful image to the channel'
		});
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let channel: TextChannel = msg.channel as TextChannel;

		await msg.delete();

		return channel.send('', { files: [CONSTANTS.NEEDFUL] });
	}
}
