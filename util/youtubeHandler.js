const superagent = require("superagent");
const ytdl       = require("ytdl-core");
const ytk = require("../src/config.json").youtube

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
	}

}
