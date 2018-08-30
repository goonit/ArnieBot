const CustomCommand = require('../../dbModels/customCommand.js');
const SoundCommand = require('../../helpers/dbSoundCommand.js');
const fs = require('fs');
const moment = require('moment');
const path = require('path');

import { Message, TextChannel } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';
import { ICustomCommand } from '../../helpers/ICustomCommand';

const chalk = require('chalk');
const c = new chalk.constructor({ enabled: true });

let channelC = c.green.bold;
let userC = c.cyan.bold;
let warningC = c.yellow.bold;
let errorC = c.red.bold;
let botC = c.magenta.bold;

export class RestoreSoundCommands extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'restorecommands',
			group: 'utils',
			memberName: 'restorecommands',
			description:
				'Attempts to restore all custom commands from rethinkDb database.'
		});
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let resourcePath: string = path.resolve('resources/');
		let channel: TextChannel = msg.channel as TextChannel;

		await msg.delete();

		fs.readdir(resourcePath, (err: any, files: any[]) => {
			let guildId = msg.guild.id;

			if (err) {
				console.log(
					errorC(`There was an error when trying to read the directory: ${err}`)
				);
				return msg.channel.send(
					`Something went wrong with restoring sound commands. Check logs`
				);
			}

			files.forEach(async (file: any) => {
				if (file.includes(guildId)) {
					let idStartIndex = file.indexOf(guildId);
					let commandName = file.substr(0, idStartIndex);

					if (await this.commandExists(commandName, guildId)) {
						msg.channel.send(`Command '~${commandName}' already exists!`);
					} else {
						let customCmd = new CustomCommand({
							serverId: guildId,
							commandText: `~${commandName}`,
							createDate: moment().format('MM/DD/YYYY hh:mm:ss'),
							createUser: msg.author.username,
							commandType: 'sound'
						});

						let result: any = await customCmd.save();

						console.log(
							`${channelC(` # ${channel.name}`)}: ${botC(
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
					}
				}
			});
		});

		return msg.reply(`Sound Commands were successfully restored!`);
	}

	private async commandExists(
		trigger: string,
		serverId: string
	): Promise<Boolean> {
		let result: ICustomCommand[] = await CustomCommand.filter({
			serverId,
			commandText: trigger
		}).run({ readMode: 'majority' });

		return result.length > 0;
	}
}
