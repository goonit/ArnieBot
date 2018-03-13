const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const path = require('path');
const fs = require('fs');
const thinky = require('thinky')();
const rql = thinky.r;

module.exports = class DeleteRecorded extends Command {
	constructor(client) {
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

	async run(msg, args) {
		msg.delete().then(() => {
			CustomCommand.filter(
				rql
					.row('commandText')
					.match(args.command)
					.and(rql.row('commandType').eq('recorded'))
			)
				.run({ readMode: 'majority' })
				.then(result => {
					console.log(`result: ${JSON.stringify(result)}`);
					if (result.length !== 3) {
						return msg.reply(
							`Expected 3 commands to be found, ${
								result.length
							} commands were found to be associated with that name.`
						);
					}

					result.forEach(command => {
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

								msg.reply(
									`Recorded command '${commandName}' was successfully deleted`
								);
							})
							.catch(err => {
								console.log(`error: ${err}`);
							});
					});
				});
		});
	}

	static removeFile(file) {
		fs.unlinkSync(file);
	}
};
