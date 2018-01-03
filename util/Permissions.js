const owners = config.prop.owners;

module.exports = {

    hasRole(member, rolename) {
        if (!member.guild) return false;
        const role = member.guild.roles.find(r => r.name === rolename);
        return role && member.roles.includes(role.id);
    },

    isAdmin(member) {
        return module.exports.hasRole(member, 'DJ') || owners.includes(member.id) || member.guild.ownerID === member.id;
    },

    isBlocked(member) {
        const hdb = require('../src/config.json').prop.blocked;
        delete require.cache[require.resolve('../src/config.json')];

        return (module.exports.hasRole(member, 'NoMusic') || hdb.includes(member.id)) && !owners.includes(member.id) && member.guild.ownerID !== member.id;
    }

};
