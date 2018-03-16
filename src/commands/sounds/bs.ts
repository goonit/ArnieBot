const CONSTANTS = require('../../constants.js');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';
import { PlaySound } from '../../helpers/playsound.js';

export class BS extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'bs',
			group: 'sounds',
			memberName: 'bs',
			description: `Play 'BULLSHIT' in voice channel`,
			throttling: {
				usages: 3,
				duration: 7
			}
		});
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let soundArgs = {
			sound: CONSTANTS.BS,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
}
