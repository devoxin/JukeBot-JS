const req = require('./request.js');
const yt  = require('ytdl-core');
const key = require('../src/config.json').keys.youtube;

module.exports = {

    async search(q) {

        const results = await req.get('https://www.googleapis.com/youtube/v3/search', {
            key,
            q,
            type: 'video',
            maxResults: 3,
            part: 'snippet'
        }).catch(() => null);

        return results ? results.items : [];
    },

    async getPlaylist(playlistId, limit = 100, pageToken, videos = []) {

        const request = await req.get('https://www.googleapis.com/youtube/v3/playlistItems', {
            maxResults    : 50,
            part          : 'snippet',
            nextPageToken : null,
            pageToken,
            playlistId,
            key
        }).catch(() => null);

        if (!request || request.items.length === 0)
            return videos;

        for (const video of request.items)
            videos.push({ id: video.snippet.resourceId.videoId, title: video.snippet.title });

        if (videos.length >= limit)
            return videos.slice(0, limit);

        if (request.nextPageToken)
            return await module.exports.getPlaylist(playlistId, limit, request.nextPageToken, videos);

        return videos;
    },

    async videoInfo(id) {

        const result = await req.get('https://www.googleapis.com/youtube/v3/videos', {
            part : 'snippet',
            id,
            key
        }).catch(() => null);

        if (!result || result.items.length === 0) return [];
        return [{ id: result.items[0].id, title: result.items[0].snippet.title }];
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
        const info = await yt.getInfo(id);
        return info.length_seconds * 1000;
    }

};
