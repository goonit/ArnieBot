const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const exec = require('child_process').exec;
const path = require('path');
const moment = require('moment');
const ImageCommand = require('../../helpers/dbImageCommand.js');
const SoundCommand = require('../../helpers/dbSoundCommand.js');
const TextCommand = require('../../helpers/dbTextCommand.js');

const chalk = require('chalk');
const c = new chalk.constructor({ enabled: true });

let channelC = c.green.bold;
let userC = c.cyan.bold;
let warningC = c.yellow.bold;
let errorC = c.red.bold;
let botC = c.magenta.bold;

module.exports = class CreateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'createcommand',
      group: 'utils',
      memberName: 'createcommand',
      description: 'creates a new command and saves it to the database',
      args: [
        {
          key: 'commandtrigger',
          label: 'commandtrigger',
          prompt: 'What would you like the command trigger text to be?',
          type: 'string',
          infinite: false
        },
        {
          key: 'commandtype',
          label: 'commandtype',
          prompt: 'Type of command (image, text, or sound)',
          type: 'string',
          infinite: false
        },
        {
          key: 'commandresponse',
          label: 'commandresponse',
          prompt:
            'When triggered, what should the bot respond with? (text, imageurl, or youtube url)',
          type: 'string',
          infinite: false
        },
        {
          key: 'starttime',
          label: 'starttime',
          prompt: 'What the start time the audio should begin at?',
          type: 'string',
          default: '00:00:00',
          infinite: false
        },
        {
          key: 'duration',
          label: 'duration',
          prompt: 'How long should the audio clip be?',
          type: 'integer',
          default: 0,
          infinite: false
        }
      ]
    });
  }

  // todo: Needs to clean up (delete) the message that created the command
  async run(msg, args) {
    if (CreateCommand.commandExists(args.commandtrigger, msg.guild.id)) {
      msg.reply(`Command '${args.commandtrigger}' already exists!`);
      return;
    }

    if (!args.commandtrigger.startsWith('~')) {
      msg.reply(`The command must start with a prefix of '~'`);
      return;
    }

    if (
      args.commandtype !== 'text' &&
      args.commandtype !== 'sound' &&
      args.commandtype !== 'image'
    ) {
      msg.reply(
        `Incorrect custom command type was passed in. Types accepted: 'text', 'image', 'sound'`
      );
      return;
    }

    // let withoutPrefix = args.commandtrigger.slice(1);

    let customCmd = new CustomCommand({
      serverId: msg.guild.id,
      commandText: args.commandtrigger,
      createDate: moment().format('MM/DD/YYYY hh:mm:ss'),
      createUser: msg.author.username
    });

    let registerCmd = {};

    msg.delete();

    if (args.commandtype === 'text') {
      customCmd.commandType = 'text';
      customCmd.commandResponse = args.commandresponse;

      customCmd.save().then(result => {
        console.log(
          `${channelC(` # ${msg.channel.name}`)}: ${botC(
            `@CuckBot`
          )} - ${warningC(result.commandText)} was created by ${userC(
            msg.author.username
          )}`
        );

        msg.reply(
          `New command '${args.commandtrigger}' was successfully created! '${
            args.commandtrigger
          } is now ready to be used!`
        );
      });

      // Chop off the leading ~ for commando
      customCmd.commandText = customCmd.commandText.slice(1);

      registerCmd = new TextCommand(this.client, customCmd);

      this.client.registry.registerCommand(registerCmd);
    } else if (args.commandtype === 'sound') {
      customCmd.commandType = 'sound';

      if (
        Date.parse(`01/01/2016 ${args.duration.toString()}`) >
        Date.parse('01/01/2016 00:00:07')
      ) {
        msg.reply(`The maximum duration for a sound command is 7 seconds!`);
        return;
      }

      await this.newSoundCommand(msg, args, customCmd);
    } else if (args.commandtype === 'image') {
      customCmd.commandType = 'image';
      customCmd.imageUrl = args.commandresponse;

      customCmd.save().then(result => {
        console.log(
          `${channelC(` # ${msg.channel.name}`)}: ${botC(
            `@CuckBot`
          )} - ${warningC(result.commandText)} was created by ${userC(
            msg.author.username
          )}`
        );

        msg.reply(
          `New command '${args.commandtrigger}' was successfully created! '${
            args.commandtrigger
          } is now ready to be used!`
        );
      });

      // Chop off the leading ~ for commando
      customCmd.commandText = customCmd.commandText.slice(1);

      registerCmd = new ImageCommand(this.client, customCmd);

      this.client.registry.registerCommand(registerCmd);
    }
  }

  async newSoundCommand(msg, args, customCmd) {
    let cmdName = args.commandtrigger;
    let cmdNoTrigger = cmdName.slice(1);
    let ytUrl = args.commandresponse;
    let startTime = args.starttime;
    let seconds = args.duration;

    // download the video via ytdl, then write that to a video file.
    // After that is done, then we run that video file through the ffmpeg
    // lib to create the small snippet video we need, save that to a new file
    // and delete the original video downloaded via fs.unlink()

    // todo: move resources path into a config file or something
    let resourcesPath = path.resolve('resources/');

    let stream = ytdl(ytUrl, { filter: format => format.container === 'mp4' });

    stream.pipe(fs.createWriteStream(`${__dirname}/temp.mp4`));

    let tempFileDir = `${__dirname}/temp.mp4`;

    stream.on('finish', () => {
      msg.reply(`Converting command from video -> audio`);

      let duration = `00:00:${seconds}`;
      // create a child process to run the ffmpeg command to convert the
      // downloaded file to an mp3 and store it on the server
      let childProcess = exec(
        `ffmpeg -i ${__dirname}/temp.mp4 -acodec libmp3lame -ac 2 -ab 160k -ar 48000 -ss ${startTime} -t ${duration} ${resourcesPath}/${cmdNoTrigger}${
          msg.guild.id
        }.mp3`,
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
            CreateCommand.removeFile(tempFileDir);
          }
        }
      );

      // event to catch when ffmpeg is finished converting
      childProcess.on('exit', code => {
        if (code !== 0) {
          console.log(`${errorC(`ffmpeg exited with an error. Uh oh.`)}`);
          msg.reply(
            `Shit hit the fan when trying to convert the video to an audio file`
          );

          CreateCommand.removeFile(tempFileDir);
          CreateCommand.removeFile(`${resourcesPath}\\${cmdNoTrigger}.mp3`);

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
              console.log(`Removing temp file downloaded from ytdl-core.`);

              CreateCommand.removeFile(`${__dirname}/temp.mp4`);
              msg.reply(
                'Something happened when trying to find the converted audio file.'
              );

              // return because we don't want the database command to be created if the sound file to play cannot be found
              return;
            } else {
              // remove the temp file that was originally downloaded via ytdl
              fs.unlink(`${__dirname}/temp.mp4`, () => {
                console.log(
                  `${channelC(
                    `File has been created, sliced, and copied successfully. Removal of temporary file was also successful. Storing command in database`
                  )}`
                );
              });
            }

            customCmd.save().then(result => {
              console.log(
                `${channelC(` # ${msg.channel.name}`)}: ${botC(
                  `@CuckBot`
                )} - ${warningC(result.commandText)} was created by ${userC(
                  msg.author.username
                )}`
              );

              // Chop off the leading ~ for commando
              customCmd.commandText = customCmd.commandText.slice(1);

              this.client.registry.registerCommand(
                new SoundCommand(this.client, customCmd)
              );

              msg.reply(
                `New command '${cmdName}' was successfully created! '${
                  args.commandtrigger
                }' is now ready to be used!`
              );
            });
          }
        );
      });
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
