const CustomCommandModel = require('./customCommand');
// const Sounds = require('../src/sounds.js');
// const Images = require('../src/images.js');
// const Ascii = require('../src/asciiPictures.js');
// const Utilities = require('../src/utilities.js');
// const Urban = require('../src/urban.js');
// const CustomCommands = require('../src/customCommands.js').customCommands;
// const WowArmory = require('../src/bnet-wow.js');
const util = require('util');
const ImageCommand = require('../helpers/dbImageCommand.js');
const SoundCommand = require('../helpers/dbSoundCommand.js');
const TextCommand = require('../helpers/dbTextCommand.js');

let loadDbCommands = async (client) => {
	let dbCommands = await CustomCommandModel.run({ readMode: 'majority' });
	let dbCmdArr = [];

	for(let cmd of dbCommands) {
		cmd.commandText = cmd.commandText.slice(1);

		let command = {};

		switch(cmd.commandType) {
			case 'image':
				command = new ImageCommand(client, cmd);

				dbCmdArr.push(command);
				break;

			case 'text':
				command = new TextCommand(client, cmd);

				dbCmdArr.push(command);
				break;

			case 'sound':
				command = new SoundCommand(client, cmd);

				dbCmdArr.push(command);
				break;
		}
	}

	if(dbCmdArr.length > 0) {
		client.registry.registerGroup('custom');
		client.registry.registerCommands(dbCmdArr);
	}
};

exports.loadDbCommands = loadDbCommands;
