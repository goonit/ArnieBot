var utilities = {
    "cuckhelp": {
        usage: "Send user a PM with a list of commands",
        delete: true,
        type: "utilities",
        process: function (bot, msg) {
            bot.sendMessage(msg.author,
                `\`\`\`Here are the commands I support:
          **To issue a command, use the \`~\` as a prefix!**   
          **BOO-DO-DO-DOOOOOO:** cena 
          **BOO-DO-DO-DOOOOOO (with airhorns):** cenahorn 
          **Random ASCII Dick:** dongerino
          **\'You Son of a Bitch\':** sob
          **\'Who killed the dinos?\':** dinos
          **\'Fuck you asshole\':** fua
          **\'break your god damn spine\':** spine
          
          **\'SHUT UP\':** stfu
          **\'I am INVINCIBLE\':** boris
          **\'BULLSHIT\':** bs
          **\'COCAINUM\':** cocainum
          **GRAPEFRUIT:** gfym
          **ASCII salt:** salt
          **feelsgoodman meme:** feelsgood
          **White Creamy Sauce:** finishme
          **Do the needful:** needful\`\`\``
            ).then(m => {
                bot.reply(msg, `I\'ve sent you my commands in PM`);
            });
        }
    }
};

exports.utilities = utilities;