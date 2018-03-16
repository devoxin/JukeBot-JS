const sf  = require('snekfetch');
const yt  = require('ytdl-core');
const ytk = require('../src/config.json').keys.youtube;

module.exports = {

    async search(query) {

        const results = await sf.get('https://www.googleapis.com/youtube/v3/search').query({
            part       : 'snippet',
            maxResults : '3',
            type       : 'video',
            q          : query,
            key        : ytk
        }).catch(() => []);

        return results.body.items;
    },

    async getPlaylist(id, limit = 100, page = '', videos = []) {

        const req = await sf.get('https://www.googleapis.com/youtube/v3/playlistItems').query({
            maxResults    : '50',
            part          : 'snippet',
            nextPageToken : null,
            pageToken     : page,
            playlistId    : id,
            key           : ytk
        }).catch(() => null);

        if (!req || !req.body || req.body.items.length === 0)
            return videos;

        for (const video of req.body.items)
            videos.push({ id: video.snippet.resourceId.videoId, title: video.snippet.title });

        if (videos.length >= limit)
            return videos.slice(0, limit);

        if (req.body.nextPageToken)
            return await module.exports.getPlaylist(id, limit, req.body.nextPageToken, videos);

        return videos;
    },

    async videoInfo(id) {

        const result = await sf.get('https://www.googleapis.com/youtube/v3/videos').query({
            part : 'snippet',
            id   : id,
            key  : ytk
        }).catch(() => []);

        if (result.body.items.length === 0) return [];
        return [{ id: result.body.items[0].id, title: result.body.items[0].snippet.title }];
    },

    async getFormats(id) {

        const info = await yt.getInfo(id).catch(() => null);

        if (!info || !info.formats)
            return null;

        //const formats = yt.filterFormats(info.formats, 'audioonly');
        const formats = info.formats.filter(fmt => ['251', '250', '249'].includes(fmt.itag)); // opus-only
        formats.sort((a, b) => b.itag - a.itag);

        return formats.length > 0 ? formats[0].url : null;
    },

    async getDuration(id) {

        const req = await sf.get('https://www.googleapis.com/youtube/v3/videos').query({
            part : 'contentDetails',
            id   : id,
            key  : ytk
        }).catch(() => null);

        if (!req || !req.body || req.body.items.length === 0)
            return 0;

        return module.exportd.getSeconds(req.body.items[0].contentDetails.duration);
    },

    getSeconds(duration) {
        const match   = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

        if (!match)
            return 0;

        const hours   = (parseInt(match[1]) || 0);
        const minutes = (parseInt(match[2]) || 0);
        const seconds =  parseInt(match[3]) || 0;

        return `${hours}:${minutes}:${seconds}`;
    }

};
