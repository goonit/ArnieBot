'use strict';

const CustomCommand = require('../dbModels/customCommand.js');
const admins = require('../admins.json');
const _ = require('lodash');
// const pad = require('pad-right');
const sounds = require('./sounds.js').sounds;
// const images = require('./images.js').images;
// const asciiText = require('./asciiPictures').asciiPictures;
// const util = require('util');
// const AsciiTable = require('ascii-table');

let columnify = (arr, cols, fields, type) => {
  // const maxChars = 77; // maximum character count per line before wrapping occurs for embeds.

  // const columnWidth = Math.floor(maxChars / cols);

	let counter = 1;
  // let returnString = '';
  // let table = new AsciiTable();
  // let tableRow = [];
  // let fields = [];
	cols += 1;
	for(let ele of arr) {
		console.log(`counter: ${counter}`);
		counter++;
		if(arr.indexOf(ele) === 0) {
			fields.push({ name: type, value: ele, inline: true });
		} else {
			fields.push({ name: '\u200b', value: ele, inline: true });
		}
    // if (counter % cols === 0) {
    //   fields.push(tableRow);
    //   tableRow = [];
    // }
    // console.log(`ele: ${ele}     length: ${ele.length}`);
    // tableRow.push(ele);
    // let padded = pad(ele, columnWidth, ' ');
    // returnString += padded;
    // if (counter % 5 === 0) {
      // console.log(`tableRow: ${tableRow}`);
      // table.addRow(tableRow);
      // tableRow = [];
      // returnString += '\n';
    // }
	}
  // return returnString;
};

