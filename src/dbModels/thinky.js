const auth = require('../cuckbot-auth.json');

var thinky = require('thinky')({
	host: auth.dbHost,
	port: 28015,
	db: auth.db
});

module.exports = thinky;
