const { Command } = require('discord.js-commando');
const CustomCommand = require('../../dbModels/customCommand.js');
const Embed = require('discord.js').RichEmbed;

module.exports = class CuckHelp extends Command {
  constructor(client) {
    super(client, {
      name: 'cuckhelp',
      group: 'utils',
      memberName: 'cuckhelp',
      description:
        'Send the user an embed with help information abotu the bot as a dm.',
      args: [
        {
          key: 'type',
          label: 'type',
          prompt: `To list commands, type '~cuckhelp commands'. To view how to create custom commands, type '~cuckhelp creation'`,
          type: 'string',
          default: 'commands',
          infinite: false
        }
      ]
    });
  }

  async run(msg, args) {
    CustomCommand.filter({ serverId: msg.guild.id })
      .run({ readMode: 'majority' })
      .then(result => {
        let imageCommands = result.filter(cmd => cmd.commandType === 'image');
        let textCommands = result.filter(cmd => cmd.commandType === 'text');
        let soundCommands = result.filter(cmd => cmd.commandType === 'sound');
        let embed = {};
        let embedList = [];

        if (args.type === 'commands') {
          embedList = this.buildCommandsHelp(
            imageCommands,
            textCommands,
            soundCommands
          );
          msg.author.send('', embedList[0]).then(() => {
            msg.author.send('', embedList[1]).then(() => {
              msg.author.send('', embedList[2]).then(() => {
                msg.reply(`Check your DM's`);
              });
            });
          });
        } else if (args.type === 'creation') {
          embed = this.buildCreationHelp();
          msg.author
            .send('', embed)
            .then(() => {
              msg.reply(`Check your DM's`);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          msg.reply(`That help command is not supported`);
        }
      });
  }

  buildCommandsHelp(
    imageCommandsFromDb,
    textCommandsFromDb,
    soundCommandsFromDb
  ) {
    let embed = new Embed();

    embed.title = 'Cuckbot Commands';
    embed.color = 0x4286f4;

    let textEmbed = new Embed();
    textEmbed.title = 'Text Commands';
    textEmbed.color = 0x4286f4;

    let soundEmbed = new Embed();
    soundEmbed.title = 'Sound Commands';
    soundEmbed.color = 0x4286f4;

    let imageEmbed = new Embed();
    imageEmbed.title = 'Image Commands';
    imageEmbed.color = 0x4286f4;

    // ----- TEXT COMMANDS ----- //

    let loadedTextCommands = this.client.registry.resolveGroup('text').commands;

    let allTextCommands = loadedTextCommands.map(
      textCommand => textCommand.memberName
    );

    if (textCommandsFromDb.length > 0) {
      let customTextCommands = textCommandsFromDb.map(customText =>
        customText.commandText.slice(1)
      );

      allTextCommands = allTextCommands.concat(customTextCommands).join(', ');
    }

    this.buildCommandString(allTextCommands, textEmbed);

    // embed.addField('Text Commands', allTextCommands, false);

    // ----- IMAGE COMMANDS ----- //

    let loadedImageCommands = this.client.registry.resolveGroup('images')
      .commands;

    let allImageCommands = loadedImageCommands.map(
      imageCommand => imageCommand.memberName
    );

    if (imageCommandsFromDb.length > 0) {
      let customImageCommands = imageCommandsFromDb.map(customImage =>
        customImage.commandText.slice(1)
      );

      allImageCommands = allImageCommands
        .concat(customImageCommands)
        .join(', ');
    }

    this.buildCommandString(allImageCommands, imageEmbed);

    // ----- SOUND COMMANDS ----- //

    let loadedSoundCommands = this.client.registry.resolveGroup('sounds')
      .commands;

    let allSoundCommands = loadedSoundCommands.map(
      soundCommand => soundCommand.memberName
    );

    if (soundCommandsFromDb.length > 0) {
      let customSoundCommands = soundCommandsFromDb.map(customSound =>
        customSound.commandText.slice(1)
      );

      allSoundCommands = allSoundCommands
        .concat(customSoundCommands)
        .join(', ');
    }

    this.buildCommandString(allSoundCommands, soundEmbed);

    return [textEmbed, imageEmbed, soundEmbed];
  }

  buildCreationHelp() {
    let creatingCommands =
      'For creating commands, use the following format:\n' +
      '*~createcommand ~[commandname] [commandtype (image, text, sound)] [imageurl, text, yturl] [starttime (format: 00:00:00)] [duration (seconds)*\n' +
      'Ex:\t\t*~createcommand ~test sound <youtube link> 00:00:43 07*\n' +
      '\t\t*~createcommand ~imagetest image http://i.imgur.com/kTRCbX0.gif*';

    let deletingCommands =
      '*~deletecommand ~[commandname]*\n' + 'Ex:\t\t*~deletecommand ~facepalm*';

    let embed = new Embed();

    embed.title = 'Cuckbot Commands';
    embed.color = 0x4286f4;
    embed.addField(
      'Prefix',
      "Command prefix (trigger) character is '~'",
      false
    );
    embed.addField('Creating Custom Commands', creatingCommands, false);
    embed.addField('Deleting Commands', deletingCommands, false);

    return embed;
  }

  buildCommandString(commandString, embedObject) {
    if (commandString.length <= 2048) {
      embedObject.description = commandString;
    } else {
      let commandArray = commandString.split(',');
      let tempArray = [];
      let charCount = 0;
      let descriptionSet = false;

      for (let commandName of commandArray) {
        charCount += commandName.length;
        tempArray.push(commandName);

        if (charCount >= 1900) {
          embedObject.description = tempArray.join(', ');
          charCount = 0;
          tempArray = [];

          descriptionSet = true;
        }

        if (descriptionSet && charCount >= 900) {
          embedObject.addField(
            `${embedObject.title} (Contd.)`,
            tempArray.join(', '),
            false
          );
          charCount = 0;
          tempArray = [];
        }
      }

      let existsInEmbed = embedObject.fields.filter(field =>
        field.includes(tempArray[0])
      );

      if (
        tempArray.length > 0 &&
        embedObject.description &&
        !embedObject.description.includes(tempArray[0]) &&
        existsInEmbed.length === 0
      ) {
        embedObject.addField(
          `${embedObject.title} (Contd.)`,
          tempArray.join(', '),
          false
        );
      }
    }
  }
};
