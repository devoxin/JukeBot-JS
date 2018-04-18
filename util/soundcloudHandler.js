const req = require('./request.js');
const appScriptRegex = new RegExp('https://[A-Za-z0-9-.]+/assets/app-[a-f0-9-]+\\.js', 'g');
const clientIdRegex = new RegExp(',client_id:"([a-zA-Z0-9-_]+)"', 'g');
const trackIdRegex = new RegExp('[0-9]{1,9}', 'g');

let client_id = '';

module.exports = {

    async getTrack(url) {

        const request = await req.get('https://api.soundcloud.com/resolve', { url, client_id })
            .catch(() => null);

        if (!request) return [];

        const trackId = trackIdRegex.exec(request.location);

        if (!trackId) return [];

        const metadata = await req.get(`https://api.soundcloud.com/tracks/${trackId}`, { client_id })
            .catch(() => null);

        if (!metadata) return [];

        return [{
            id: `https://api.soundcloud.com/tracks/${trackId[0]}/stream?client_id=${client_id}`,
            title: metadata.title,
            duration: metadata.duration
        }];

    },

    async updateClientID() {
        const page = await req.get('https://soundcloud.com')
            .catch(() => null);

        if (!page) return console.log('Failed to update Soundcloud Client ID'); // eslint-disable-line

        const appScript = appScriptRegex.exec(page);

        if (!appScript) return console.log('Failed to update Soundcloud Client ID'); // eslint-disable-line

        const script = await req.get(appScript[0])
            .catch(() => null);

        if (!script) return console.log('Failed to update Soundcloud Client ID'); // eslint-disable-line

        const clientId = clientIdRegex.exec(script);

        if (!clientId) return console.log('Failed to update Soundcloud Client ID'); // eslint-disable-line

        client_id = clientId[1];
        console.log(`Updated client ID to ${client_id}`); // eslint-disable-line
    },

    getClientID() {
        return client_id;
    }

};
