const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class YesNigga extends Command {
	constructor(client) {
		super(client, {
			name: 'yesnigga',
			group: 'sounds',
			memberName: 'yesnigga',
			description: `Play 'Yes Nigga' in voice channel`,
			throttling: {
				usages: 3,
				duration: 7
			}
		});
	}

	async run(msg) {
		let soundArgs = {
			sound: CONSTANTS.YESNIGGA,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
};
