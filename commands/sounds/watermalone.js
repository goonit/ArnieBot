const { Command } = require('discord.js-commando');
const PlaySound = require('../../helpers/playsound.js');
const watermalone = require('../../resources/random.json').watermalone;
const path = require('path');

module.exports = class Watermalone extends Command {
	constructor(client) {
		super(client, {
			name: 'watermalone',
			group: 'sounds',
			memberName: 'watermalone',
			description: `Play a random 'Watermalone' clip in voice channel`,
			throttling: {
				usages: 3,
				duration: 7
			}
		});
	}

	async run(msg) {
		let number = Math.floor(Math.random() * watermalone.length);
		let file = path.resolve('resources/', watermalone[number]);

		let soundArgs = {
			sound: file,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
};
