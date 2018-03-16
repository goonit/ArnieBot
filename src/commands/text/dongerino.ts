const dongerino = require('../../resources/dongerinos.json').dongerino;

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';

export class Dongerino extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'dongerino',
			group: 'text',
			memberName: 'dongerino',
			description: 'Posts a random ascii dongerino to the channel'
		});
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let num: number = Math.floor(Math.random() * dongerino.length) as number;

		let channel = msg.channel;
		return msg.delete().then(() => channel.send(dongerino[num]));
	}
}
