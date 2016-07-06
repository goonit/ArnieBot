var CONSTANTS = require('../constants.js');

//todo: refactor joinvoicechannel code to call another method. Too much duplicate code here.
var sounds = {
    "cenahorn": {
        usage: "Plays Cena Theme clip",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;

            bot.joinVoiceChannel(voiceChannel).then((connection) => {
                var options = {
                    quality: "highest"
                };

                options.volume = 0.5;

                connection.playFile(CONSTANTS.CENAHORN, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => { 
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                }).catch(err => {
                    console.log("error: " + err);
                });
            })
        }
    },
    "cena": {
        usage: "Plays Cena Theme clip",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;

            bot.joinVoiceChannel(voiceChannel).then((connection) => {
                var options = {
                    quality: "highest"
                };

                options.volume = 0.5;

                connection.playFile(CONSTANTS.CENA, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
        }
    },
    "sob": {
        usage: "Plays \'You son of a bitch\'",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;
            bot.joinVoiceChannel(voiceChannel).then((connection) => {

                var options = {
                    quality: 'highest'
                };

                connection.playFile(CONSTANTS.SOB, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
            .catch(err => {
                console.log('Error joining voice channel: ' + err);
            });
        }
    },
    "boris": {
        usage: "Plays \'I am invincible!\'",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;
            bot.joinVoiceChannel(voiceChannel).then((connection) => {

                var options = {
                    quality: 'highest'
                };

                connection.playFile(CONSTANTS.BORIS, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
            .catch(err => {
                console.log('Error joining voice channel: ' + err);
            });
        }
    },
    "bs": {
        usage: "Plays \'BULLSHIT\'",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;
            bot.joinVoiceChannel(voiceChannel).then((connection) => {

                var options = {
                    quality: 'highest'
                };

                connection.playFile(CONSTANTS.BS, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
            .catch(err => {
                console.log('Error joining voice channel: ' + err);
            });
        }
    },
    "cocainum": {
        usage: "Plays \'COCAINUM\'",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;
            bot.joinVoiceChannel(voiceChannel).then((connection) => {

                var options = {
                    quality: 'highest'
                };

                connection.playFile(CONSTANTS.COCAINUM, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
            .catch(err => {
                console.log('Error joining voice channel: ' + err);
            });
        }
    },
    "dinos": {
        usage: "Plays \'Who killed the dinosaurs?\'",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;
            bot.joinVoiceChannel(voiceChannel).then((connection) => {

                var options = {
                    quality: 'highest'
                };

                connection.playFile(CONSTANTS.DINOS, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
            .catch(err => {
                console.log('Error joining voice channel: ' + err);
            });
        }
    },
    "fua": {
        usage: "Plays \'fuck you asshole\'",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;
            bot.joinVoiceChannel(voiceChannel).then((connection) => {

                var options = {
                    quality: 'highest'
                };

                connection.playFile(CONSTANTS.FUA, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
            .catch(err => {
                console.log('Error joining voice channel: ' + err);
            });
        }
    },
    "gfym": {
        usage: "Plays \'The worst sound ever\'",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;
            bot.joinVoiceChannel(voiceChannel).then((connection) => {

                var options = {
                    quality: 'highest'
                };

                connection.playFile(CONSTANTS.GFYM, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
            .catch(err => {
                console.log('Error joining voice channel: ' + err);
            });
        }
    },
    "shutup": {
        usage: "Plays \'SHUT UP!\'",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;
            bot.joinVoiceChannel(voiceChannel).then((connection) => {

                var options = {
                    quality: 'highest'
                };

                connection.playFile(CONSTANTS.STFU, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
            .catch(err => {
                console.log('Error joining voice channel: ' + err);
            });
        }
    },
    "spine": {
        usage: "Plays \'But I hope you leave enough room for mah fist...\'",
        delete: true,
        type: "sound",
        process: function (bot, msg) {
            var voiceChannel = msg.author.voiceChannel;
            bot.joinVoiceChannel(voiceChannel).then((connection) => {

                var options = {
                    quality: 'highest'
                };

                connection.playFile(CONSTANTS.SPINE, options).then((intent) => {
                    intent.on('end', () => {
                        bot.leaveVoiceChannel(voiceChannel);
                    });
                    intent.on('error', (err) => {
                        console.log('Playback Error: ' + err);
                        bot.leaveVoiceChannel(voiceChannel);
                    })
                });
            })
            .catch(err => {
                console.log('Error joining voice channel: ' + err);
            });
        }
    }
};

exports.sounds = sounds;