let buildHelpMessage = (imageCommands, textCommands, soundCommands) => {
	let creatingCommands = '*~createcommand ~[commandname]|[commandtype (image, text, sound)]|[imageurl, text, yturl]|[starttime (format: 00:00:00)]|[duration (seconds)*\n' +
    'Ex:\t\t\t*~createcommand ~test|sound|<youtube link>|00:00:43|07*\n' +
    '\t\t\t*~createcommand ~imagetest|image|http://i.imgur.com/kTRCbX0.gif*';

	let deletingCommands = '*~deletecommand ~[commandname]*\n' +
    'Ex:    *~deletecommand ~facepalm*';

  // let defaultSounds = 'cena: BOO-DO-DO-DOOOOOO\n' +
  //   'cenahorn: BOO-DO-DO-DOOOOOO (with airhorns)\n' +
  //   'yeslawd: YES LAWD\n' +
  //   'yesnigga: YES NIGGA\n' +
  //   'watermalone: Random \'watermalone\' \n' +
  //   'asslick/dickpunch/fuckenter: John Cena Quotes From \'Trainwreck\'\n' +
  //   'pawnch: Heavys Falcon Punch (TF2)\n' +
  //   'ohshit: Oh Shiiiiiiit\n' +
  //   'sob: \'You Son Of A Bitch\'\n' +
  //   'dinos: \'Who Killed The Dinos?\'\n' +
  //   'fua: \'Fuck You Asshole\'\n' +
  //   'spine: \'Break Your God Damn Spine\'\n' +
  //   'stfu: \'SHUT UP\'\n' +
  //   'boris: \'I Am INVINCIBLE\'\n' +
  //   'bs: \'BULLSHIT\'\n' +
  //   'cocainum: \'COCAINUM\'\n' +
  //   'gfym: GRAPEFRUIT\n' +
  //   'dicksout: DICKS OUT FOR HARAMBE\n\n';

  // console.log(util.inspect(sounds));

  // console.log(Object.keys(sounds));

  // let defaultSounds = 'cena\t\tcenahorn\t\tyeslawd\t\tyesnigga\nwatermalone\t\tasslick\t\tdickpunch\t\tfuckenter\n' +
  //   'pawnch\t\tohshit\t\tsob\t\tdinos\nfua\t\tspine\t\tstfu\t\tboris\nbs\t\tcocainum\t\tgfym\t\tdicksout\n';

  // console.log(util.inspect(soundCommands));

  // let customSounds = '';
	let allSoundsText = [];
	if(soundCommands.length > 0) {
		let customSoundsText = soundCommands.map((customSound) => customSound.commandText.slice(1));

		allSoundsText = customSoundsText.concat(Object.keys(sounds));
    // for (let sound of allSoundsText) {
    //   // customSounds += `${sound}\t\t`;
    // }
	}
	let embed = {
		title: 'Cuckbot Commands',
		type: 'rich',
		color: 0x4286f4,
    // description: 'This is a test embed',
		fields: [
			{
				name: 'Prefix',
				value: 'Command prefix (trigger) character is \'~\''
			},
			{
				name: 'Creating Custom Commands',
				value: creatingCommands
			},
			{
				name: 'Deleting Commands',
				value: deletingCommands
			},
			{
				name: '\u200b',
				value: '\u200b'
			}
      // {
      //   name: 'Sounds',
      //   value: defaultSounds
      // },
      // {
      //   name: 'Sounds',
      //   value: soundFields
      // }
      // ,
      // {
      //   name: 'Images',
      //   value: defaultImages
      // },
      // {
      //   name: 'Custom Images',
      //   value: customImages
      // },
      // {
      //   name: 'Text/ASCII',
      //   value: defaultText
      // },
      // {
      //   name: 'Custom Text/ASCII',
      //   value: customText
      // }
		]
	};

	columnify(allSoundsText, 3, embed.fields, 'Sounds');
	embed.fields.push({ name: '\u200b', value: '\u200b' });
  // console.log(soundTable);

  // console.log(`soundFields: ${embed.fields}`);
  // embed.fields.push(soundFields);

  // let message = '';
  //
  // message += '__**Images**__\n\n' +
  //   'feelsgoodman: Feelsgoodman Meme\n' +
  //   'feelsbadman: Feelsbadman Meme\n' +
  //   'woody: Random \'Rapey Woody\' Meme\n' +
  //   'finishme: White Creamy Sauce\n' +
  //   'needful: Do The Needful\n\n';
  //
  // if (imageCommands.length > 0) {
  //   message += '__**Custom Images**__\n\n';
  //
  //   for (let image of imageCommands) {
  //     message += `${image.commandText.slice(1)}\n`;
  //   }
  //
  //   message += '\n\n';
  // }
  //
  // message += '__**Text**__\n\n';
  // message += 'dongerino: Random ASCII Dick\n' +
  //   'salt: ASCII Salt\n' +
  //   'lenny: Lenny Face Meme\n\n';
  //
  // if (textCommands.length > 0) {
  //   message += '__**Custom Text**__\n\n';
  //
  //   for (let text of textCommands) {
  //     message += `${text.commandText.slice(1)}\n`;
  //   }
  //
  //   message += '\n';
  // }
  // message += '__**MISC**__\n\n';
  // message += 'wowarmory: World of Warcraft character information.\n' +
  //     'Usage: ~wowarmory (realm)|(character name)\n';

	return embed;
};

let utilities = {
	cuckhelp: {
		usage: '~cuckhelp',
		delete: false,
		type: 'utilities',
		process: (bot, msg) => {
			CustomCommand.filter({ serverId: msg.guild.id }).run({ readMode: 'majority' }).then((result) => {
				let imageCommands = result.filter((cmd) => cmd.commandType === 'image');
				let textCommands = result.filter((cmd) => cmd.commandType === 'text');
				let soundCommands = result.filter((cmd) => cmd.commandType === 'sound');

				let embed = buildHelpMessage(imageCommands, textCommands, soundCommands);

        // console.log(util.inspect(embed));

				msg.author.sendMessage('', { embed }).then(() => {
					msg.reply(`I've sent you my commands via PM`);
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
