const config = require('../config');

const {
  debugLog,
  disablePaginating,
  opWaitDuration
} = config;

async function wait(durationMs) {
  durationMs = durationMs ?? opWaitDuration;
  await new Promise((resolve, _) => setTimeout(resolve, durationMs));
}

function debug(..._) {
  if (debugLog) {
    console.log(..._);
  }
}


/**
 *
 * @param {SpotifyWebApi} api
 * @param {string} call
 * @param {...(any)} options
 * @return {Promise<any[]>}
 */
async function handlePagination(api, call, ...options) {
  let result = [];
  let offset = 0;
  let limit = 50;
  let response;

  debug(`Calling ${ call } with params ${ options }`
  );

  do {
    response = (await api[call](...options, { offset, limit })).body;
    debug(
      `Received results ${ offset } to ${ offset + response.items.length }`
    );
    result = result.concat(response.items);
    offset += limit;
    await wait();
  } while (response.next && !disablePaginating);

  return result;
}

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

module.exports = {
  wait,
  debug,
  handlePagination,
  isEffectiveDuplicate
};
