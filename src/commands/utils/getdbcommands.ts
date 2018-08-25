const CustomCommand = require('../../dbModels/customCommand.js');
const util = require('util');

import { Message } from 'discord.js';
import { CommandoClient, CommandMessage, Command } from 'discord.js-commando';

export class GetDBCommands extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'getdbcommands',
			group: 'utils',
			memberName: 'getdbcommands',
			description: 'gets commands from database',
			args: [
				{
					key: 'type',
					label: 'type',
					prompt:
						'what type of command would you like the retrieve from the database',
					type: 'string',
					infinite: false
				}
			]
		});
	}

	public async run(
		msg: CommandMessage,
		args: any
	): Promise<Message | Message[]> {
		CustomCommand.filter({
			serverId: msg.guild.id,
			commandType: args.type
		})
			.run({ readMode: 'majority' })
			.then((result: any) => {
				console.log(`commands in database: ${util.inspect(result)}`);
			});

		return msg.delete();
	}
}
