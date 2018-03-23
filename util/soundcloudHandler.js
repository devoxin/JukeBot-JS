const req = require('./request.js');
const client_id = require('../src/config.json').keys.soundcloud;

module.exports = {

    async getTrack(url) {

        const req = await req.get('http://api.soundcloud.com/resolve.json', { url, client_id })
            .catch(() => null);

        if (!req || !req.body || req.body.kind !== 'track') return [];

        const stream = await req.get(`https://api.soundcloud.com/i1/tracks/${req.body.id}/streams`, { client_id })
            .catch(() => null);

        if(!stream || !stream.body.http_mp3_128_url) return [];

        return [{
            id    : stream.body.http_mp3_128_url,
            title : `${req.body.user.username} - ${req.body.title}`
        }];
        // duration : req.body.duration

    }

};
