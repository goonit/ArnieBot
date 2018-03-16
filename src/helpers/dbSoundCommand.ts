const path = require('path');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';
import { PlaySound } from '../helpers/playsound.js';

export class DbSoundCommand extends Command {
	public customCommand: any;
	public constructor(client: CommandoClient, customCommandObject: any) {
		super(client, {
			name: customCommandObject.commandText,
			group: 'custom',
			memberName: customCommandObject.commandText,
			description: `Plays a ${
				customCommandObject.commandText
			} in a voice channel`
		});

		this.customCommand = customCommandObject;
	}

	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		let filename = `${this.customCommand.commandText}${msg.guild.id}.mp3`;

		let file = path.resolve('resources/', filename);

		let soundArgs = {
			sound: file,
			options: { volume: 0.5 }
		};

		return new PlaySound().run(msg, soundArgs);
	}
}
