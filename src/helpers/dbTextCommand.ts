// const { Command } = require('discord.js-commando');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';

export class DbTextCommand extends Command {
	public customCommand: any;
	public constructor(client: CommandoClient, customCommandObject: any) {
		super(client, {
			name: customCommandObject.commandText,
			group: 'custom',
			memberName: customCommandObject.commandText,
			description: `Sends a ${
				customCommandObject.commandText
			} message in a channel`
		});

		this.customCommand = customCommandObject;
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let channel = msg.channel;
		return msg
			.delete()
			.then(() => channel.send(this.customCommand.commandResponse));
	}
}
