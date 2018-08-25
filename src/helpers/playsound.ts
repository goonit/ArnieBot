const util = require('util');
import { Message } from 'discord.js';
import { CommandMessage } from 'discord.js-commando';

export class PlaySound {
	public async run(
		msg: CommandMessage,
		args: any
	): Promise<Message | Message[]> {
		const voiceChannel = msg.member.voiceChannel;

		if (!voiceChannel) {
			msg.reply(`Please be in a voice channel first`);
			return;
		}

		voiceChannel
			.join()
			.then((connection) => {
				const dispatcher = connection.playFile(args.sound, args.options);

				dispatcher.on('end', () => {
					voiceChannel.leave();
				});

				dispatcher.on('error', (err) => {
					console.log(`Playback Error: ${util.inspect(err)}`);
					voiceChannel.leave();
				});
			})
			.catch((err) => {
				console.error(`error: ${err}`);
			});

		return msg.delete();
	}
}
