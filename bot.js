var Discord = require("discord.js");

var ytdl = require('ytdl-core');
var request = require('superagent');
var url = require('url');

var shouldDisallowQueues = require('./lib/permission-checks.js');
var Saved = require('./lib/saved.js');
var Sounds = require('./src/sounds.js');
var Images = require('./src/images.js');
var Ascii = require('./src/asciiPictures.js');
var Utilities = require('./src/utilities.js');
Saved.read();

var YoutubeTrack = require('./lib/youtube-track.js');
var processCmd = require('./CommandHandler.js').commandHandler;

var Util = require('./lib/util.js');
var Config = require('./lib/config.js');
var CURRENT_REV = 5;

var client = new Discord.Client({
    autoReconnect: true
});

Commands = {};

Object.assign(Commands, Images.images, Sounds.sounds, Ascii.asciiPictures, Utilities.utilities);

var playQueue = [];
var boundChannel = false;
var currentStream = false;

// Video that is currently being played
var currentVideo = false;

// Last video played
var lastVideo = false;

var botMention = false;

var shouldStockpile = false;
var stockpile = '';

// Handling api key
var apiKey = false;

if (process.argv[4]) {
    apiKey = process.argv[4];
} else if (Config.auth.apiKey !== 'youtube API key (optional)') {
    apiKey = Config.auth.apiKey;
}

client.on('warn', (m) => console.log('[warn]', m));
client.on('debug', (m) => console.log('[debug]', m));
client.on('error', (m) => console.log('[error]', m));

client.on('ready', () => {
    // if (Config.botHasNickname) {
    //     // botMention = `<@!${client.user.id}>`;
    //     botMention =  '!arnie';
    //
    // } else {
    //     // botMention = `<@${client.user.id}>`;
    //     botMention =  '!arnie';
    // }
    //
    // console.log(`Bot mention: ${botMention}`);

    if (Config.configRev !== CURRENT_REV) {
        console.log('WARNING: Your lethe-config.json is out of date relative to the code using it! Please update it from the git repository, otherwise things will break!');
    }
});

//todo: CLEAN THIS FUCKING MESS UP
client.on('message', m => {

    if (client.user.id == m.author.id) {
        console.log('returning because client id and user id are the same');
        return;
    }
    
    var msgPrefix = "~";

    var formattedMsg = m.content.substring(msgPrefix.length, m.content.length);
    var cmdTxt = formattedMsg.split(" ")[0].toLowerCase();

    if (Commands.hasOwnProperty(cmdTxt)){
        processCmd(client, m, formattedMsg.substring((formattedMsg.split(" ")[0]).length + 1), cmdTxt, msgPrefix);
    }

    // if (!botMention) {
    //     console.log('returning because botmention isnt set');
    //     return;
    // }
    
    //
    // if (!m.content.startsWith(`${botMention}`) || m.content.length <= botMention.length + 1) {
    //     console.log('returning because of length');
    //     return;
    // }

    // if (m.content.startsWith(`${botMention} info`)) {
    //     if (!checkCommand(m, 'info')) return;
    //
    // }

    // if (m.content.startsWith(`${botMention} i`)) { // init
    //     if (!checkCommand(m, 'init')) return;
    //     if (boundChannel) return;
    //     var userChannel = m.author.voiceChannel; 
    //     var channelToJoin = spliceArguments(m.content)[1];
    //     for (var channel of m.channel.server.channels) {
    //         if (channel instanceof Discord.VoiceChannel) {
    //             if (!channelToJoin) {
    //                 boundChannel = m.channel;
    //                 if (userChannel) {
    //                     client.reply(m, `Binding to text channel <#${boundChannel.id}> and voice channel **${userChannel.name}** \`(${userChannel.id})\``);
    //                     client.joinVoiceChannel(userChannel).catch(error);
    //                 } else {
    //                     client.reply(m, `Binding to text channel <#${boundChannel.id}> and voice channel **${channel.name}** \`(${channel.id})\``);
    //                     client.joinVoiceChannel(channel).catch(error);
    //                 }
    //
    //                 break;
    //             } else if (channel.name === channelToJoin) {
    //                 boundChannel = m.channel;
    //                 client.reply(m, `Binding to text channel <#${boundChannel.id}> and voice channel **${channel.name}** \`(${channel.id})\``);
    //                 client.joinVoiceChannel(channel).catch(error);
    //                 break;
    //             }
    //         }
    //     }
    //
    //     return;
    // }
    //
    // if (m.content.startsWith(`${botMention} d`)) { // destroy
    //     if (!checkCommand(m, 'destroy')) return;
    //     if (!boundChannel) return;
    //     client.reply(m, `Unbinding from <#${boundChannel.id}> and destroying voice connection`);
    //     playQueue = [];
    //     client.leaveVoiceChannel(m.author.voiceChannel);
    //     boundChannel = false;
    //     currentStream = false;
    //     currentVideo = false;
    //     return;
    // }

    // Only respond to other messages inside the bound channel
    // if (!m.channel.equals(boundChannel)) return;
    //
    // if (m.content.startsWith(`${botMention} n`)) { // next
    //     if (!checkCommand(m, 'next')) return;
    //     if (currentVideo) {
    //         playStopped();
    //     } else {
    //         client.reply(m, 'No video is currently playing.');
    //     }
    //
    //     return;
    // }

});

