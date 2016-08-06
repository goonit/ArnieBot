"use strict";

const CONSTANTS = require('../constants.js');
const woody = require('../resources/random.json').rapeywoody;

let images = {
    "feelsgoodman": {
        usage: "Displays feelsgoodman meme in chat",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            channel = msg.channel;

            bot.sendFile(channel, CONSTANTS.FEELSGOODMAN).catch(err => {
                console.log('Error sending \'feelsgoodman meme\': ' + err);
            });
        }
    },
    "feelsbadman": {
        usage: "Displays feelsbadman meme in chat",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            channel = msg.channel;

            bot.sendFile(channel, CONSTANTS.FEELSBADMAN).catch(err => {
                console.log('Error sending \'feelsbadman meme\': ' + err);
            });
        }
    },
    "finishme": {
        usage: "Displays White Creamy Finishing Sauce",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            channel = msg.channel;

            bot.sendFile(channel, CONSTANTS.FINISHME).catch(err => {
                console.log('Error sending \'finishing sauce\': ' + err);
            })
        }
    },
    "needful": {
        usage: "Displays 'Do the needful' meme",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            channel = msg.channel;

            bot.sendFile(channel, CONSTANTS.NEEDFUL).catch(err => {
                console.log('Error sending \'do the needful\': ' + err);
            })
        }
    },
    "woody": {
        usage: "Displays random 'rapey woody' meme",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            let channel = msg.channel;

            let number = Math.floor(Math.random() * (woody.length));

            bot.sendFile(channel, woody[number]).catch(err => {
                console.log('Error sending \'rapey woody\' meme: ' + err);
            });
        }
    },
    "fishmonster": {
        usage: "Post fishmonster Ted Cruz",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            let channel = msg.channel;

            bot.sendFile(channel, CONSTANTS.FISHMONSTER).catch(err => {
                console.log('Error sending fishmonster Ted: ' + err);
            })
        }
    }
};
    
exports.images = images;