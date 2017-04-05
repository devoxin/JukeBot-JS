const superagent = require("superagent");
const yt         = require("ytdl-core");
const ytk        = require("../src/config.json").youtube;

const formats   = ["249", "250", "251", "140", "141", "171"];

module.exports = {

	async search(query) {
		let results = await superagent.get("https://www.googleapis.com/youtube/v3/search").query({
			part       : "snippet",
			maxResults : "3",
			type       : "video",
			q          : query,
			key        : ytk
		}).catch(err => {
			return [];
		})

		return results.body.items;
	},

	async getPlaylist(id, page = "", videos = []) {

		let req = await superagent.get('https://www.googleapis.com/youtube/v3/playlistItems').query({
			maxResults    : '50',
			part          : 'snippet',
			nextPageToken : null,
			pageToken     : page,
			playlistId    : id,
			key           : ytk
		}).catch(err => {
			return videos;
		});

		if (!req || !req.body || req.body.items.length === 0)
			return videos;

		for (let video of req.body.items) {
			if (Object.keys(video.snippet).length === 0 && video.snippet.constructor === Object) continue;
			videos.push({ id: video.snippet.resourceId.videoId, title: video.snippet.title });
		}

		if (videos.length >= 50) return videos;

		if (req.body.nextPageToken) return await module.exports.getPlaylist(id, req.body.nextPageToken, videos);
		return videos;

	},

	async videoInfo(id) {

		let result = await superagent.get("https://www.googleapis.com/youtube/v3/videos").query({
			part : "snippet",
			id   : id,
			key  : ytk
		}).catch(err => {
			return [];
		})

		return result.body.items;
	},

	async getFormats(id) {

		let sinfo = await yt.getInfo(id).catch(err => { return { streamable: false } });

		if (!sinfo || !sinfo.formats || sinfo.formats.filter(f => formats.includes(f.itag)).length === 0)
			return { streamable: false };

		for (let i = 0; i < sinfo.formats.length; i++) {

			if(sinfo.formats[i].itag === '250' || sinfo.formats[i].itag === '251' || sinfo.formats[i].itag === '249')
				return { streamable: true, url: sinfo.formats[i].url, opus: true };

			if(sinfo.formats[i].container === 'mp4' && sinfo.formats[i].audioEncoding || sinfo.formats[i].container === 'webm' && sinfo.formats[i].audioEncoding)
				return { streamable: true, url: sinfo.formats[i].url, opus: false };

			if(sinfo.formats[i].audioEncoding)
				return { streamable: true, url: sinfo.formats[i].url, opus: false };

		}

		return { streamable: false };

	},

	async getDuration(id) {

		let req = await superagent.get('https://www.googleapis.com/youtube/v3/videos').query({
			part : 'contentDetails',
			id   : id,
			key  : ytk
		}).catch(err => {
			return 0;
		});

		if (!req || !req.body || req.body.items.length === 0)
			return 0;

		return module.exports.getSeconds(req.body.items[0].contentDetails.duration);

	},

	getSeconds(duration) {
		let match   = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
		if(!match)  return 0;
		let hours   = (parseInt(match[1]) || 0) * 3600;
		let minutes = (parseInt(match[2]) || 0) * 60;
		let seconds = parseInt(match[3]) || 0;

		return hours + minutes + seconds;
	}

}
