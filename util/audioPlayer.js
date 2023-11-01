const ytutil = require('./youtubeHandler.js');

class AudioPlayer {
    constructor (client, guildId) {
        this._client = client;
        this._guildId = guildId;
        this.queue = [];
        this.current = null;
        this.msgChannel = null;
        this.skips = new Set();
        this.repeat = 0;

        this.bassBoost = null;
    }

    /*
     * Sets repeat mode
     * 0 - off
     * 1 - single
     * 2 - all
     */
    setRepeat (mode) {
        let val = Number(mode) || 0;
        val = Math.max(Math.min(val, 2), 0);

        this.repeat = val;
    }

    getRepeatReadable () {
        if (this.repeat === 2) {
            return 'all';
        } else if (this.repeat === 1) {
            return 'single';
        } else if (this.repeat === 0) {
            return 'none';
        } else {
            return 'unknown';
        }
    }

    voteSkip (userId) {
        this.skips.add(userId);
        return this.skips.size;
    }

    setAnnounce (channelId) {
        this.msgChannel = channelId;
    }

    add (track) {
        this.queue.push(track);
    }

    setBassBoost(gain) {
        if (gain === null || gain === 0) {
            this.bassBoost = null;
        } else {
            this.bassBoost = ['-af', `equalizer=f=40:width_type=h:width=50:g=${gain}`];
        }
    }

    async play () {
        if (!this._client.voiceConnections.isConnected(this._guildId)) {
            return;
        }

        if (this.queue.length === 0) {
            this._announce('Queue Concluded', 'Queue more songs to keep the party going!');
            this.repeat = 0;
            this.current = null;

            if (this._client.voiceConnections.has(this._guildId)) {
                this._client.leaveVoiceChannel(this._client.voiceConnections.get(this._guildId).channelID);
            }

            return;
        }

        this.current = this.queue.shift();
        console.log(this.current);

        const voiceConnection = this._client.voiceConnections.get(this._guildId);
        const playbackURL = this.current.src === 'youtube'
            ? await ytutil.getFormats(this.current.id)
            : this.current.id;

        const format = this.current.src === 'youtube' ? 'webm' : null;

        if (this.current.src === 'youtube') {
            this.current.duration = await ytutil.getDuration(this.current.id);
        }

        if (!playbackURL) {
            this._announce('Track Unplayable', 'This track is not playable, skipping...');
            return this.play();
        }

        this._announce('Now Playing', this.current.title);

        voiceConnection.play(playbackURL, {
            encoderArgs: this.bassBoost,
            format: this.bassBoost ? null : format
        });

        voiceConnection.once('end', () => {
            if (this.repeat === 2) {
                this.queue.push(this.current);
            } else if (this.repeat === 1) {
                this.queue.unshift(this.current);
            }

            this.skips.clear();
            this.play();
        });
    }

    stop () {
        const voiceConnection = this._client.voiceConnections.get(this._guildId);

        if (!voiceConnection) {
            return;
        }

        voiceConnection.stopPlaying();
    }

    destroy () {
        this.queue = [];
        this.skips.clear();

        if (this._client.voiceConnections.has(this._guildId)) {
            this._client.voiceConnections.get(this._guildId).stopPlaying();
            this._client.leaveVoiceChannel(this._client.voiceConnections.get(this._guildId).channelID);
        }

        this._client.audioPlayers.delete(this._guildId);
    }

    isPlaying () {
        return this._client.voiceConnections.isConnected(this._guildId) && this.current !== null;
    }

    _announce (title, description) {
        if (!this.msgChannel) {
            return;
        }

        const channel = this._client.getChannel(this.msgChannel);

        if (!channel) {
            return;
        }

        channel.createMessage({ embed: {
            color: this._client.config.options.embedColour,
            title,
            description
        } });
    }
}

module.exports = AudioPlayer;
