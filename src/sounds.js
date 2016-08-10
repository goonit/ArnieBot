"use strict";

const path = require('path');
const CONSTANTS = require('../constants.js');
const watermalone = require('../resources/random.json').watermalone;

let joinVoiceChannelAndPlay = (bot, msg, file, options) => {

    let user = msg.author;
    let server = msg.server;

    let channel = resolveVoiceChannel(user, server);

    bot.joinVoiceChannel(channel).then( (connection) => {
        connection.playFile(file, options).then(intent => {
            intent.on('end', () => {
                bot.leaveVoiceChannel(channel);
            });

            intent.on('error', () => {
                console.log('Playback Error: ' + err);
                bot.leaveVoiceChannel(channel);
            })
        });
    }).catch(err => {
        console.log("error: " + err);
    });
};

let lastChannel = null;
let resolveVoiceChannel = (user, server) => {

    if ( user.voiceChannel ) {
        return user.voiceChannel;
    }
    server.channels.filter( (channel) => {
        return channel.type === 'voice';
    })
    .forEach( (channel) => {
        if (channel.members.has('id', user.id))
            lastChannel = channel;
    });

    return lastChannel;
};

let sounds = {
    "cenahorn": {
        usage: "Plays Cena Theme clip",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: "highest",
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.CENAHORN, options);
        }
    },
    "cena": {
        usage: "Plays Cena Theme clip",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: "highest",
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.CENA, options);
        }
    },
    "sob": {
        usage: "Plays \'You son of a bitch\'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.SOB, options);
        }
    },
    "boris": {
        usage: "Plays \'I am invincible!\'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.BORIS, options);
        }
    },
    "bs": {
        usage: "Plays \'BULLSHIT\'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.BS, options);
        }
    },
    "cocainum": {
        usage: "Plays \'COCAINUM\'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.COCAINUM, options);
        }
    },
    "dinos": {
        usage: "Plays \'Who killed the dinosaurs?\'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.DINOS, options);
        }
    },
    "fua": {
        usage: "Plays \'fuck you asshole\'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.FUA, options);
        }
    },
    "gfym": {
        usage: "Plays \'The worst sound ever\'",
        delete: true,
        type: "sound",
        cooldown: 15,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.GFYM, options);
        }
    },
    "stfu": {
        usage: "Plays \'SHUT UP!\'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.STFU, options);
        }
    },
    "spine": {
        usage: "Plays \'But I hope you leave enough room for mah fist...\'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.SPINE, options);
        }
    },
    "pawnch": {
        usage: "Plays Falcon Pawnch",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest',
                volume: 0.5
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.PAWNCH, options);
        }
    },
    "asslick": {
        usage: "Plays John Cena Trainwreck quote",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest'
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.ASSLICK, options);
        }
    },
    "fuckenter": {
        usage: "Plays John Cena Trainwreck quote",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest'
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.FUCKENTER, options);
        }
    },
    "dickpunch": {
        usage: "Plays John Cena Trainwreck quote",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest'
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.DICKPUNCH, options);
        }
    },
    "yesnigga": {
        usage: "Plays 'yes nigga!' from water malone clips",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest'
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.YESNIGGA, options);
        }
    },
    "yeslawd": {
        usage: "Plays 'yes lawd!' from water malone clips",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest'
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.YESLAWD, options);
        }
    },
    "watermalone": {
        usage: "Plays random 'watermalone' clip",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest'
            };

            let number = Math.floor(Math.random() * (watermalone.length));

            let file = path.resolve('resources/', watermalone[number]);

            joinVoiceChannelAndPlay(bot, msg, file, options);
        }
    },
    "ohshit": {
        usage: "Plays 'oh shiiiiiit'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest'
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.OHSHIT, options);
        }
    },
    "dicksout": {
        usage: "Plays 'dicks out for harambe'",
        delete: true,
        type: "sound",
        cooldown: 5,
        process: (bot, msg) => {
            let options = {
                quality: 'highest'
            };

            joinVoiceChannelAndPlay(bot, msg, CONSTANTS.DICKSOUT, options);
        }
    }
};

exports.sounds = sounds;
