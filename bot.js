"use strict";

const Discord = require("discord.js");

const url = require('url');
const _ = require('lodash');

const Sounds = require('./src/sounds.js');
const Images = require('./src/images.js');
const Ascii = require('./src/asciiPictures.js');
const Utilities = require('./src/utilities.js');

// Saved.read();

const processCmd = require('./CommandHandler.js').commandHandler;

const auth = require('./cuckbot-auth.json');
const admins = require('./admins.json').admins;

const client = new Discord.Client({
    autoReconnect: true
});

let Commands = {};

Object.assign(Commands, Images.images, Sounds.sounds, Ascii.asciiPictures, Utilities.utilities);

client.on('warn', (m) => console.log('[warn]', m));
client.on('debug', (m) => console.log('[debug]', m));
client.on('error', (m) => console.log('[error]', m));

client.on('ready', () => {
    console.log("Cuckbot is ready!");
});

client.on('message', m => {

    if (client.user.id == m.author.id) {
        console.log('returning because client id and user id are the same');
        return;
    }

    if (m.content.startsWith("(╯°□°）╯︵ ┻━┻")) {
        client.sendMessage(m.channel, "┬─┬﻿ ノ( ゜-゜ノ)");
        client.reply(m, "Calm your shit!");

        return;
    }

    const msgPrefix = "~";

    if (!m.content.startsWith(msgPrefix)) return;

    let formattedMsg = m.content.substring(msgPrefix.length, m.content.length);
    let commandOptions = _.drop(formattedMsg.split(" "));
    let cmdTxt = formattedMsg.split(" ")[0].toLowerCase();

    if (Commands.hasOwnProperty(cmdTxt)){
        if (commandOptions.length > 2) {
            commandOptions.shift();
        }s

        console.log("commandOptions: " + commandOptions.toString());
        processCmd(client, m, formattedMsg.substring((formattedMsg.split(" ")[0]).length + 1), cmdTxt, msgPrefix, commandOptions);
    }
});

process.on('uncaughtException', function(err) {
    // Handle ECONNRESETs caused by `next` or `destroy`
    if (err.code == 'ECONNRESET') {
        // Yes, I'm aware this is really bad node code. However, the uncaught exception
        // that causes this error is buried deep inside either discord.js, ytdl or node
        // itself and after countless hours of trying to debug this issue I have simply
        // given up. The fact that this error only happens *sometimes* while attempting
        // to skip to the next video (at other times, I used to get an EPIPE, which was
        // clearly an error in discord.js and was now fixed) tells me that this problem
        // can actually be safely prevented using uncaughtException. Should this bother
        // you, you can always try to debug the error yourself and make a PR.
        console.log('Got an ECONNRESET! This is *probably* not an error. Stacktrace:');
        console.log(err.stack);
    } else {
        // Normal error handling
        console.log(err);
        console.log(err.stack);
        process.exit(0);
    }
});

client.loginWithToken(auth.token);