const { auth } = require('./lib/auth');
const {
  wait,
  debug,
  handlePagination,
  isEffectiveDuplicate,
  areArtistsSignificantOnAlbum,
} = require("./lib/util");
const {
  playlistId,
  dateMin,
  dateMax,
  artists: artistsToAdd,
  waitDurations,
  albumMinimumArtistSignificance,
} = require("./config");
const { buildTrackList } = require("./lib/common");

/**
 * Build a big list of all the existing tracks a given artist has.
 *
 * Filter out anything outside the date range specified the config.
 *
 * @returns {Promise<SpotifyApi.TrackObjectSimplified[]>}
 */
async function getArtistTracks(api, artistId) {
  const result = [];
  debug(`Getting album for artist id ${artistId}`);

  // Get all the albums for the artist
  const albums = await handlePagination(api, "getArtistAlbums", artistId);
  debug(`${albums.length} albums found.`);

  // Filter out albums outside the date range
  let albumsToCheck = [];
  for (let album of albums) {
    const releaseDate = new Date(album.release_date);
    if (releaseDate > new Date(dateMin) && releaseDate < new Date(dateMax)) {
      debug(
        `Album ${album.name} by ${album.artists?.[0]?.name} with ${album.total_tracks} tracks released in ${album.release_date} in date range`
      );
      albumsToCheck.push(album);
    }
  }

  // Get all the tracks for each album
  for (let album of albumsToCheck) {
    const albumDetails = (await api.getAlbum(album.id)).body;
    debug(
      `  Album "${albumDetails?.name}" by ${albumDetails?.artists
        ?.map((a) => a.name)
        ?.join(", ")} has ${albumDetails?.tracks?.items?.length} tracks`
    );

    // Filter out albums that don't have enough tracks by known artists
    if (
      !areArtistsSignificantOnAlbum(
        albumDetails.tracks?.items,
        artistsToAdd,
        albumMinimumArtistSignificance
      )
    ) {
      debug(
        `! ->> Album "${album?.name}" by ${album?.artists?.[0]?.name} is not by known artists`
      );
      // Start over if it looks like we've hit the odd album that one only one track we might know on it
      continue;
    }
    for (let track of albumDetails?.tracks?.items) {
      debug(
        `    Track "${track?.name}" by ${track?.artists
          ?.map((a) => a.name)
          ?.join(", ")}`
      );
      result.push(track);
    }

    // Wait a bit to avoid rate limiting
    await wait(waitDurations.getAlbum);
  }

  return result;
}

/** Main function */
async function run() {
  try {
    // Setup auth
    const spotifyApi = await auth();

    // Get all the tracks we already have in the playlist
    const existingTracks = await buildTrackList(spotifyApi);
    console.log(`${existingTracks.length} tracks found`);

    // Go through each artist and add their relevant tracks to the playlist if they aren't duplicates
    for (let artist of artistsToAdd) {
      // Get all the tracks of the artist
      const tracks = await getArtistTracks(spotifyApi, artist);

      // Go through each track
      for (let track of tracks) {
        // Check it's not a duplicate of another song on the playlist
        if (isEffectiveDuplicate(track, existingTracks)) {
          debug(
            `! ->> Track "${track?.name}" by ${track?.artists
              ?.map((a) => a.name)
              ?.join(", ")} is duplicate`
          );
          continue;
        }

        // Add the track to the playlist
        debug(
          `  ->> Track "${track?.name}" by ${track?.artists
            ?.map((a) => a.name)
            ?.join(", ")} new to playlist`
        );
        spotifyApi.addTracksToPlaylist(playlistId, [
          `spotify:track:${track.id}`,
        ]);
        // Also add to our internal representation of the playlist
        existingTracks.push(track);
        // Wait a bit to avoid rate limiting
        await wait(waitDurations.addTracksToPlaylist);
      }
    }
  } catch (err) {
    console.log("Something went wrong");
    console.error(err.message);
    console.trace(err);
  }
}

run().then((_) => process.exit(0));
