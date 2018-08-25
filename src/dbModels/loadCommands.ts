const CustomCommandModel = require('./customCommand');
import SoundCommand from '../helpers/dbSoundCommand';
import ImageCommand from '../helpers/dbImageCommand';
import TextCommand from '../helpers/dbTextCommand';
import { CommandoClient, Command } from 'discord.js-commando';

export async function loadDbCommands(client: CommandoClient) {
	let dbCommands: any[] = await CustomCommandModel.run({
		readMode: 'majority'
	});
	let dbCmdArr: Command[] = [];

	for (let cmd of dbCommands) {
		cmd.commandText = cmd.commandText.slice(1);

		let command: Command;

		switch (cmd.commandType) {
			case 'image':
				try {
					command = new ImageCommand(client, cmd);

					dbCmdArr.push(command);
				} catch (e) {
					console.error('exeption: ', e);
				}

				break;

			case 'text':
				try {
					command = new TextCommand(client, cmd);

					dbCmdArr.push(command);
				} catch (e) {
					console.error('exeption: ', e);
				}

				break;

			case 'sound':
			case 'recorded':
				try {
					command = new SoundCommand(client, cmd);

					dbCmdArr.push(command);
				} catch (e) {
					console.error('exeption: ', e);
				}

				break;
		}
	}

	if (dbCmdArr.length > 0) {
		client.registry.registerGroup('custom');
		client.registry.registerCommands(dbCmdArr);
	}
}
