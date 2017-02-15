const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class Pawnch extends Command {
	constructor(client) {
		super(client, {
			name: 'pawnch',
			group: 'sounds',
			memberName: 'pawnch',
			description: `Play 'Falcon Pawnch' in voice channel`,
			throttling: {
				usages: 3,
				duration: 7
			}
		});
	}

	async run(msg) {
		let soundArgs = {
			sound: CONSTANTS.PAWNCH,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
};
