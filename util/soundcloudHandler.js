const sf  = require("snekfetch");
const sck = require("../src/config.json").keys.soundcloud;

module.exports = {

	async getTrack(id) {

		let req = await sf.get("http://api.soundcloud.com/resolve.json")
		.query({
			url       : id,
			client_id : sck
		})
		.catch(err => {
			return [];
		})

		if (!req || !req.body || req.body.kind !== "track") return [];

		let stream = await sf.get(`https://api.soundcloud.com/i1/tracks/${req.body.id}/streams`).query({
			client_id : sck
		})

		if(!stream.body.http_mp3_128_url) return [];

		return [{
			id    : stream.body.http_mp3_128_url,
			title : req.body.user.username + " - " + req.body.title
		}];
		// duration : req.body.duration

	}

}
