const CustomCommand = require('../../dbModels/customCommand.js');
const path = require('path');
const fs = require('fs');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';

export class DeleteCommand extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'deletecommand',
			group: 'utils',
			memberName: 'deletecommand',
			description:
				'Deletes a command from the database, and removes the associated sound file if its a sound command',
			args: [
				{
					key: 'command',
					label: 'command',
					prompt: 'What command would you like to delete?',
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
		let result: any = await CustomCommand.filter({
			serverId: msg.guild.id,
			commandText: args.command
		}).run({ readMode: 'majority' });

		if (result.length > 0) {
			try {
				let deleteResult: any = await result[0].delete();

				let cmd: Command = this.client.registry.resolveCommand(
					args.command.slice(1)
				);
				this.client.registry.unregisterCommand(cmd);

				if (deleteResult.commandType === 'sound') {
					DeleteCommand.removeFile(
						path.resolve(
							'resources/',
							`${args.command.slice(1)}${msg.guild.id}.mp3`
						)
					);
				}

				msg.reply(`Custom command '${args.command}' was successfully deleted`);
			} catch (err) {
				console.log(`error: ${err}`);
			}
		} else {
			msg.reply(`Command '${args.command}' was not found!`);
		}

		return await msg.delete();
	}

	private static removeFile(file: string) {
		fs.unlinkSync(file);
	}
}
