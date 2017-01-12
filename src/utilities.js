'use strict';

const CustomCommand = require('../dbModels/customCommand.js');
const admins = require('../admins.json');
const _ = require('lodash');
const sounds = require('./sounds.js').sounds;
const Embed = require('discord.js').RichEmbed;
const images = require('./images.js').images;
const asciiText = require('./asciiPictures').asciiPictures;

let buildCommandsHelp = (imageCommands, textCommands, soundCommands) => {
	let embed = new Embed();

	embed.title = 'Cuckbot Commands';
	embed.color = 0x4286f4;

	let allTextCommands = [];
	if(textCommands.length > 0) {
		let customTextCommands = textCommands.map((customText) => customText.commandText.slice(1));

		allTextCommands = customTextCommands.concat(Object.keys(asciiText));

		embed.addField('Text Commands', allTextCommands.join(', '), false);
	}

	let allImageCommands = [];
	if(imageCommands.length > 0) {
		let customImageCommands = imageCommands.map((customImage) => customImage.commandText.slice(1));

		allImageCommands = customImageCommands.concat(Object.keys(images));

		embed.addField('Image Commands', allImageCommands.join(', '), false);
	}

	let allSoundsText = [];
	if(soundCommands.length > 0) {
		let customSoundsText = soundCommands.map((customSound) => customSound.commandText.slice(1));

		allSoundsText = customSoundsText.concat(Object.keys(sounds));

		embed.addField('Sound Commands', allSoundsText.join(', '), false);
	}

	return embed;
};

let buildCreationHelp = () => {
	let creatingCommands = 'For creating commands, use the following format:\n' +
		'*~createcommand ~[commandname]|[commandtype (image, text, sound)]|[imageurl, text, yturl]|[starttime (format: 00:00:00)]|[duration (seconds)*\n' +
		'Ex:\t\t*~createcommand ~test|sound|<youtube link>|00:00:43|07*\n' +
		'\t\t*~createcommand ~imagetest|image|http://i.imgur.com/kTRCbX0.gif*';

	let deletingCommands = '*~deletecommand ~[commandname]*\n' +
		'Ex:\t\t*~deletecommand ~facepalm*';

	let embed = new Embed();

	embed.title = 'Cuckbot Commands';
	embed.color = 0x4286f4;
	embed.addField('Prefix', 'Command prefix (trigger) character is \'~\'', false);
	embed.addField('Creating Custom Commands', creatingCommands, false);
	embed.addField('Deleting Commands', deletingCommands, false);

	return embed;
};

let utilities = {
	cuckhelp: {
		usage: '~cuckhelp',
		delete: false,
		type: 'utilities',
		process: (bot, msg, suffix) => {
			if(suffix.length === 0) {
				return msg.reply(`To view a list of current commands, type '~cuckhelp commands'. For help with creating commands, type '~cuckhelp creation'`)
					.then((message) => {
						message.delete(10000);
					});
			}

			let args = suffix.split(' ');

			CustomCommand.filter({ serverId: msg.guild.id }).run({ readMode: 'majority' }).then((result) => {
				let imageCommands = result.filter((cmd) => cmd.commandType === 'image');
				let textCommands = result.filter((cmd) => cmd.commandType === 'text');
				let soundCommands = result.filter((cmd) => cmd.commandType === 'sound');
				let embed = {};

				if(args[0] === 'commands') {
					embed = buildCommandsHelp(imageCommands, textCommands, soundCommands);
				} else if(args[0] === 'creation') {
					embed = buildCreationHelp();
				} else {
					msg.reply(`That help command is not supported`);
				}

				return msg.author.sendEmbed(embed).then(() => {
					msg.reply(`Check your DM's`);
				}).catch(err => {
					console.log(err);
				});
			});
		}
	},
	clear: {
		usage: '~clear (number of messages to remove from the chat log)',
		delete: true,
		type: 'utilities',
		process: (bot, msg, suffix) => {
			let args = suffix.split(' ');

			let adminsArray = Array.from(admins.admins);

			if(!_.includes(adminsArray, msg.author.id.toString())) {
				msg.reply('You don\'t have access to this command.  :middle_finger:');
				return;
			}

			console.log(`commandOptions: ${suffix}`);
			if(args.length > 2) {
				msg.reply('Incorrect usage! There are too many parameters for that command.');
				return;
			}

			let numberToDelete = Number(args[0]);

      // there was a user mentioned, so we delete that specific users messages.
			if(args.length === 2) {
				let user = msg.mentions.users.first();
				let counter = 0;
				msg.channel.fetchMessages({ limit: numberToDelete * 3 }).then(messages => {
					let deleteMessages = messages.filter(message => counter < numberToDelete && user.id === message.author.id);

					msg.channel.bulkDelete(deleteMessages).then(msgs => {
						console.log(`Removed the last ${msgs.size()} messages from ${user.username}`);
					});
				});
			} else { // do a regular bulk delete
				msg.channel.fetchMessages({ limit: numberToDelete }).then(messages => {
					msg.channel.bulkDelete(messages);
				});
			}
		}
	},
	reloadcommands: {
		usage: '~reloadcommands',
		delete: true,
		type: 'utilities',
		process: () => {
			const loadDbCommands = require('./loadDbCommands.js').loadDbCommands;

			loadDbCommands();
		}
	}
};

exports.utilities = utilities;
