const { handlePagination } = require("./util");
const { playlistId } = require("../config");

/**
 *
 * @param {SpotifyWebApi} api
 * @returns Promise<TrackObjectSimplified[]>
 */
async function buildTrackList(api) {
  let tracks = await handlePagination(api, "getPlaylistTracks", playlistId);
  return tracks.map((track) => track.track);
}

module.exports = {
  buildTrackList,
};
