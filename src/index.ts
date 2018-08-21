const Commando = require('discord.js-commando');
const path = require('path');
const auth = require('./cuckbot-auth.json');
const util = require('util');

import { loadDbCommands } from './dbModels/loadCommands';
import { CommandMessage } from 'discord.js-commando';
import { GuildMember } from 'discord.js';

const client = new Commando.Client({
	selfBot: false,
	commandPrefix: '~',
	owner: '144606974758092801'
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
		console.log(
			`Client ready; logged in as ${client.user.username}#${
				client.user.discriminator
			} (${client.user.id})`
		);

		loadDbCommands(client);
	})
	.on('disconnect', () => {
		console.warn('Disconnected');
	})
	.on('reconnect', () => {
		console.warn('Reconnecting...');
	})
	.on('guildMemberAdd', (member: GuildMember) => {
		console.log(
			`new member ${member.displayName} has joined. Assigning new role`
		);
		let role = member.guild.roles.find('name', 'Member');
		if (!role) {
			console.log(`Member role was not found`);
			return;
		}

		member
			.addRole(role)
			.then((withRole: GuildMember) => {
				console.log(`Added Member role to ${withRole.nickname}`);
			})
			.catch((err) => console.log(err));
	})
	.on('commandError', (cmd: any, err: any) => {
		if (err instanceof Commando.FriendlyError) {
			return;
		}
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('unknownCommand', (message: CommandMessage) => {
		console.log(`Unknown command: ${util.inspect(message)}`);
	});

process.on('uncaughtException', (err: any) => {
	console.log(err);
});

client.registry
	.registerDefaultTypes()
	.registerGroup('sounds', 'sounds')
	.registerGroup('text', 'text')
	.registerGroup('images', 'images')
	.registerGroup('utils', 'utils')
	.registerGroup('misc', 'misc')
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(auth.token);
