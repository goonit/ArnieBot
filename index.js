const Commando = require('discord.js-commando');
const path = require('path');
const auth = require('./cuckbot-auth.json');
const commandLoader = require('./dbModels/loadCommands.js');

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

		commandLoader.loadDbCommands(client);
	})
	.on('disconnect', () => {
		console.warn('Disconnected');
	})
	.on('reconnect', () => {
		console.warn('Reconnecting...');
	})
	.on('guildMemberAdd', (member) => {
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
			.then((withRole) => {
				console.log(`Added Member role to ${withRole.displayName}`);
			})
			.catch((err) => console.log(err));
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof Commando.FriendlyError) {
			return;
		}
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
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
