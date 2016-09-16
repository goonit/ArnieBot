"use strict";

const CONSTANTS = require('../constants.js');
const woody = require('../resources/random.json').rapeywoody;

let sendFileToChannel = (channel, file) => {
    channel.sendFile(file).catch(err => {
        console.log(`Error sending file: ${file} to channel. Error: ${err}`);
    });
};

let images = {
    "feelsgoodman": {
        usage: "Displays feelsgoodman meme in chat",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            let channel = msg.channel;

            sendFileToChannel(channel, CONSTANTS.FEELSGOODMAN);
            // channel.sendFile(CONSTANTS.FEELSGOODMAN).catch(err => {
            //     console.log('Error sending \'feelsgoodman meme\': ' + err);
            // });
        }
    },
    "feelsbadman": {
        usage: "Displays feelsbadman meme in chat",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            let channel = msg.channel;

            sendFileToChannel(channel, CONSTANTS.FEELSBADMAN);
        }
    },
    "finishme": {
        usage: "Displays White Creamy Finishing Sauce",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            let channel = msg.channel;

            sendFileToChannel(channel, CONSTANTS.FINISHME);
        }
    },
    "needful": {
        usage: "Displays 'Do the needful' meme",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            let channel = msg.channel;

            sendFileToChannel(channel, CONSTANTS.NEEDFUL);
        }
    },
    "woody": {
        usage: "Displays random 'rapey woody' meme",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            let channel = msg.channel;

            let number = Math.floor(Math.random() * (woody.length));

            sendFileToChannel(channel, woody[number]);
        }
    },
    "fishmonster": {
        usage: "Post fishmonster Ted Cruz",
        delete: true,
        type: "image",
        process: (bot, msg) => {
            let channel = msg.channel;

            sendFileToChannel(channel, CONSTANTS.FISHMONSTER);
        }
    }
};
    
exports.images = images;