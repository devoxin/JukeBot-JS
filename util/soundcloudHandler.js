const superagent = require("superagent");
const sck        = require("../src/config.json").soundcloud;

module.exports = {

	async getTrack(id) {

		let req = await superagent.get("http://api.soundcloud.com/resolve.json")
		.query({
			url       : id,
			client_id : sck
		})
		.catch(err => {
			return undefined;
		})

		if (!req || !req.body || req.body.kind !== "track") return undefined;

		let stream = await superagent.get(`https://api.soundcloud.com/i1/tracks/${req.body.id}/streams`).query({
			client_id : sck
		})

		if(!stream.body.http_mp3_128_url) return undefined;

		return {
			id    : stream.body.http_mp3_128_url,
			title : req.body.user.username + " - " + req.body.title
		}
		// duration : req.body.duration

	}

}
