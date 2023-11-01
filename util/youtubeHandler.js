const yt  = require('ytdl-core');
const ts = require('tubesearch');

module.exports = {
  search (q) {
    return ts.search(q).catch(() => []);
  },
  getPlaylist (playlistId) {
    return ts.playlist(playlistId);
  },
  videoInfo (id) {
    return yt.getBasicInfo(id)
      .then(info => ({ id: info.videoDetails.videoId, title: info.videoDetails.title }))
      .catch(() => null);
  },
  async getFormats (id) {
    const info = await yt.getInfo(id).catch(() => null);

    if (!info || !info.formats) {
      return null;
    }

    //const formats = yt.filterFormats(info.formats, 'audioonly');
    const formats = info.formats.filter(fmt => [251, 250, 249].includes(fmt.itag)); // opus-only
    return formats.length > 0 ? formats[0].url : null;
  },
  getDuration (id) {
    return yt.getBasicInfo(id).then(info => parseInt(info.videoDetails.lengthSeconds) * 1000);
  }
};
