const CustomCommandModel = require('./customCommand');
const util = require('util');
const ImageCommand = require('../helpers/dbImageCommand.js');
const SoundCommand = require('../helpers/dbSoundCommand.js');
const TextCommand = require('../helpers/dbTextCommand.js');

let loadDbCommands = async client => {
	let dbCommands = await CustomCommandModel.run({ readMode: 'majority' });
	let dbCmdArr = [];

	for (let cmd of dbCommands) {
		cmd.commandText = cmd.commandText.slice(1);

		let command = {};

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
};

exports.loadDbCommands = loadDbCommands;
