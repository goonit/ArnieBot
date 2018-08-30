const CustomCommand = require('../../dbModels/customCommand.js');
const path = require('path');
const fs = require('fs');
const thinky = require('thinky')();
const rql = thinky.r;

import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';
import { Message } from 'discord.js';

export class DeleteRecorded extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'deleterecorded',
			group: 'utils',
			memberName: 'deleterecorded',
			description:
				"Deletes a recorded command from the database (and it's -slow/-fast variations, and removes the associated sound files from the server",
			args: [
				{
					key: 'command',
					label: 'command',
					prompt: 'What recorded commands would you like to delete?',
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
		let result: any[] = await CustomCommand.filter(
			rql
				.row('commandText')
				.match(args.command)
				.and(rql.row('commandType').eq('recorded'))
		).run({ readMode: 'majority' });

		console.log(`result: ${JSON.stringify(result)}`);
		if (result.length !== 3) {
			return msg.reply(
				`Expected 3 commands to be found, ${
					result.length
				} commands were found to be associated with that name.`
			);
		}

		result.forEach(async (command: any) => {
			let commandName = command.commandText;
			let commandNameNoTrigger = command.commandText.slice(1);

			try {
				await command.delete();

				let cmd: Command = this.client.registry.resolveCommand(
					commandNameNoTrigger
				);
				this.client.registry.unregisterCommand(cmd);

				DeleteRecorded.removeFile(
					path.resolve(
						'resources/',
						`${commandNameNoTrigger}${msg.guild.id}.mp3`
					)
				);

				return msg.reply(
					`Recorded command '${commandName}' was successfully deleted`
				);
			} catch (err) {
				console.log(`error: ${err}`);
				return msg.reply(
					`There was a problem when attempting to delete the ${
						command.commandText
					} command.`
				);
			}
		});

		return await msg.delete();
	}

	private static removeFile(file: string): void {
		fs.unlinkSync(file);
	}
}
