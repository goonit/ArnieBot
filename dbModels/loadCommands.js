'use strict';

const CustomCommandModel = require('../dbModels/customCommand');
const Sounds = require('../sounds.js');
const Images = require('./images.js');
const Ascii = require('./asciiPictures.js');
const Utilities = require('./utilities.js');
const Urban = require('./urban.js');
const CustomCommands = require('./customCommands.js');
const WowArmory = require('./bnet-wow.js');

let loadDbCommands = () => {
	CustomCommandModel.run({ readMode: 'majority' }).then((dbCommands) => {
		let dbCmdObj = {};

		for(let cmd of dbCommands) {
			switch(cmd.commandType) {
				case 'image':
					dbCmdObj[cmd.commandText.slice(1).toString()] = CustomCommands.customCommands.dbimagecommand;
					break;

				case 'text':
					dbCmdObj[cmd.commandText.slice(1).toString()] = CustomCommands.customCommands.dbtextcommand;
					break;

				case 'sound':
					dbCmdObj[cmd.commandText.slice(1).toString()] = CustomCommands.customCommands.dbsoundcommand;
					break;
			}
		}

		const Commands = require('../bot.js').Commands;

		Object.assign(Commands, Images.images, Sounds.sounds, Ascii.asciiPictures, Utilities.utilities, Urban.urban, CustomCommands.customCommands, WowArmory.WowArmory, dbCmdObj);
		console.log('Cuckbot is ready!');
	});
};

exports.loadDbCommands = loadDbCommands;
