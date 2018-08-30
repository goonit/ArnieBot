// const { Command } = require('discord.js-commando');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';
import { ICustomCommand } from './ICustomCommand';

export default class DbTextCommand extends Command {
	public customCommand: ICustomCommand;
	public constructor(client: CommandoClient, cmd: ICustomCommand) {
		super(client, {
			name: cmd.commandText,
			group: 'custom',
			memberName: cmd.commandText,
			description: `Sends a ${cmd.commandText} message in a channel`
		});

		this.customCommand = cmd;
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let channel = msg.channel;

		await msg.delete();

		return channel.send(this.customCommand.commandResponse);
	}
}
