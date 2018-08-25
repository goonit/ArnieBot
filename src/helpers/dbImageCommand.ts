// const { Command } = require('discord.js-commando');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';
import { ICustomCommand } from './ICustomCommand';

export default class DBImageCommand extends Command {
	public customCommand: ICustomCommand;
	public constructor(client: CommandoClient, cmd: ICustomCommand) {
		super(client, {
			name: cmd.commandText,
			group: 'custom',
			memberName: cmd.commandText,
			description: `Posts a ${cmd.commandText} image to the chat`,
			throttling: {
				usages: 2,
				duration: 7
			}
		});

		this.customCommand = cmd;
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let channel = msg.channel;
		return msg
			.delete()
			.then(() => channel.send('', { files: [this.customCommand.imageUrl] }));
	}
}
