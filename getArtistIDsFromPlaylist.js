const { auth } = require("./lib/auth");
const { playlistId } = require("./config");
const { buildTrackList } = require("./lib/common");

async function run() {
  try {
    const spotifyApi = await auth();

    /** @type {SpotifyApi.TrackObjectSimplified[]} */
    const existingTracks = await buildTrackList(spotifyApi);
    console.log(`${existingTracks.length} tracks found`);

    const artists = {};

    for (const track of existingTracks) {
      for (const artist of track?.artists) {
        if (artists[artist.id]) {
          artists[artist.id].count++;
        } else {
          artists[artist.id] = {
            name: artist.name,
            count: 1,
          };
        }
      }
    }

    const sortedArtistCount = Object.entries(artists).sort(
      ([_k1, v1], [_k2, v2]) => v2.count - v1.count
    );

    for (const [id, { name, count }] of sortedArtistCount) {
      console.log(`"${id}", // ${name} (${count})`);
    }
  } catch (err) {
    console.log("Something went wrong");
    console.error(err.message);
    console.trace(err);
  }
}

run().then((_) => null);
