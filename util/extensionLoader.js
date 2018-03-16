const permissions = require('./Permissions.js');

function loadExtensions(Eris) {
    Object.defineProperties(Eris.Message.prototype, {
        'isFromDM': {
            get() {
                return this.channel.type === 1;
            }
        },
        'bulkReact': {
            async value(reactions) {
                for (const reaction of reactions)
                    await this.addReaction(reaction);
            }
        }
    });

    Object.defineProperties(Eris.Member.prototype, {
        'isBlocked': {
            get() {
                return permissions.isBlocked(this.id);
            }
        },
        'isAdmin': {
            get() {
                return permissions.isAdmin(this);
            }
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