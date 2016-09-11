"use strict";

// import databaseModel
const CustomCommand = require('../dbModels/customCommand.js');

const moment = require('moment');
const util = require('util');
const admins = require('../admins.json').admins;
const _ = require('lodash');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('ffmpeg');
const exec = require('child_process').exec;
const path = require('path');

const joinAndPlay = require('./sounds.js').joinVoiceChannelAndPlay;

const chalk = require("chalk"),
    c = new chalk.constructor({
        enabled: true
    });

let serverC = c.black.bold,
    channelC = c.green.bold,
    userC = c.cyan.bold,
    warningC = c.yellow.bold,
    errorC = c.red.bold,
    botC = c.magenta.bold;

let removeFile = (file) => {
    console.log(`file to remove: ${file}`);
    fs.unlink(file);
};

let commandExists = (trigger, serverId) => {
    CustomCommand.filter({ serverId, commandText: trigger }).run({readMode: 'majority'}).then((result) => {
        return result.length > 0;
    });
};

let newSoundCommand = (bot, msg, commandInfo, customCmd) => {
    let cmdName = commandInfo[0];
    let cmdNoTrigger = cmdName.slice(1);
    let ytUrl = commandInfo[2];
    let startTime = commandInfo[3];
    let seconds = commandInfo[4];

    // download the video via ytdl, then write that to a video file.  After that is done, then we run that video file through the ffmpeg
    // lib to create the small snippet video we need, save that to a new file and delete the original video downloaded via fs.unlink()

    //todo: move resources path into a config file or something
    let resourcesPath = path.resolve('resources/');

    let stream = ytdl(ytUrl, {
        filter: (format) => {
            return format.container === 'mp4';
        }
    }).pipe(fs.createWriteStream(`${__dirname}/temp.mp4`));

    let tempFileDir = `${__dirname}/temp.mp4`;

    stream.on('finish', () => {
        bot.reply(msg, `Converting command from video -> audio`);

        let duration = `00:00:${seconds}`;
        // create a child process to run the ffmpeg command to convert the downloaded file to an mp3 and store it on the server
        //todo: possibly change \\ to / for windows vs linux directory navigation
        let childProcess = exec(`ffmpeg -i ${__dirname}/temp.mp4 -acodec libmp3lame -ac 2 -ab 160k -ar 48000 -ss ${startTime} -t ${duration} ${resourcesPath}/${cmdNoTrigger}${msg.server.id}.mp3`,
            (error, stdout, stderr) => {
                if (error !== null) {
                    console.log(`${channelC(` # ${msg.channel.name}`)}: ${botC(`@CuckBot`)} - ${errorC(`There was an error trying to encode the command: ${cmdName}`)}`);
                    console.log(`${errorC(`error: ${error}`)}`);

                    removeFile(tempFileDir);
                }
            });

        // event to catch when ffmpeg is finished converting
        childProcess.on('exit', (code) => {
            if (code != 0) {
                console.log(`${errorC(`ffmpeg exited with an error. Uh oh.`)}`);
                bot.reply(msg, `Shit hit the fan when trying to convert the video to an audio file`);

                removeFile(tempFileDir);
                removeFile(`${resourcesPath}\\${cmdNoTrigger}.mp3`);

                return;
            }

            // making sure the file was created successfully
            fs.stat(`${resourcesPath}/${cmdNoTrigger}${msg.server.id}.mp3`, (err, stats) => {
                if (err || !stats.isFile()) {
                    console.log(`${channelC(` # ${msg.channel.name}`)}: ${botC(`@CuckBot`)} - ${errorC(`The file cannot be found after ffmpeg conversion: ${cmdNoTrigger}${msg.server.id}.mp3`)}`);
                    console.log(`Removing temp file downloaded from ytdl-core.`);

                    removeFile(`${__dirname}/temp.mp4`);
                    bot.reply(msg, 'Something happened when trying to find the converted audio file.');

                    return; // return because we don't want the database command to be created if the sound file to play cannot be found
                } else {

                    // remove the temp file that was originally downloaded via ytdl
                    fs.unlink(`${__dirname}/temp.mp4`, () => {
                        console.log(`${channelC(`File has been created, sliced, and copied successfully. Removal of temporary file was also successful. Storing command in database`)}`);
                    });
                }

                customCmd.save().then((result) => {
                    console.log(`${channelC(` # ${msg.channel.name}`)}: ${botC(`@CuckBot`)} - ${warningC(cmdName)} was created by ${userC(msg.author.username)}`);

                    bot.reply(msg, `New command '${cmdName}' was successfully created! Commands must be reloaded before the new commands may be used!`);
                });
            });
        });
    });
};

let customCommands = {
    "createcommand": {
        usage: "~createcommand ~[commandName]|[type ('text', 'sound', 'image')]|[(imageUrl, textResponse, or youtubeUrl)]|[startTime (ex:00:00:00)]|[duration (ex: 07)}]",
        delete: true,
        type: "customCommand",
        process: (bot, msg, suffix) => {
            let adminsArray = Array.from(admins);

            let commandInfo = suffix.split('|');
            let trigger = commandInfo[0];

            if (!_.includes(adminsArray, msg.author.id.toString())) {
                bot.reply(`Sorry, you don't have permissions to execute this command!`);
                return;
            }

            if(commandExists(trigger, msg.server.id)) {
                bot.reply(msg, `Command '${trigger}' already exists!`);
                return;
            }

            if (commandInfo.length < 3) {
                bot.reply(`Incorrect number of parameters passed into the command. Correct usage: ${this.usage}`);
                return;
            }

            if (!trigger.startsWith('~')) {
                bot.reply(`The new command must start with a prefix of '~'`);
                return;
            }

            let commandType = commandInfo[1];
            if (commandType != 'text' || commandType != 'sound' || commandType != 'image') {
                bot.reply(`Incorrect custom command type was passed in. Types accepted: 'text', 'image', 'sound'`);
            }

            let customCmd = new CustomCommand({
                serverId: msg.server.id,
                commandText: trigger,
                createDate: moment().format("MM/DD/YYYY hh:mm:ss"),
                createUser: msg.author.username
            });

            console.log(`commandInfo: ${commandInfo}`);

            switch (commandType){
                case 'text':
                    customCmd.commandType = 'text';
                    customCmd.commandResponse = commandInfo[2];

                    customCmd.save().then((result) => {
                        console.log(`${channelC(` # ${msg.channel.name}`)}: ${botC(`@CuckBot`)} - ${warningC(trigger)} was created by ${userC(msg.author.username)}`);

                        bot.reply(msg, `New command '${trigger}' was successfully created! Commands must be reloaded before the new commands may be used!`);
                    });

                    break;

                case 'sound':
                    customCmd.commandType = 'sound';
                    let duration = commandInfo[4];

                    if (Date.parse(`01/01/2016 ${duration.toString()}`) > Date.parse("01/01/2016 00:00:07")) {
                        bot.reply(msg, `The maximum duration for a sound command is 7 seconds!`);
                        return;
                    }

                    newSoundCommand(bot, msg, commandInfo, customCmd);

                    break;

                case 'image':
                    customCmd.commandType = 'image';
                    customCmd.imageUrl = commandInfo[2];

                    customCmd.save().then(() => {
                        console.log(`${channelC(` # ${msg.channel.name}`)}: ${botC(`@CuckBot`)} - ${warningC(trigger)} was created by ${userC(msg.author.username)}`);

                        bot.reply(msg, `New command '${trigger}' was successfully created! Commands must be reloaded before the new commands may be used!`);
                    });

                    break;
            }
        }
    },
    "deletecommand": {
        usage: "~deletecommand [commandname]",
        delete: true,
        type: "customCommand",
        process: (bot, msg, suffix) => {
            let adminsArray = Array.from(admins);

            if (!_.includes(adminsArray, msg.author.id.toString())) {
                bot.reply(`Sorry, you don't have permissions to execute this command!`);
                return;
            }

            CustomCommand.filter({ serverId: msg.server.id, commandText: suffix}).run({readMode: 'majority'}).then((result) => {
                console.log(`result: ${util.inspect(result)}`);
                if(result.length > 0) {
                    result[0].delete().then((result) => {
                        if (result.commandType == 'sound') {
                            removeFile(path.resolve('resources/', `${suffix.slice(1)}${msg.server.id}.mp3`));
                        }

                        bot.reply(msg, `Custom command '${suffix}' was successfully deleted`);
                    }).catch((err) => {
                        console.log(`error: ${err}`);
                    });
                } else {
                    bot.reply(msg, `Command '${suffix}' was not found!`);
                    return;
                }

            });
        }
    },
    "dbimagecommand": {
        usage: "~command",
        delete: true,
        type: "dbCommand",
        process: (bot, msg, dbCommand) => {
            bot.sendFile(msg.channel, dbCommand.imageUrl).catch(err => {
                console.log(`Error sending \'${dbCommand.commandText}\' from database: ${err}`);
            });
        }
    },
    "dbtextcommand": {
        usage: "~command",
        delete: true,
        type: "dbCommand",
        process: (bot, msg, dbCommand) => {
            bot.sendMessage(msg.channel, dbCommand.commandResponse).catch(err => {
                console.log(`Error sending \'${dbCommand.commandText}\' from database: ${err}`);
            })
        }
    },
    "dbsoundcommand": {
        usage: "~command",
        delete: true,
        type: "dbCommand",
        process: (bot, msg, dbCommand) => {
            let options = {
                volume: 0.5
            };

            let filename = `${dbCommand.commandText.substring(1)}${msg.server.id}.mp3`;

            let file = path.resolve('resources/', filename);

            joinAndPlay(bot, msg, file, options);
        }
    }
};

exports.customCommands = customCommands;
