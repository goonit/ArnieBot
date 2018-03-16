// const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const path = require('path');
const fs = require('fs');
const thinky = require('thinky')();
const rql = thinky.r;

// import { Message } from 'discord.js';
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
		CustomCommand.filter(
			rql
				.row('commandText')
				.match(args.command)
				.and(rql.row('commandType').eq('recorded'))
		)
			.run({ readMode: 'majority' })
			.then((result: any) => {
				console.log(`result: ${JSON.stringify(result)}`);
				if (result.length !== 3) {
					return msg.reply(
						`Expected 3 commands to be found, ${
							result.length
						} commands were found to be associated with that name.`
					);
				}

				result.forEach((command: any) => {
					let commandName = command.commandText;
					let commandNameNoTrigger = command.commandText.slice(1);

					command
						.delete()
						.then(() => {
							let cmd = this.client.registry.resolveCommand(
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
						})
						.catch((err: any) => {
							console.log(`error: ${err}`);
							return msg.reply('');
						});
				});
			});

		return await msg.delete();
	}

	private static removeFile(file: any): void {
		fs.unlinkSync(file);
	}
}
