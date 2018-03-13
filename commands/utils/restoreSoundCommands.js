const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const SoundCommand = require('../../helpers/dbSoundCommand.js');
const fs = require('fs');
const moment = require('moment');
const path = require('path');

const chalk = require('chalk');
const c = new chalk.constructor({ enabled: true });

let channelC = c.green.bold;
let userC = c.cyan.bold;
let warningC = c.yellow.bold;
// let errorC = c.red.bold;
let botC = c.magenta.bold;

module.exports = class RestoreSoundCommands extends Command {
	constructor(client) {
		super(client, {
			name: 'restorecommands',
			group: 'utils',
			memberName: 'restorecommands',
			description:
				'Attempts to restore all custom commands from rethinkDb database.'
		});
	}

	async run(msg) {
		let resourcePath = path.resolve('resources/');

		fs.readdir(resourcePath, (err, files) => {
			let guildId = msg.guild.id;

			if (err) {
				console.log(
					errorC(`There was an error when trying to read the directory: ${err}`)
				);
			}

			files.forEach(file => {
				if (file.includes(guildId)) {
					let idStartIndex = file.indexOf(guildId);
					let commandName = file.substr(0, idStartIndex);

					if (RestoreSoundCommands.commandExists(commandName)) {
						msg.channel.send(`Command '~${commandName}' already exists!`);
					} else {
						let customCmd = new CustomCommand({
							serverId: guildId,
							commandText: `~${commandName}`,
							createDate: moment().format('MM/DD/YYYY hh:mm:ss'),
							createUser: msg.author.username,
							commandType: 'sound'
						});

						customCmd.save().then(result => {
							console.log(
								`${channelC(` # ${msg.channel.name}`)}: ${botC(
									`@CuckBot`
								)} - ${warningC(result.commandText)} was created by ${userC(
									msg.author.username
								)}`
							);

							// Chop off the leading ~ for commando
							customCmd.commandText = customCmd.commandText.slice(1);

							this.client.registry.registerCommand(
								new SoundCommand(this.client, customCmd)
							);

							msg.reply(
								`New command '~${
									customCmd.commandText
								}' was successfully created! '${
									customCmd.commandText
								}' is now ready to be used!`
							);
						});
					}
				}
			});
		});
	}

	static commandExists(trigger, serverId) {
		CustomCommand.filter({ serverId, commandText: trigger })
			.run({ readMode: 'majority' })
			.then(result => result.length > 0);
	}
};
