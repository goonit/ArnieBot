const path = require('path');

import { Message } from 'discord.js';
import { CommandoClient, Command, CommandMessage } from 'discord.js-commando';
import { PlaySound } from '../helpers/playsound.js';
import { ICustomCommand } from './ICustomCommand';

export default class DbSoundCommand extends Command {
	public customCommand: any;
	public constructor(client: CommandoClient, cmd: ICustomCommand) {
		super(client, {
			name: cmd.commandText,
			group: 'custom',
			memberName: cmd.commandText,
			description: `Plays a ${cmd.commandText} in a voice channel`
		});

		this.customCommand = cmd;
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
