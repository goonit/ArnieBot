const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class DicksOut extends Command {
	constructor(client) {
		super(client, {
			name: 'dicksout',
			group: 'sounds',
			memberName: 'dicksout',
			description: `Play 'Dicks out for Harambe' in voice channel`,
			throttling: {
				usages: 3,
				duration: 7
			}
		});
	}

	async run(msg) {
		let soundArgs = {
			sound: CONSTANTS.DICKSOUT,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
};
