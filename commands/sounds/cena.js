const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class Cena extends Command {
	constructor(client) {
		super(client, {
			name: 'cena',
			group: 'sounds',
			memberName: 'cena',
			description: `Play John Cena's theme in chat`,
			throttling: {
				usages: 3,
				duration: 7
			}
		});
	}

	async run(msg) {
		let soundArgs = {
			sound: CONSTANTS.CENA,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
};
