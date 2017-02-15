const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const Embed = require('discord.js').RichEmbed;

module.exports = class CuckHelp extends Command {
	constructor(client) {
		super(client, {
			name: 'cuckhelp',
			group: 'utils',
			memberName: 'cuckhelp',
			description: 'Send the user an embed with help information abotu the bot as a dm.',
			args: [
				{
					key: 'type',
					label: 'type',
					prompt: `To list commands, type '~cuckhelp commands'. To view how to create custom commands, type '~cuckhelp creation'`,
					type: 'string',
					default: 'commands',
					infinite: false
				}
			]
		});
	}

	async run(msg, args) {
		CustomCommand.filter({ serverId: msg.guild.id }).run({ readMode: 'majority' }).then((result) => {
			let imageCommands = result.filter((cmd) => cmd.commandType === 'image');
			let textCommands = result.filter((cmd) => cmd.commandType === 'text');
			let soundCommands = result.filter((cmd) => cmd.commandType === 'sound');
			let embed = {};

			if(args.type === 'commands') {
				embed = this.buildCommandsHelp(imageCommands, textCommands, soundCommands);
			} else if(args.type === 'creation') {
				embed = this.buildCreationHelp();
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

	static buildCommandsHelp(imageCommandsFromDb, textCommandsFromDb, soundCommandsFromDb) {
		let embed = new Embed();

		embed.title = 'Cuckbot Commands';
		embed.color = 0x4286f4;

		// ----- TEXT COMMANDS ----- //

		let loadedTextCommands = this.client.registry.resolveGroup('text').commands;

		let allTextCommands = loadedTextCommands.map((textCommand) => textCommand.memberName);

		if(textCommandsFromDb.length > 0) {
			let customTextCommands = textCommandsFromDb.map((customText) => customText.commandText.slice(1));

			allTextCommands = allTextCommands.concat(customTextCommands);
		}

		embed.addField('Text Commands', allTextCommands.join(', '), false);

		// ----- IMAGE COMMANDS ----- //

		let loadedImageCommands = this.client.registry.resolveGroup('images').commands;

		let allImageCommands = loadedImageCommands.map((imageCommand) => imageCommand.memberName);

		if(imageCommandsFromDb.length > 0) {
			let customImageCommands = imageCommandsFromDb.map((customImage) => customImage.commandText.slice(1));

			allImageCommands = allImageCommands.concat(customImageCommands);
		}

		embed.addField('Image Commands', allImageCommands.join(', '), false);

		// ----- SOUND COMMANDS ----- //

		let loadedSoundCommands = this.client.registry.resolveGroup('sounds').commands;

		let allSoundCommands = loadedSoundCommands.map((soundCommand) => soundCommand.memberName);

		if(soundCommandsFromDb.length > 0) {
			let customSoundCommands = soundCommandsFromDb.map((customSound) => customSound.commandText.slice(1));

			allSoundCommands = allSoundCommands.concat(customSoundCommands);
		}

		embed.addField('Sound Commands', allSoundCommands.join(', '), false);

		return embed;
	}

	static buildCreationHelp() {
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
	}
};
