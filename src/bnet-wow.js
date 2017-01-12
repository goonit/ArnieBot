'use strict';

const bnet = require('battlenet-api')();
const apikey = require('../cuckbot-auth.json').bnetApiKey;
const util = require('util');
const wowClasses = require('../resources/wow-static-info.json').classes;
const wowRaces = require('../resources/wow-static-info.json').races;
const Discord = require('discord.js');

let WowArmory = {
	wowarmory: {
		usage: '~wowarmory realm|playername',
		delete: true,
		type: 'battle.net api',
		process: (bot, msg) => {
			let commandOptions = msg.content.split(' ')[1].split('|');
			if(commandOptions.length > 2 || commandOptions.length < 2) {
				msg.reply(`Incorrect number of parameters passed into the command. Correct usage: ${WowArmory.usage}`);
				return;
			}

			let realm = commandOptions[0];
			let name = commandOptions[1];

			let params = {
				origin: 'us',
				realm,
				name
			};
			bnet.wow.character.items(params, { apikey }, (err, body) => {
				if(err) {
					console.log(`err: ${util.inspect(err)}`);
					msg.reply(`Something happened when trying to retrieve data, I blame Ben`);
					return;
				}

				let playerItemLvl = body.items.averageItemLevel;
				let playerEqItemLvl = body.items.averageItemLevelEquipped;
				let playerClass = wowClasses.find(pClass => pClass.id === body.class).name;
				let playerRace = wowRaces.find(race => race.id === body.race).name;
				let baseArmoryUrl = 'http://us.battle.net/wow/character/';

				let embed = new Discord.RichEmbed();

				embed.title = 'Wow Stats';
				embed.color = 0xf8b700;
				embed.fields = [
					{
						name: 'Realm',
						value: `${body.realm}`
					},
					{
						name: 'Player Name',
						value: `${body.name}`
					},
					{
						name: 'Character',
						value: `${body.gender === 0 ? 'Male' : 'Female'} ${playerRace} ${playerClass}`
					},
					{
						name: 'Average Item Level',
						value: `${playerItemLvl}`
					},
					{
						name: 'Average Equipped Item Level',
						value: `${playerEqItemLvl}`
					},
					{
						name: 'Armory Link',
						value: `<${baseArmoryUrl}${body.realm}/${body.name}/simple>`
					}
				];

				msg.channel.sendEmbed(embed);
			});
		}
	}
};

exports.WowArmory = WowArmory;
