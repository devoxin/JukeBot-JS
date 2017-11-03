function loadExtensions(Eris) {
    Object.defineProperty(Eris.Message.prototype, "isFromDM", {
        get() {
            return this.channel.type === 1;
        }
    });
    
    Object.defineProperty(Eris.Message.prototype, "mentionsSelf", {
        get() {
            return this.mentions.find(m => m.id === client.user.id) !== undefined;
        }
    });
    
    Object.defineProperty(Eris.Member.prototype, "isBlocked", {
        get() {
            return permissions.isBlocked(this.id);
        }
    });

    return Eris;
}

module.exports = loadExtensions;