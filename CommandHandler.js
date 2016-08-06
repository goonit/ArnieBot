"use strict";

const chalk = require("chalk"),
    c = new chalk.constructor({
        enabled: true
    });
const admins = require('./admins.json').admins;

let serverC = c.black.bold,
    channelC = c.green.bold,
    userC = c.cyan.bold,
    warningC = c.yellow.bold,
    errorC = c.red.bold,
    botC = c.magenta.bold;

let cmdIndex = [];
let cmdUsage = [];
let lastExecTime = {};
setInterval(() => {
    lastExecTime = {}
}, 3600000);

exports.commandHandler = (bot, msg, suffix, cmdTxt, msgPrefix, commandOptions) => {
        processCmd(bot, msg, suffix, cmdTxt, msgPrefix, commandOptions);
};

function processCmd(bot, msg, suffix, cmdTxt, msgPrefix, commandOptions) {

    var cmd = require('./bot.js').Commands[cmdTxt];
    
    commandUsage(cmdTxt);
    
    if (cmd == null) bot.sendMessage(msg.channel.id, "There was an error with that command, Please try again");
    else {
        // if (!(admins.indexOf(msg.author.id) > -1) && cmd.cooldown > 0) {
        if (cmd.cooldown > 0) {
            if (!lastExecTime.hasOwnProperty(cmdTxt))
                lastExecTime[cmdTxt] = {};

            if (!lastExecTime[cmdTxt].hasOwnProperty(msg.author.id))
                lastExecTime[cmdTxt][msg.author.id] = new Date().valueOf();
            else {
                let currentTime = Date.now();

                if (currentTime < (lastExecTime[cmdTxt][msg.author.id] + (cmd.cooldown * 1000))) {
                    if (cmdTxt == "gfym") {
                        bot.sendMessage(msg.channel.id, "**" + msg.author.username + " **give your jaw a rest for a bit!");
                    } else {
                        bot.sendMessage(msg.channel.id, "**" + msg.author.username + " **that command is currently on cooldown for **" +
                            Math.round(((lastExecTime[cmdTxt][msg.author.id] + cmd.cooldown * 1000) - currentTime) / 1000) + "** more seconds.");
                    }

                    return;
                }
                lastExecTime[cmdTxt][msg.author.id] = currentTime;
            }
        }
        // serverC("@" + msg.channel.guild.name + ":") +
        console.log(channelC(" #" + msg.channel.name) + ": " + botC("@WishBot") + " - " + warningC(msgPrefix + "" + cmdTxt) + " was used by " + userC(msg.author.username));
        try {
            cmd.process(bot, msg, suffix, cmdIndex, cmdUsage, commandOptions);
            
            if (cmd.delete) {
                bot.deleteMessage(msg).catch(err => {
                    console.log("error when deleting message: " + err);
                });
            }
        } catch (err) {
            bot.sendMessage(msg.channel.id, "```" + err + "```");
            console.log(errorC(err.stack));
        }
    }
}

exports.processCmd = processCmd;

function commandUsage(cmdTxt) {
    if (cmdIndex.indexOf(cmdTxt) > -1) {
        cmdUsage[cmdIndex.indexOf(cmdTxt)]++;
    } else {
        cmdIndex.push(cmdTxt);
        cmdUsage.push(1);
    }
}