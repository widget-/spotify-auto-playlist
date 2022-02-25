const { auth } = require('./lib/auth');
const {
  wait,
  debug,
  handlePagination,
  isEffectiveDuplicate
} = require('./lib/util');
const {
  playlistId,
  dateMin,
  dateMax,
  artists: artistsToAdd, waitDurations
} = require('./config');
const { buildTrackList } = require('./lib/common');


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
    await wait(waitDurations.getAlbum);
  }
  return result;
}

async function run() {
  try {
    const spotifyApi = await auth();

    const existingTracks = await buildTrackList(spotifyApi);

    console.log(`${ existingTracks.length } tracks found`);

    for (let artist of artistsToAdd) {
      const tracks = await getArtistTracks(spotifyApi, artist);
      for (let track of tracks) {
        if (!isEffectiveDuplicate(track, existingTracks)) {
          debug(`  ->> Track "${ track?.name }" by ${ track?.artists?.map(a => a.name)?.join(', ') } new to playlist`);
          spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${ track.id }`]);
          existingTracks.push(track);
          await wait(waitDurations.addTracksToPlaylist);
        } else {
          debug(`! ->> Track "${ track?.name }" by ${ track?.artists?.map(a => a.name)?.join(', ') } is duplicate`);
        }
      }
    }

  } catch (err) {
    console.log('Something went wrong');
    console.error(err.message);
    console.trace(err);
  }

}

run().then(_ => null);
