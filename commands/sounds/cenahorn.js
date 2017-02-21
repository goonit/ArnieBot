const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const CONSTANTS = require('../../constants.js');

module.exports = class CenaHorn extends Command {
	constructor(client) {
		super(client, {
			name: 'cenahorn',
			group: 'sounds',
			memberName: 'cenahorn',
			description: 'John Cena theme with airhorns',
			throttling: {
				usages: 3,
				duration: 7
			}
		});
	}

	async run(msg) {
		let soundArgs = {
			sound: CONSTANTS.CENAHORN,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
};
