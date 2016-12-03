'use strict';

const Discord = require('discord.js');
const _ = require('lodash');

const processCmd = require('./CommandHandler.js').commandHandler;
const loadDbCommands = require('./src/loadDbCommands.js').loadDbCommands;

const auth = require('./cuckbot-auth.json');
const client = new Discord.Client();

let Commands = {};

exports.Commands = Commands;

client.on('error', (m) => console.log('[error]', m));

client.on('ready', () => {
  // retrieve all custom commands from the database
  loadDbCommands();
});

client.on('guildMemberAdd', (guild, member) => {
  let role = guild.roles.find('name', 'Member');
  if (!role) {
    guild.defaultChannel.sendMessage(`Failure when attemping to assign ${member.user.username} a default role!`);
    return member.user.sendMessage(`Welcome to No Senpai Yamete you cuck!`);
  }
  member.addRole(role);
});

client.on('message', m => {
  if (client.user.id === m.author.id) {
    console.log('returning because client id and user id are the same');
    return;
  }

  if (m.content.startsWith('(╯°□°）╯︵ ┻━┻')) {
    m.channel.sendMessage('┬─┬﻿ ノ( ゜-゜ノ)');
    m.reply('Calm your shit!');

    return;
  }

  const msgPrefix = '~';

  if (!m.content.startsWith(msgPrefix)) return;

  let formattedMsg = m.content.substring(msgPrefix.length, m.content.length);
  let commandOptions = _.drop(formattedMsg.split(' '));
  let cmdTxt = formattedMsg.split(' ')[0].toLowerCase();

  if (Commands.hasOwnProperty(cmdTxt)) {
    if (commandOptions.length > 2) {
      commandOptions.shift();
    }

    console.log(`commandOptions: ${commandOptions.toString()}`);
    processCmd(client, m, formattedMsg.substring((formattedMsg.split(' ')[0]).length + 1), cmdTxt, msgPrefix, commandOptions);
  }
});

// process.on('uncaughtException', function(err) {
//     // Handle ECONNRESETs caused by `next` or `destroy`
//     if (err.code == 'ECONNRESET') {
//         // Yes, I'm aware this is really bad node code. However, the uncaught exception
//         // that causes this error is buried deep inside either discord.js, ytdl or node
//         // itself and after countless hours of trying to debug this issue I have simply
//         // given up. The fact that this error only happens *sometimes* while attempting
//         // to skip to the next video (at other times, I used to get an EPIPE, which was
//         // clearly an error in discord.js and was now fixed) tells me that this problem
//         // can actually be safely prevented using uncaughtException. Should this bother
//         // you, you can always try to debug the error yourself and make a PR.
//         console.log('Got an ECONNRESET! This is *probably* not an error. Stacktrace:');
//         console.log(err.stack);
//     } else {
//         // Normal error handling
//         console.log(err);
//         console.log(err.stack);
//         process.exit(0);
//     }
// });

client.login(auth.token);