function parseVidAndQueue(vid, m, suppress) {
    vid = resolveVid(vid, m);
    if (!vid) {
        client.reply(m, 'You need to specify a video!');
        return;
    }

    getInfoAndQueue(vid, m, suppress);
}

function resolveVid(thing, m) {
    thing = thing.trim();
    if (thing === 'current') {
        if (currentVideo) return currentVideo.vid;
        client.reply(m, 'No video currently playing!'); return false;
    } else if (thing === 'last') {
        if (lastVideo) return lastVideo.vid;
        client.reply(m, 'No last played video found!'); return false;
    } else if (/^http/.test(thing)) {
        var parsed = url.parse(thing, true);
        if (parsed.query.v) return parsed.query.v;
        client.reply(m, 'Not a YouTube URL!'); return false;
    } else return Saved.possiblyRetrieveVideo(thing);
}

function getInfoAndQueue(vid, m, suppress) {
    YoutubeTrack.getInfoFromVid(vid, m, (err, video) => {
        if (err) handleYTError(err);
        else {
            possiblyQueue(video, m.author.id, m, suppress);
        }
    });
}

function spliceArguments(message, after) {
    after = after || 2;
    var rest = message.split(' ');
    var removed = rest.splice(0, after);
    return [removed.join(' '), rest.join(' ')];
}

function saveVideo(video, vid, keywords, m) {
    simplified = video.saveable();
    if (Saved.saved.videos.hasOwnProperty(keywords)) client.reply(m, `Warning: ${Saved.saved.videos[keywords].prettyPrint()} is already saved as *${keywords}*! Overwriting.`);

    var key;
    if (key = Saved.isVideoSaved(vid)) client.reply(m, `Warning: This video is already saved as *${key}*! Adding it anyway as *${keywords}*.`);

    Saved.saved.videos[keywords] = simplified;
    client.reply(m, `Saved video ${video.prettyPrint()} as *${keywords}*`);
    Saved.write();
}

function possiblyQueue(video, userId, m, suppress) {
    video.userId = userId;
    suppress = (suppress === undefined) ? false : suppress;
    reason = shouldDisallowQueue(playQueue, video, Config);
    if (!userIsAdmin(userId) && reason) {
        fancyReply(m, `You can't queue **${video.title}** right now! Reason: ${reason}`);
    } else {
        playQueue.push(video);
        if (suppress == 0) fancyReply(m, `Queued ${video.prettyPrint()}`);
        else if (suppress > -1) fancyReply(m, `Queued ${video.prettyPrint()} and ${suppress} other videos`);

        // Start playing if not playing yet
        if (!currentVideo) nextInQueue();
    }
}

