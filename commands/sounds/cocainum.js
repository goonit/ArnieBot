const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class Cocainum extends Command {
	constructor(client) {
		super(client, {
			name: 'cocainum',
			group: 'sounds',
			memberName: 'cocainum',
			description: `Play 'Cocainum' in voice channel`,
			throttling: {
				usages: 3,
				duration: 7
			}
		});
	}

	async run(msg) {
		let soundArgs = {
			sound: CONSTANTS.COCAINUM,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
};
