const CONSTANTS = require('../../constants.js');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';
import { PlaySound } from '../../helpers/playsound.js';

export class GFYM extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'gfym',
			group: 'sounds',
			memberName: 'gfym',
			description: `Play the worst sound of all time in voice channel`,
			throttling: {
				usages: 1,
				duration: 15
			}
		});
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let soundArgs = {
			sound: CONSTANTS.GFYM,
			options: {
				quality: 'highest',
				volume: 0.5
			}
		};

		return new PlaySound().run(msg, soundArgs);
	}
}
