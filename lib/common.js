const { handlePagination } = require("./util");
const { playlistId } = require("../config");

/**
 * Get all tre tracks in a given playlist
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
