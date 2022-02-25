const { auth } = require('./lib/auth');

const {
  wait,
  debug,
  isEffectiveDuplicate
} = require('./lib/util');
const { buildTrackList } = require('./lib/common');
const { playlistId, removeTracksDryRun, waitDurations } = require('./config');

async function run() {
  const spotifyApi = await auth();

  const tracks = await buildTrackList(spotifyApi);
  const tracksToRemove = [];

  for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
    if (isEffectiveDuplicate(tracks[trackIndex], tracks.slice(trackIndex + 1))) {
      tracksToRemove.push(tracks[trackIndex]);
    }
  }
  for (const track of tracksToRemove) {
    debug(`Duplicate track "${ track.name }" by ${ track.artists[0].name }`);
  }
  debug(`${ tracksToRemove.length } duplicates found.`);

  if (!removeTracksDryRun) {
    const trackBatches = []
    for (let i = 0; i < tracksToRemove.length / 10; i++) {
      trackBatches.push(tracksToRemove.slice(i * 10, (i + 1) * 10));
    }

    for (const batch of trackBatches) {
      for (const track of batch) {
        debug(`Removing track "${ track.name }" by ${ track.artists[0].name }`);
      }
      const playlistSnapshotId = (await spotifyApi.getPlaylist(playlistId)).body.snapshot_id
      await wait(waitDurations.getPlaylist);
      const batchUris = batch.map((track) => ({ uri: `spotify:track:${ track.id }` }))
      await spotifyApi.removeTracksFromPlaylist(playlistId, batchUris, {
        snapshot_id: playlistSnapshotId
      });
      await wait(waitDurations.removeTracksFromPlaylist);
    }
  }
}

run().catch((err) => {
  console.error(err);
  console.trace(err);
});