function handleYTError(err) {
    if (err.toString().indexOf('Code 150') > -1) {
        // Video unavailable in country
        boundChannel.sendMessage('This video is unavailable in the country the bot is running in! Please try a different video.');
    } else if (err.message == 'Could not extract signature deciphering actions') {
        boundChannel.sendMessage('YouTube streams have changed their formats, please update `ytdl-core` to account for the change!');
    } else if (err.message == 'status code 404') {
        boundChannel.sendMessage('That video does not exist!');
    } else {
        boundChannel.sendMessage('An error occurred while getting video information! Please try a different video.');
    }

    console.log(err.toString());
}

function playStopped() {
    if (client.internal.voiceConnection) client.internal.voiceConnection.stopPlaying();

    boundChannel.sendMessage(`Finished playing **${currentVideo.title}**`);
    client.setStatus('online', null);
    lastVideo = currentVideo;
    currentVideo = false;
    nextInQueue();
}

function play(video) {
    currentVideo = video;
    if (client.internal.voiceConnection) {
        var connection = client.internal.voiceConnection;
        currentStream = video.getStream();

        currentStream.on('error', (err) => {
            if (err.code === 'ECONNRESET') {
                if (!Config.suppressPlaybackNetworkError) {
                    boundChannel.sendMessage(`There was a network error during playback! The connection to YouTube may be unstable. Auto-skipping to the next video...`);
                }
            } else {
                boundChannel.sendMessage(`There was an error during playback! **${err}**`);
            }

            playStopped(); // skip to next video
        });

        currentStream.on('end', () => setTimeout(playStopped, Config.timeOffset || 8000)); // 8 second leeway for bad timing
        connection.playRawStream(currentStream).then(intent => {
            boundChannel.sendMessage(`Playing ${video.prettyPrint()}`);
            client.setStatus('online', video.title);
        });
    }
}

function userIsAdmin(userId) {
    return Config.adminIds.indexOf(userId) > -1;
}

function checkCommand(m, command) {
    if (Config.commandsRestrictedToAdmins[command]) {
        if (!userIsAdmin(m.author.id)) {
            client.reply(m, `You don't have permission to execute that command! (user ID: \`${m.author.id}\`)`);
            return false;
        }
    }

    return true;
}

function nextInQueue() {
    if (playQueue.length > 0) {
        next = playQueue.shift();
        play(next);
    }
}

function fancyReply(m, message) {
    if (shouldStockpile) {
        stockpile += message + '\n';
    } else {
        client.reply(m, message);
    }
}

function spitUp(m) {
    client.reply(m, stockpile);
    stockpile = '';
    shouldStockpile = false;
}

function error(argument) {
    console.log(argument.stack);
}

// Email and password over command line
// client.login(process.argv[2] || Config.auth.email, process.argv[3] || Config.auth.password).catch((e) => {
//     try {
//         if (e.status === 400 && ~e.response.error.text.indexOf('email')) {
//             console.log('Error: You entered a bad email!');
//         } else if (e.status === 400 && ~e.response.error.text.indexOf('password')) {
//             console.log('Error: You entered a bad password!');
//         } else {
//             console.log(e);
//         }
//     } catch (err) {
//         console.log(e);
//     }
// });

process.on('uncaughtException', function(err) {
    // Handle ECONNRESETs caused by `next` or `destroy`
    if (err.code == 'ECONNRESET') {
        // Yes, I'm aware this is really bad node code. However, the uncaught exception
        // that causes this error is buried deep inside either discord.js, ytdl or node
        // itself and after countless hours of trying to debug this issue I have simply
        // given up. The fact that this error only happens *sometimes* while attempting
        // to skip to the next video (at other times, I used to get an EPIPE, which was
        // clearly an error in discord.js and was now fixed) tells me that this problem
        // can actually be safely prevented using uncaughtException. Should this bother
        // you, you can always try to debug the error yourself and make a PR.
        console.log('Got an ECONNRESET! This is *probably* not an error. Stacktrace:');
        console.log(err.stack);
    } else {
        // Normal error handling
        console.log(err);
        console.log(err.stack);
        process.exit(0);
    }
});

client.loginWithToken('MjAwNzU0Mjk2ODY0NzY4MDAx.CmB2gg.7rLKOO1Fmc4g1QSL1qUvuo0kUms');