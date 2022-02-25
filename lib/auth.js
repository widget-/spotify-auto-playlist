const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const { promises: fs } = require('fs');
const config = require('../config');

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

module.exports = {
  auth
};
