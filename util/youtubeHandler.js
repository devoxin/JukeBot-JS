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
        }).catch(() => { return []; });

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
        }).catch(() => { return videos; });

        if (!req || !req.body || req.body.items.length === 0)
            return videos;

        for (const video of req.body.items) {
            if (Object.keys(video.snippet).length === 0 && video.snippet.constructor === Object) continue;
            videos.push({ id: video.snippet.resourceId.videoId, title: video.snippet.title });
        }

        if (videos.length >= limit) return videos.slice(0, limit);

        if (req.body.nextPageToken) return await module.exports.getPlaylist(id, limit, req.body.nextPageToken, videos);
        return videos;
    },

    async videoInfo(id) {

        const result = await sf.get('https://www.googleapis.com/youtube/v3/videos').query({
            part : 'snippet',
            id   : id,
            key  : ytk
        }).catch(() => { return []; });

        if (result.body.items.length === 0) return [];
        return [{ id: result.body.items[0].id, title: result.body.items[0].snippet.title }];
    },

    async getFormats(id) {

        const sinfo = await yt.getInfo(id).catch(() => { return null; });

        if (!sinfo || !sinfo.formats)
            return null;

        for (const format of sinfo.formats) {
            if (format.itag === '249' || format.itag === '250' || format.itag === '251' || format.audioEncoding)
                return format.url;
        }

        return null;
    },

    async getDuration(id) {

        const req = await sf.get('https://www.googleapis.com/youtube/v3/videos').query({
            part : 'contentDetails',
            id   : id,
            key  : ytk
        }).catch(() => { return 0; });

        if (!req || !req.body || req.body.items.length === 0)
            return 0;

        return module.exports.getSeconds(req.body.items[0].contentDetails.duration);
    },

    getSeconds(duration) {
        const match   = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

        if (!match) return 0;

        const hours   = (parseInt(match[1]) || 0) * 3600;
        const minutes = (parseInt(match[2]) || 0) * 60;
        const seconds =  parseInt(match[3]) || 0;

        return `${hours}${minutes}${seconds}`;
    }

};
