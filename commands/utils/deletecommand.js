const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const util = require('util');
const path = require('path');

module.exports = class DeleteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deletecommand',
            group: 'utils',
            memberName: 'deletecommand',
            description: 'Deletes a command from the database, and removes the associated sound file if its a sound command',
            args: [
                {
                    key: 'command',
                    label: 'command',
                    prompt: 'What command would you like to delete?',
                    type: 'string',
                    infinite: false
                }
            ]
        });
    }

    async run(msg, args) {
        CustomCommand.filter({
            serverId: msg.guild.id,
            commandText: args.command
        }).run({ readMode: 'majority' }).then((result) => {
            if(result.length > 0) {
                result[0].delete().then((deleteResult) => {
                    let cmd = this.client.registry.resolveCommand(args.command.slice(1));
                    this.client.registry.unregisterCommand(cmd);

                    if(deleteResult.commandType === 'sound') {
                        DeleteCommand.removeFile(path.resolve('resources/', `${args.command.slice(1)}${msg.guild.id}.mp3`));
                        // DeleteCommand.removeFile(path.resolve('resources/', `${'rideeternal'}${msg.guild.id}.mp3`));
                    }

                    msg.reply(`Custom command '${args.command}' was successfully deleted`);
                }).catch((err) => {
                    console.log(`error: ${err}`);
                });
            } else {
                msg.reply(`Command '${args.command}' was not found!`);
            }
        });
    }

    static removeFile(file) {
        fs.unlink(file);
    };
};
