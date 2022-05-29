const {
  debugLog,
  disablePaginating,
  waitDurations
} = require('../config');

/**
 * Promise version of wait()/delay() common in many other blocking languages.
 * @param {int} durationMs Duration to wait, in milliseconds.
 * @return {Promise<void>}
 */
async function wait(durationMs) {
  durationMs = durationMs ?? opWaitDuration;
  await new Promise((resolve, _) => setTimeout(resolve, durationMs));
}

/**
 * Write to console.log if config.debugLog is true.
 * More loggers might be added later.
 * @param {...string} message Parameters to send to console.log
 */
function debug(...message) {
  if (debugLog) {
    console.log(...message);
  }
}

/**
 * Call a given API call while handling pagination
 * @param {SpotifyWebApi} api
 * @param {string} call Function name to be called
 * @param {...(any)} options Extra parameters to send to the API call
 * @return {Promise<any[]>}
 */
async function handlePagination(api, call, ...options) {
  let result = [];
  let offset = 0;
  let limit = 50;
  let response;

  debug(`Calling ${ call } with params ${ options }`);

  do {
    response = (await retry(() => api[call](...options, { offset, limit }))).body;
    debug(
      `Received results ${ offset } to ${ offset + response.items.length } of ${ response.total } (${ Math.round((offset + response.items.length) / response.total * 100) }%)`
    );
    result = result.concat(response.items);
    offset += limit;
    await wait(waitDurations[call] ?? waitDurations.default);
  } while (response.next && !disablePaginating);

  return result;
}

/**
 *
 * @template T
 * @param {((...args) => Promise<T>)} fn Async function to try calling
 * @param {int} [tries=25] How many times to try the call, defaulting to 25
 * @return {Promise<T>}
 */
async function retry(fn, tries) {
  tries ??= 25;
  let finalErr;
  for (let _ = 0; _ < tries; _++) {
    try {
      return await fn();
    } catch (err) {
      finalErr = err;
      console.error("Error with call:");
      console.error(err);
    }
  }
  console.error(`Failed to call function after ${ tries } tries.`);
  return finalErr; // return last encountered error
}

/**
 * Check if a track is already in the existing track list by comparing its
 * name, main artist, and length (plus/minus 2 seconds).
 * @param {SpotifyApi.TrackObjectSimplified} track
 * @param {SpotifyApi.TrackObjectSimplified[]} existingTracks
 * @return {boolean}
 */
function isEffectiveDuplicate(track, existingTracks) {
  for (let existingTrack of existingTracks) {
    if (
      track.name === existingTrack.name &&
      track.artists[0].id === existingTrack.artists[0].id &&
      Math.abs(track.duration_ms - existingTrack.duration_ms) < 2000
    ) {
      debug(`Track ${ track.name } by ${ track.artists[0].name } identified as duplicate`);
      return true;
    }
  }
  return false;
}

function getArtistsFromTracklist(tracklist) {
  let artists = {};
  for (let track of tracklist) {
    for (let artist of track.artists) {
      if (artists[artist.name]) {
        artists[artist.name].count += 1;
      } else {
        artists[artist.name] = {
          id: artist.id, count: 1
        };
      }
    }
  }
  return artists;
}

/**
 * Checks if an album has a significant enough amount of artists from
 * the config file.
 * @param {SpotifyApi.TrackObjectSimplified[]} tracks Tracks on an album
 * @param {string[]} artists IDs of artists to compare against
 * @param {number} significance Ratio (0-1, as decimal) of tracks that listed artists should appear on
 * @return {boolean}
 */
function areArtistsSignificantOnAlbum(tracks, artists, significance) {
  if (!tracks) return false;
  const significantCount = tracks.map((track) => {
    for (let trackArtist of track.artists) {
      if (artists.includes(trackArtist.id)) {
        return true;
      }
    }
    return false;
  }).filter((result) => result).length;
  debug(`  Album has significance of ${ (significantCount / tracks.length).toLocaleString(undefined, { style: 'percent' }) }`);
  return ((significantCount / tracks.length) > significance);
}

module.exports = {
  wait,
  debug,
  handlePagination,
  isEffectiveDuplicate,
  getArtistsFromTracklist,
  areArtistsSignificantOnAlbum
};
