const { Command } = require('discord.js-commando');
const PlaySound = require('../helpers/playsound.js');
const path = require('path');

module.exports = class DbSoundCommand extends Command {
	constructor(client, customCommandObject) {
		super(client, {
			name: customCommandObject.commandText,
			group: 'custom',
			memberName: customCommandObject.commandText,
			description: `Plays a ${customCommandObject.commandText} in a voice channel`
		});

		this.customCommand = customCommandObject;
	}

	async run(msg) {
		let filename = `${this.customCommand.commandText}${msg.guild.id}.mp3`;

		let file = path.resolve('resources/', filename);

		let soundArgs = {
			sound: file,
			options: { volume: 0.5 }
		};

		return new PlaySound().run(msg, soundArgs);
	}
};
