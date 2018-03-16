const watermalone = require('../../resources/random.json').watermalone;
const path = require('path');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';
import { PlaySound } from '../../helpers/playsound.js';

export class Watermalone extends Command {
	public constructor(client: CommandoClient) {
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

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let num: number = Math.floor(Math.random() * watermalone.length);
		let file = path.resolve('resources/', watermalone[num]);

		let soundArgs = {
			sound: file,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
}
