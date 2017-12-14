const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand');
const fs = require('fs');
const exec = require('child_process').exec;
const path = require('path');

module.exports = class RestoreCommands extends Command {
  constructor(client) {
    super(client, {
      name: 'restorecommands',
      group: 'utils',
      memberName: 'restorecommands',
      description:
        'Attempts to restore all custom commands from rethinkDb database.'
    });
  }

  async run(msg) {}
};
