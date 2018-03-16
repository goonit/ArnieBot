const thinky = require('./thinky.js');
const type = thinky.type;

let CustomCommand = thinky.createModel('CustomCommand', {
	id: type.string(),
	serverId: type.string(),
	commandText: type.string(), // text that triggers the command (must have prefix ~)
	commandType: type.string(), // type of command ('image', 'text', or 'sound')
	imageUrl: type.string(), // the url for the image if it's an imageCommand
	commandResponse: type.string(), // the text the bot responds to the command with (if it's a 'text' command)
	createDate: type.date(),
	createUser: type.string()
});

module.exports = CustomCommand;
