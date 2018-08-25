import { Message, Collection } from 'discord.js';
import { CommandoClient, CommandMessage, Command } from 'discord.js-commando';

export class Clear extends Command {
	public constructor(client: CommandoClient) {
		super(client, {
			name: 'clear',
			group: 'utils',
			memberName: 'clear',
			description: 'Clears x messages from the channel',
			args: [
				{
					key: 'clearnum',
					label: 'clearnum',
					prompt: 'How many messages would you like to remove from chat?',
					type: 'integer',
					default: 1,
					infinite: false
				}
			]
		});
	}

	public async run(
		msg: CommandMessage,
		args: any
	): Promise<Message | Message[]> {
		let deleteNum = args.clearnum + 1;
		let messages: Collection<string, Message> = await msg.channel.fetchMessages(
			{ limit: deleteNum }
		);
		let msgCollection: Collection<
			string,
			Message
		> = await msg.channel.bulkDelete(messages);

		return msgCollection.array();
	}
}
