const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const path = require('path');
const fs = require('fs');
const thinky = require('thinky')();
const r = thinky.r;
const auth = require('../../cuckbot-auth.json');

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
					prompt: 'What commands would you like to delete?',
					type: 'string',
					infinite: false
				}
			]
		});
	}

	async run(msg, args) {
		msg.delete().then(m => {
			CustomCommand.filter(r.row('commandText').match(args.command))
				.run({ readMode: 'majority' })
				.then(result => {
					console.log(`result: ${JSON.stringify(result)}`);
					if (result.length > 3) {
						return msg.reply(
							`More than 3 commands were found for the commandText provided. Make sure you have the correct command name.`
						);
					} else if (result.length === 0) {
						return msg.reply(`${args.command} was not found!`);
					}

					result.forEach(command => {
						command
							.delete()
							.then(deleteResult => {
								let cmd = this.client.registry.resolveCommand(
									args.command.slice(1)
								);
								this.client.registry.unregisterCommand(cmd);

								DeleteRecorded.removeFile(
									path.resolve(
										'resources/',
										`${args.command.slice(1)}${msg.guild.id}.mp3`
									)
								);

								m.reply(
									`Recorded command '${args.command}' was successfully deleted`
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
