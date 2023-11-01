function loadExtensions (Eris) {
  Object.defineProperties(Eris.Member.prototype, {
    'isBlocked': {
      get () {
        return this.guild.roles.find(r => r.name === 'JukeBlock' && this.roles.includes(r.id)); // TODO: Link this into config for global blacklists?
      }
    },
    'isAdmin': {
      get () {
        return this.guild.roles.find(r => r.name === 'DJ' && this.roles.includes(r.id)) || this.id === '180093157554388993'; // TODO: Link this into config
      }
    }
  });

  Object.defineProperty(Eris.GuildChannel.prototype, 'hasPermissions', {
    value (user, ...permissions) {
      const userPermissions = this.permissionsOf(user);
      return permissions.every(userPermissions.has);
    }
  });

  Object.defineProperty(Eris.VoiceConnectionManager.prototype, 'isConnected', {
    value (guildId) {
      return this.has(guildId) && this.get(guildId).channelID !== null;
    }
  });

  return Eris;
}

module.exports = loadExtensions;
