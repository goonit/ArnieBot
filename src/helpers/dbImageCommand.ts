// const { Command } = require('discord.js-commando');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';

export class DBImageCommand extends Command {
	public customCommand: any;
	public constructor(client: CommandoClient, customCommandObject: any) {
		super(client, {
			name: customCommandObject.commandText,
			group: 'custom',
			memberName: customCommandObject.commandText,
			description: `Posts a ${
				customCommandObject.commandText
			} image to the chat`,
			throttling: {
				usages: 2,
				duration: 7
			}
		});

		this.customCommand = customCommandObject;
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let channel = msg.channel;
		return msg
			.delete()
			.then(() => channel.send('', { files: [this.customCommand.imageUrl] }));
	}
}
