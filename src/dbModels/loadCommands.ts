const CustomCommandModel = require('./customCommand');
const ImageCommand = require('../helpers/dbImageCommand.js');
const SoundCommand = require('../helpers/dbSoundCommand.js');
const TextCommand = require('../helpers/dbTextCommand.js');
import { CommandoClient, Command } from 'discord.js-commando';

export async function loadDbCommands(client: CommandoClient) {
	let dbCommands: any[] = await CustomCommandModel.run({
		readMode: 'majority'
	});
	let dbCmdArr: Command[] = [];

	for (let cmd of dbCommands) {
		cmd.commandText = cmd.commandText.slice(1);

		let command: any = {};

		switch (cmd.commandType) {
			case 'image':
				command = new ImageCommand(client, cmd);

				dbCmdArr.push(command);
				break;

			case 'text':
				command = new TextCommand(client, cmd);

				dbCmdArr.push(command);
				break;

			case 'sound':
			case 'recorded':
				command = new SoundCommand(client, cmd);

				dbCmdArr.push(command);
				break;
		}
	}

	if (dbCmdArr.length > 0) {
		client.registry.registerGroup('custom');
		client.registry.registerCommands(dbCmdArr);
	}
}
