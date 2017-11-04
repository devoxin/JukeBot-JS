function loadExtensions(Eris) {
    Object.defineProperty(Eris.Message.prototype, "isFromDM", {
        get() {
            return this.channel.type === 1;
        }
    });
    
    Object.defineProperty(Eris.Member.prototype, "isBlocked", {
        get() {
            return permissions.isBlocked(this.id);
        }
    });

    Object.defineProperty(Eris.GuildChannel.prototype, "hasPermissions", {
        value(user, ...permissions) {
            let check = true;
            for (permission of permissions) {
                if (!this.permissionsOf(user).has(permission)) {
                    check = false;
                    break;
                }
            }
            return check;
        }
    });

    return Eris;
}

module.exports = loadExtensions;