const util = require('util');

module.exports = class PlaySound {
	async run(msg, args) {
		const voiceChannel = msg.member.voiceChannel;

		if (!voiceChannel) {
			return msg.reply(`Please be in a voice channel first`);
		}

		return msg.delete().then(() => {
			voiceChannel
				.join()
				.then(connection => {
					const dispatcher = connection.playFile(args.sound, args.options);

					dispatcher.on('end', () => {
						voiceChannel.leave();
					});

					dispatcher.on('error', err => {
						console.log(`Playback Error: ${util.inspect(err)}`);
						voiceChannel.leave();
					});
				})
				.catch(err => {
					console.error(`error: ${err}`);
				});
		});
	}
};
