const { client, secret } = require('../src/config.json').keys.spotify;
const SpotifyAPI = require('node-spotify-api');
const spotify = new SpotifyAPI({
  id: client,
  secret
});

module.exports = {
  lookup (id) {
    return spotify.request(`https://api.spotify.com/v1/tracks/${id}`);
  }
};
