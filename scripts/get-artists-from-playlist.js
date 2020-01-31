// const {Client, TrackHandler, PlaylistHandler} = require('spotify-sdk');
const SpotifyWebApi = require('spotify-web-api-node');
const http = require('http');
const express = require('express');
const axios = require('axios');
const config = require('../config');
const util = require('util');

const auth = {
    clientId: config.serverAuth.clientId,
    clientSecret: config.serverAuth.clientSecret,
    redirectUri: 'http://localhost:8080'
};
var spotifyApi = new SpotifyWebApi(auth);
spotifyApi.setAccessToken('BQDDN_8sxDMHD6xDhsF1BzZG-H0X660uMeJQMC_NYQ3-6G9G7j-1lKUQVR8PKJKkCPBtarEXAnrRsEGUwzif0-_agsVrQ_P812gFCIEojwryCRPOQC83LLtmuKzAKLjhpgk1dzlk3Rj_Du-Y2t_NqQS_rElVZGtBNphELjd3aPViiTLQmaFbJIufkgm9MQh4aA5HM8OxIw7fPBYGEg');

const loginUrl = 'https://accounts.spotify.com/authorize?client_id=' + auth.clientId +
'&response_type=token' +
'&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
'&redirect_uri=' + encodeURIComponent(auth.redirectUri);
console.log(`Please visit ${loginUrl} to log in`);

async function run() {
    let artists = {};
    try {
        const playlistTracks = (await spotifyApi.getPlaylistTracks('7CKPNFIKE5SmC5S2fUwGjr')).body.items;
        playlistTracks.forEach((track) => {
           // console.log(track)
            console.log(`Track ${track.track.name} has artists ${track.track.artists.map((artist) => artist.name).join(', ')}`);
            track.track.artists.forEach((artist) => artists[artist.name] = artist.id);
        });

        console.log(artists);
    } catch (err) {
        console.log(err);
    }
}

run();

// let response;
// async function run() {
//     try {
//         response = await axios({
//             method: 'get',
//             url: `https://accounts.spotify.com/authorize?client_id=${config.serverAuth.clientId}&client_secret=${config.serverAuth.clientSecret}&scope=playlist-read-private%20playlist-modify%20playlist-modify-private&&redirect_uri=${encodeURIComponent(auth.redirectUri)}`,
//             headers: {
//                 accept: 'application/json'
//             }
//         });
//         console.log('foo');
//     } catch (err) {
//         const errJson = err.toJSON();
//         console.log(err);
//     }
// }
//
// run();

const app = express();

app.get('/', (req, res) => {
    const requestToken = req.query.code
    return run();
    res.send('ok');
    res.end(200)
});
app.listen(8080);
