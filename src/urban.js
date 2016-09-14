"use strict";

const Promise = require('promise');
const agent = require('superagent-promise')(require('superagent'), Promise);
const util = require('util');

const urbanApi = "http://api.urbandictionary.com/v0/define?term=";

let urban = {
    "urban" : {
        usage: "Searches Urban Dictionary for a user-provided search term",
        delete: true,
        type: "query",
        cooldown: 5,
        process: (bot, msg, suffix) => {
            agent('GET', `${urbanApi}${suffix}`)
                .then(json => {
                    let channel = msg.channel;

                    let result = JSON.parse(json.res.text).list[0];

                    if (result === null) {
                        bot.sendMessage(channel, `\`\`\`\n${suffix} has no definition!\n\`\`\``);
                        return;
                    }

                    let response = `**${suffix}**\n\n\`\`\`\n${result.definition}\n\`\`\`\n\n**Example:** ${result.example}\n<${result.permalink}>`;
                    bot.sendMessage(channel, response);
                });
        }
    }
};

exports.urban = urban;