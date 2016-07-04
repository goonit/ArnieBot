var CONSTANTS = require("../constants.js");
var dongerino = require("../resources/dongerinos.json").dongerino;


var asciiPictures = {
    "salt": {
        usage: "Displays salt ascii picture in chat",
        delete: true,
        type: "ascii",
        process: function (bot, msg) {
            var channel = msg.channel;

            bot.sendMessage(channel, '\n\n▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▄██████▄\n' +
                '▒▒▒▒▒▒▒▒▒▒▄▄████████████▄\n' +
                '▒▒▒▒▒▒▄▄██████████████████\n' +
                '▒▒▒▄████▀▀▀██▀██▌███▀▀▀████\n' +
                '▒▒▐▀████▌▀██▌▀▐█▌████▌█████▌\n' +
                '▒▒█▒▒▀██▀▀▐█▐█▌█▌▀▀██▌██████\n' +
                '▒▒█▒▒▒▒████████████████████▌\n' +
                '▒▒▒▌▒▒▒▒█████░░░░░░░██████▀\n' +
                '▒▒▒▀▄▓▓▓▒███░░░░░░█████▀▀\n' +
                '▒▒▒▒▀░▓▓▒▐█████████▀▀▒\n' +
                '▒▒▒▒▒░░▒▒▐█████▀▀▒▒▒▒▒▒\n' +
                '▒▒░░░░░▀▀▀▀▀▀▒▒▒▒▒▒▒▒▒\n');
        }
    },
    "dongerino": {
        usage: "Prints a random ascii dongerino in chat",
        delete: true,
        type: "ascii",
        process: function (bot, msg) {
            var channel = msg.channel;

            console.log('preparing to print dongerino');

            var number = Math.floor(Math.random() * (dongerino.length));

            console.log('random number chosen: ' + number);

            bot.sendMessage(channel, dongerino[number]);
        }
    }
};

exports.asciiPictures = asciiPictures;