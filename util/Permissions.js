module.exports = {

	hasRole(member, rolename) {
		let role = member.guild.roles.find(r => r.name === rolename);
		if (!role) return false;
		if (member.roles.includes(role.id)) return true;
		else return false;
	},

	isAdmin(member, guild) {
		let db = require(`../src/data/${guild}.json`);
		delete require.cache[require.resolve(`../src/data/${guild}.json`)];

		if (db.admins.includes(member) || member.guild.ownerID === member.user.id) return true;
		else return false;
	},

	isBlocked(member, guild) {
		let db = require(`../src/data/${guild}.json`);
		delete require.cache[require.resolve(`../src/data/${guild}.json`)];

		if (db.blocked.includes(member)) return true;
		else return false;
	}

}
