'use strict';

const dongerino = require('../resources/dongerinos.json').dongerino;

let asciiPictures = {
	salt: {
		usage: 'Displays salt ascii picture in chat',
		delete: true,
		type: 'ascii',
		process: (bot, msg) => {
			let channel = msg.channel;

			channel.sendMessage('\n\n▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▄██████▄\n' +
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
	dongerino: {
		usage: 'Prints a random ascii dongerino in chat',
		delete: true,
		type: 'ascii',
		process: (bot, msg) => {
			let channel = msg.channel;

			let number = Math.floor(Math.random() * dongerino.length);

			channel.sendMessage(dongerino[number]);
		}
	},
	lenny: {
		usage: 'Post lenny face meme in chat',
		delete: false,
		type: 'image',
		process: (bot, msg) => {
			let channel = msg.channel;

			channel.sendMessage('( ͡° ͜ʖ ͡°)');
		}
	}
};

exports.asciiPictures = asciiPictures;
