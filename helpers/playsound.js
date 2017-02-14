const {Command} = require('discord.js-commando');
const util = require('util');

module.exports = class PlaySound extends Command {
	constructor(client) {
		super(client, {
			name: 'playsound',
			group: 'sounds',
			memberName: 'playsound',
			description: 'Connects to a voice channel and plays the passed in sound',
			examples: ['~cenahorn'],
			args: [
				{
					key: 'sound',
					label: 'sound',
					prompt: 'What sound would you like to play',
					type: 'string'
				},
				{
					key: 'options',
					label: 'options',
					prompt: 'What options would you like to pass in',
					type: 'object'
				}
			]
		});
	}

	async run(msg, args) {
		const voiceChannel = msg.member.voiceChannel;

		if (!voiceChannel) {
			return msg.reply(`Please be in a voice channel first`);
		}

		voiceChannel.join(args.sound, args.options).then((connection) => {
			const dispatcher = connection.playFile();

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
	}
};
