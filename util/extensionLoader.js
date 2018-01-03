function loadExtensions(Eris) {
    Object.defineProperty(Eris.Message.prototype, 'isFromDM', {
        get() {
            return this.channel.type === 1;
        }
    });

    Object.defineProperty(Eris.Message.prototype, 'bulkReact', {
        async value(reactions) {
            for (const reaction of reactions)
                await this.addReaction(reaction);
        }
    });

    Object.defineProperty(Eris.Member.prototype, 'isBlocked', {
        get() {
            return permissions.isBlocked(this.id);
        }
    });

    Object.defineProperty(Eris.GuildChannel.prototype, 'hasPermissions', {
        value(user, ...permissions) {
            let check = true;
            for (const permission of permissions) {
                if (!this.permissionsOf(user).has(permission)) {
                    check = false;
                    break;
                }
            }
            return check;
        }
    });

    Object.defineProperty(Eris.VoiceConnectionManager.prototype, 'isConnected', {
        value(guildId) {
            return this.has(guildId) && this.get(guildId).channelId !== null;
        }
    });

    return Eris;
}

module.exports = loadExtensions;