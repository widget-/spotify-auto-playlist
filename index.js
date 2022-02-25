const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const inspect = require('util').inspect;
const fs = require('fs').promises;
const config = require('./config');

const {
  debugLog,
  disablePaginating,
  opWaitDuration,
  authPort,
  authTimeout,
  playlistId,
  dateMin,
  dateMax
} = config;
const artistsToAdd = config.artists;

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
 * Get auth URL and return auth token
 * @async
 * @return {string} auth token
 */
async function waitForAuthResponse() {
  const server = express();
  let connection;
  const awaitResponse = new Promise((resolve, reject) => {
    const timeout = setTimeout(reject, authTimeout);
    server.get("/auth", (req, res) => {
      res.end(`Auth string: ${ req.query.code }`);
      clearTimeout(timeout);
      resolve(req.query.code);
    });
    connection = server.listen(8081);
  });

  try {
    debug(`Listening on port ${ authPort } for up to ${ authTimeout / 1000 } seconds.`);
    const authToken = await awaitResponse;
    connection.close();
    debug(`Auth response received: ${ authToken }`);
    return authToken;

  } catch (err) {
    connection.close();
    console.error('Error when listening for auth response');
    console.error(err);
    console.trace(err);
  }
}

function tokenExpired(token) {
  return new Date(+new Date(token.issued) + token.duration * 1000) < new Date();
}

async function cacheAuthToken(token) {
  try {
    await fs.writeFile("authToken.json", JSON.stringify(token, null, 2));
  } catch (err) {
    console.error('Unable to cache access token');
    console.error(err);
  }
}

async function readCachedAuthToken() {
  let data;
  try {
    data = await fs.readFile("authToken.json");
    return JSON.parse(data);
  } catch (err) {
    console.error('Unable to read cached access token');
    console.error(err);
  }
}

async function auth() {
  const {
    clientId,
    clientSecret,
    redirectUri
  } = config;
  const spotifyApi = new SpotifyWebApi({ clientId, clientSecret, redirectUri });

  let token = await readCachedAuthToken();

  if (tokenExpired(token)) {

    const scopes = [
      'playlist-modify-private',
      'playlist-modify-public',
      'playlist-read-private'
    ];
    const authUrl = spotifyApi.createAuthorizeURL(scopes);
    console.log('Please visit the following URL to approve access:');
    console.log(authUrl);

    const authCode = await waitForAuthResponse();
    const authCodeGrantResponse = await spotifyApi.authorizationCodeGrant(authCode);
    token = {
      accessToken: authCodeGrantResponse?.body?.access_token,
      refreshToken: authCodeGrantResponse?.body?.refresh_token,
      duration: authCodeGrantResponse?.body?.expires_in,
      issued: new Date().toISOString()
    };

    console.log('Auth token received');
    debug(`Token expires in ${ token.duration }.`);

    cacheAuthToken(token);
  }

  spotifyApi.setAccessToken(token.accessToken);

  return spotifyApi;
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

async function buildTrackList(api) {
  let tracks = await handlePagination(api, 'getPlaylistTracks', playlistId);
  return tracks.map(track => track.track);
}

async function getTrackIds(api) {
  const tracks = await buildTrackList(api);
  return tracks.map((track) => track.id);
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

function printTopArtistsList(artists) {
  const topArtists = Object
  .entries(getArtistsFromTracklist(tracks))
  .sort((a, b) => b[1].count - a[1].count);

  console.log('[');
  for (let artist of artists) {
    console.log(
      `  "${ artist[1].id }", // ${ artist[0] } (${ artist[1].count }) `);
  }
  console.log(']');
}

async function getArtistTracks(api, artistId) {
  const result = [];
  debug(`Getting album for artist id ${ artistId }`);
  const albums = await handlePagination(api, 'getArtistAlbums', artistId);
  debug(`${ albums.length } albums found.`);
  let albumsToCheck = [];
  for (let album of albums) {
    const releaseDate = new Date(album.release_date);
    if (releaseDate > new Date(dateMin) && releaseDate < new Date(dateMax)) {
      debug(`Album ${ album.name } by ${ album.artists?.[0]?.name } with ${ album.total_tracks } tracks released in ${ album.release_date } in date range`);
      albumsToCheck.push(album);
    }
  }
  for (let album of albumsToCheck) {
    const albumDetails = (await api.getAlbum(album.id)).body;
    debug(`  Album "${ albumDetails?.name }" by ${ albumDetails?.artists?.map(a => a.name)?.join(', ') } has ${ albumDetails?.tracks?.items?.length } tracks`);
    for (let track of albumDetails?.tracks?.items) {
      debug(`    Track "${ track?.name }" by ${ track?.artists?.map(a => a.name)?.join(', ') }`);
      result.push(track);
    }
    await wait();
  }
  return result;
}

async function run() {
  try {
    const spotifyApi = await auth();

    const existingTrackIds = await getTrackIds(spotifyApi);

    console.log(`${ existingTrackIds.length } tracks found`);

    for (let artist of artistsToAdd) {
      const tracks = await getArtistTracks(spotifyApi, artist);
      for (let track of tracks) {
        if (!existingTrackIds.includes(track.id)) {
          debug(`Track "${ track?.name }" by ${ track?.artists?.map(a => a.name)?.join(', ') } new to playlist`);
          spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${ track.id }`]);
          existingTrackIds.push(track.id);
          await wait();
        }
      }
    }

  } catch (err) {
    console.log('Something went wrong');
    console.error(err.message);
    console.trace(err);
  }

}

run();
