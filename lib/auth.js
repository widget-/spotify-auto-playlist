const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const { promises: fs } = require('fs');
const {
  clientId,
  clientSecret,
  redirectUri,
  authPort,
  authTimeout
} = require('../config');
const {
  debug
} = require('./util');

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

/**
 * Get auth token from Spotify
 * @async
 * @param {SpotifyWebApi} api
 * @param {string} authCode
 * @return {Promise<SpotifyWebApi.TokenInfo>}
 */
async function refreshToken(api) {
  const tokenResponse = (await api.refreshAccessToken())?.body;
  const token = {
    accessToken: tokenResponse?.access_token,
    refreshToken: tokenResponse?.refresh_token,
    duration: tokenResponse?.expires_in,
    issued: new Date().toISOString()
  };

  console.log('Auth token refreshed');

  await cacheAuthToken(token);
  setTimeout(() => refreshToken(api), token.duration * .9 * 1000);
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
    console.error("Unable to read cached access token");
    console.error(err);
    // On error, return empty token that will be guaranteed to be "expired"
    return {
      accessToken: null,
      refreshToken: null,
      duration: 0,
      issued: 0,
    };
  }
}

async function auth() {
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

    await cacheAuthToken(token);
    setTimeout(() => refreshToken(spotifyApi), token.duration * .9 * 1000);
  }

  spotifyApi.setAccessToken(token.accessToken);
  spotifyApi.setRefreshToken(token.refreshToken);

  return spotifyApi;
}

module.exports = {
  auth
};
