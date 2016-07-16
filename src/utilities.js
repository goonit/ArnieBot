var utilities = {
    "cuckhelp": {
        usage: "Send user a PM with a list of commands",
        delete: false,
        type: "utilities",
        process: function (bot, msg) {
            bot.sendMessage(msg.author,
                "Here's a list of my commands\n\n" +
                "Command prefix (trigger) character is **\'~\'**\n\n" +

                "__**SOUNDS**__\n\n" +
                "\`\`\`" +
                "**BOO-DO-DO-DOOOOOO:** cena\n" +
                "**BOO-DO-DO-DOOOOOO (with airhorns):** cenahorn\n" +
                "**YES LAWD:** yeslawd\n" +
                "**YES NIGGA:** yesnigga\n" +
                "**Random \'watermalone\' clip:** watermalone\n" +
                "**John Cena quotes from \'Trainwreck\':** asslick/dickpunch/fuckenter\n" +
                "**Heavy's Falcon Punch (TF2):** pawnch\n" +
                "**Oh shiiiiiiit:** ohshit\n" +
                "**\'You Son of a Bitch\':** sob\n" +
                "**\'Who killed the dinos?\':** dinos\n" +
                "**\'Fuck you asshole\':** fua\n" +
                "**\'break your god damn spine\':** spine\n" +
                "**\'SHUT UP\':** stfu\n" +
                "**\'I am INVINCIBLE\':** boris\n" +
                "**\'BULLSHIT\':** bs\n" +
                "**\'COCAINUM\':** cocainum\n" +
                "**GRAPEFRUIT:** gfym\`\`\`\n\n" +

                "__**Images or ASCII**__\n\n" +
                "\`\`\`" +
                "**Random ASCII Dick:** dongerino\n" +
                "**ASCII salt:** salt\n" +
                "**feelsgoodman meme:** feelsgoodman\n" +
                "**feelsbadman meme:** feelsbadman\n" +
                "**lenny meme:** lenny\n" +
                "**Random \'Rapey Woody\' meme:** woody\n" +
                "**White Creamy Sauce:** finishme\n" +
                "**Do the needful:** needful\`\`\`\n\n"
            ).then(m => {
                bot.reply(msg, `I\'ve sent you my commands in PM`);
            });
        }
    },
    "clear": {
        usage: "Clears x number of messages",
        delete: true,
        type: "utilities",
        process: function (bot, msg, commandOptions) {
            var channel = msg.channel;

            console.log('commandOptions: ' + commandOptions);
            if (commandOptions.length > 2) {
                bot.reply("Incorrect usage! There are too many parameters for that command.");
                return;
            }

            var numberToDelete = Number(commandOptions) + 1; // add one so it deletes the clear message as well

            bot.getChannelLogs(channel, numberToDelete).then( messages => {
                bot.deleteMessages(messages).catch( err => {
                    console.log("there was a problem deleting messages: " + err);
                });
            }).catch(err => {
                console.log('error collecting messages for removal: ' + err);
            });
        }
    }
};

exports.utilities = utilities;