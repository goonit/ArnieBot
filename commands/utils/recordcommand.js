const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const fs = require('fs');
const exec = require('child_process').exec;
const path = require('path');
const moment = require('moment');
const SoundCommand = require('../../helpers/dbSoundCommand.js');

const chalk = require('chalk');
const c = new chalk.constructor({ enabled: true });

let channelC = c.green.bold;
let userC = c.cyan.bold;
let warningC = c.yellow.bold;
let errorC = c.red.bold;
let botC = c.magenta.bold;

module.exports = class RecordCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'recordcommand',
			group: 'utils',
			memberName: 'recordcommand',
			description: 'records a new command and saves it to the database',
			args: [
				{
					key: 'commandtrigger',
					label: 'commandtrigger',
					prompt: 'What would you like the command trigger text to be?',
					type: 'string',
					infinite: false
				}
			]
		});
	}

	// todo: Needs to clean up (delete) the message that created the command
	async run(msg, args) {
		if (RecordCommand.commandExists(args.commandtrigger, msg.guild.id)) {
			msg.reply(`Command '${args.commandtrigger}' already exists!`);
			return;
		}

		if (!args.commandtrigger.startsWith('~')) {
			msg.reply(`The command must start with a prefix of '~'`);
			return;
		}

		args.commandtrigger = args.commandtrigger.toLowerCase();

		let createDate = moment().format('MM/DD/YYYY hh:mm:ss');

		let customCmd = new CustomCommand({
			serverId: msg.guild.id,
			commandText: args.commandtrigger,
			createDate: createDate,
			createUser: msg.author.username,
			commandType: 'recorded'
		});

		let customCmdSlow = new CustomCommand({
			serverId: msg.guild.id,
			commandText: `${args.commandtrigger}-slow`,
			createDate: createDate,
			createUser: msg.author.username,
			commandType: 'recorded'
		});

		let customCmdFast = new CustomCommand({
			serverId: msg.guild.id,
			commandText: `${args.commandtrigger}-fast`,
			createDate: createDate,
			createUser: msg.author.username,
			commandType: 'recorded'
		});

		msg.delete();

		await this.newRecordedCommand(
			msg,
			args,
			customCmd,
			customCmdSlow,
			customCmdFast
		);
	}

	async newRecordedCommand(msg, args, customCmd, customCmdSlow, customCmdFast) {
		let cmdName = args.commandtrigger;
		let cmdNameSlow = `${args.commandtrigger}-slow`;
		let cmdNameFast = `${args.commandtrigger}-fast`;
		let cmdNoTrigger = cmdName.slice(1);
		let cmdSlowNoTrigger = cmdNameSlow.slice(1);
		let cmdFastNoTrigger = cmdNameFast.slice(1);

		// download the video via ytdl, then write that to a video file.
		// After that is done, then we run that video file through the ffmpeg
		// lib to create the small snippet video we need, save that to a new file
		// and delete the original video downloaded via fs.unlink()

		// todo: move resources path into a config file or something

		const voiceChannel = msg.member.voiceChannel;

		if (!voiceChannel) {
			return msg.reply(`Please be in a voice channel first`);
		}

		voiceChannel.join().then(connection => {
			const receiver = connection.createReceiver();
			if (!receiver) {
				console.log(
					`${errorC(
						`There was an error trying to encode the command: ${cmdName}`
					)}`
				);
			}

			const writable = fs.createWriteStream(`${__dirname}/temp.raw`);
			let stream = receiver.createPCMStream(msg.author);

			stream.on('data', chunk => {
				writable.write(chunk, () => {
					console.log(`Wrote ${chunk.length} bytes of data to output file`);
				});
			});

			writable.on('error', error => {
				console.error(`error has occurred: ${error}`);
			});

			stream.on('end', () => {
				connection.disconnect();
				msg.reply(`Converting command -> audio`);
				Promise.all([
					this.doFfmpegWork(
						cmdNameSlow,
						cmdSlowNoTrigger,
						'48k',
						customCmdSlow,
						msg
					),
					this.doFfmpegWork(cmdName, cmdNoTrigger, '96k', customCmd, msg),
					this.doFfmpegWork(
						cmdNameFast,
						cmdFastNoTrigger,
						'192k',
						customCmdFast,
						msg
					)
				]);
			});
		});
	}

	async doFfmpegWork(cmdName, cmdNoTrigger, audioBitRate, customCmdObj, msg) {
		// 96k bitrate for normal voice. (half the 'regular' rate with is low-pitched to begin with) ffmpeg -f s16le -i input.raw -filter:a "asetrate=96k" -c:a libmp3lame output.mp3
		// regular for low voice () ffmpeg -f s16le -i input.raw -c:a libmp3lame output.mp3
		// high voice is 192k (double the normal rate) ffmpeg -f s16le -i input.raw -filter:a "asetrate=192k" -c:a libmp3lame output.mp3

		// create a child process to run the ffmpeg command to convert the
		// downloaded file to an mp3 and store it on the server
		console.log(
			`calling ffempegwork with name: ${cmdName} and bitrate: ${audioBitRate}`
		);
		let resourcesPath = path.resolve('resources/');
		let tempFileDir = `${__dirname}/temp.raw`;

		let childProcess = exec(
			`ffmpeg -f s16le -i ${tempFileDir} -filter:a "asetrate=${audioBitRate}" -c:a libmp3lame ${resourcesPath}/${cmdNoTrigger}${
				msg.guild.id
			}.mp3 -report`,
			(error, stdout, stderr) => {
				if (error !== null && stderr !== null) {
					console.log(
						`${channelC(` # ${msg.channel.name}`)}: ${botC(
							`@CuckBot`
						)} - ${errorC(
							`There was an error trying to encode the command: ${cmdName}`
						)}`
					);
					console.log(`${errorC(`error: ${error}`)}`);
					RecordCommand.removeFile(tempFileDir);
				}
			}
		);

		// event to catch when ffmpeg is finished converting
		childProcess.on('exit', code => {
			if (code !== 0) {
				console.log(`${errorC(`ffmpeg exited with an error. Uh oh.`)}`);
				msg.reply(`Shit hit the fan when trying to convert to an audio file`);

				RecordCommand.removeFile(tempFileDir);
				RecordCommand.removeFile(`${resourcesPath}\\${cmdNoTrigger}.mp3`);

				return;
			}

			// making sure the file was created successfully
			fs.stat(
				`${resourcesPath}/${cmdNoTrigger}${msg.guild.id}.mp3`,
				(err, stats) => {
					if (err || !stats.isFile()) {
						console.log(
							`${channelC(` # ${msg.channel.name}`)}: ${botC(
								`@CuckBot`
							)} - ${errorC(
								`The file cannot be found after ffmpeg conversion: ${cmdNoTrigger}${
									msg.guild.id
								}.mp3`
							)}`
						);
						console.log(`Removing temp file.`);

						RecordCommand.removeFile(`${tempFileDir}`);
						msg.reply(
							'Something happened when trying to find the converted audio file.'
						);

						// return because we don't want the database command to be created if the sound file to play cannot be found
						return;
					}

					customCmdObj.save().then(result => {
						console.log(
							`${channelC(` # ${msg.channel.name}`)}: ${botC(
								`@CuckBot`
							)} - ${warningC(result.commandText)} was created by ${userC(
								msg.author.username
							)}`
						);

						// Chop off the leading ~ for commando
						customCmdObj.commandText = customCmdObj.commandText.slice(1);

						this.client.registry.registerCommand(
							new SoundCommand(this.client, customCmdObj)
						);

						msg.reply(
							`New command '${cmdName}' was successfully created and is now ready to be used!`
						);
					});
				}
			);
		});
	}

	static commandExists(trigger, serverId) {
		CustomCommand.filter({ serverId, commandText: trigger })
			.run({ readMode: 'majority' })
			.then(result => result.length > 0);
	}

	static removeFile(file) {
		fs.unlinkSync(file);
	}
};
