const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const util = require('util');

module.exports = class GetDBCommands extends Command {
    constructor(client) {
        super(client, {
            name: 'getdbcommands',
            group: 'utils',
            memberName: 'getdbcommands',
            description: 'gets commands from database',
            args: [
                {
                    key: 'type',
                    label: 'type',
                    prompt: 'what type of command would you like the retrieve from the database',
                    type: 'string',
                    infinite: false
                }
            ]
        });
    }

    async run(msg, args) {
        CustomCommand.filter({
            serverId: msg.guild.id,
            commandType: args.type
        }).run({ readMode: 'majority' }).then((result) => {
            console.log(`commands in database: ${util.inspect(result)}`);
        });
    }
};
