var CONSTANTS = require('../constants.js');


var images = {
    "feelsgood": {
        usage: "Displays feelsgood meme in chat",
        delete: true,
        type: "image",
        process: function (bot, msg) {
            channel = msg.channel;

            bot.sendFile(channel, CONSTANTS.FEELSGOOD).catch(err => {
                console.log('Error sending \'feelsgood meme\': ' + err);
            });
        }
    },
    "finishme": {
        usage: "Displays White Creamy Finishing Sauce",
        delete: true,
        type: "image",
        process: function (bot, msg) {
            channel = msg.channel;

            bot.sendFile(channel, CONSTANTS.FINISHME).catch(err => {
                console.log('Error sending \'finishing sauce\': ' + err);
            })
        }
    },
    "needful" : {
        usage: "Displays 'Do the needful' meme",
        delete: true,
        type: "image",
        process: function (bot, msg) {
            channel = msg.channel;

            bot.sendFile(channel, CONSTANTS.NEEDFUL).catch(err => {
                console.log('Error sending \'do the needful\': ' + err);
            })
        }
    }
};
    
exports.images = images;