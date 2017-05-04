const owners = config.owners;

module.exports = {

	hasRole(member, rolename) {
		let role = member.guild.roles.find(r => r.name === rolename);
		if (!role) return false;
		if (member.roles.includes(role.id)) return true;
		else return false;
	},

	isAdmin(member) {
		if (module.exports.hasRole(member, "DJ") || owners.includes(member.id) || member.guild.ownerID === member.id) return true;
		else return false;
	},

	isBlocked(member) {
		let hdb = require(`../src/config.json`).hardblock;
		delete require.cache[require.resolve(`../src/config.json`)];

		if ((module.exports.hasRole(member, "NoMusic") || hdb.includes(member)) && !owners.includes(member) && member.guild.ownerID !== member) return true;
		else return false;
	},

	isDonator(member) {
		let donators = require(`../src/config.json`).donators;
		delete require.cache[require.resolve(`../src/config.json`)];

		if (donators.includes(member) || owners.includes(member)) return true;
		else return false;
	}

}
