const owners = require("../src/config.json").owners;

module.exports = {

	hasRole(member, rolename) {
		let role = member.guild.roles.find(r => r.name === rolename);
		if (!role) return false;
		if (member.roles.includes(role.id)) return true;
		else return false;
	},

	isAdmin(member, guild, db) {
		if (db.admins.includes(member.id) || owners.includes(member.id) || member.guild.ownerID === member.id) return true;
		else return false;
	},

	isBlocked(member, guild, db) {
		let hdb = require(`../src/config.json`).hardblock;
		delete require.cache[require.resolve(`../src/config.json`)];

		if ((db.blocked.includes(member) || hdb.includes(member)) && !owners.includes(member) && guild.ownerID !== member) return true;
		else return false;
	},

	isDonator(member) {
		let donators = require(`../src/config.json`).donators;
		delete require.cache[require.resolve(`../src/config.json`)];

		if (donators.includes(member) || owners.includes(member)) return true;
		else return false;
	}

}
