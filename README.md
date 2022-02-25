# Scripts for managing spotify playlists

Utilities for managing spotify playlists.

## Motivation

In the olden days, Spotify used to have a "notification" list of sorts for when any artists you follow release _any_ new
tracks at all.

Since then they've replaced it with "Release Radar", which is 40 new tracks by artists you follor or listen to a lot per
week. Anything not in those 40 is effectively undiscoverable by you unless you unless you check all the artists
manually.

Unlike Spotify's management, I like to actually keep up with a large multitude of artists across many genres. I tend to
personally sort them by genre in more playlists (I have over 100 personal playlists sorted in multiple folders).

My "solution" is to have one big giant playlist that I can automatically add new tracks to as they come out. From that
playlist, I sort the ones that were recently appended at the end while leaving any that were added in the playlist.
Tracks that don't fit the giant playlist still stay in the giant playlist so that they aren't re-added, but instead
appropriate tracks are moved to a different playlist that I will actually listen to.

For the time being, I only use this for managing Japanese hardcore music, which is otherwise incredibly difficult to
keep up with as someone who can't follow Japanese-language music sites very well.

## Included scripts

| Name                            | Description                                                                                                                          |
|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| autoAddTracksToPlaylist.js      | Given a list of artists (by Spotify ID), add any releases within a specific date-range to another playlist while avoiding duplicates |
| removeDuplicatesFromPlaylist.js | Remove suspiciously similar tracks that look like duplicates from a playlist, even if they're on different albums                    |

(Something like `getArtistIDsFromPlaylist.js` will be added later)

## Usage

For now, everything is in `config.js`. Eventually I'll add command-line parameters, and make the config hold multiple
playlists with associated artists, but that's not done yet.

To begin with, you need to make
a [3rd-party Spotify developer account and an application](https://developer.spotify.com/dashboard/applications) that
can be used for all the API calls.

From the application's page, go to the "Users and Settings" tab, and add an a user with the email of your regular
Spotify account. On the same page, show the client secret and put both the Client ID and Client Secret in `config.js`

After that, click "Edit Settings" next to the tabs and add `http://localhost:8081/auth` as a Redirect URI. If you want
to change the port that the script listens on, change the port here as well.

To actually run the scripts, you'll need a recent-ish version of Node.js installed. I'd suggest the latest LTS version,
although one version behind might still work, and anything newer will work fine as well.

Run `npm install` in the folder you put the scripts into. It'll install a wrapper for the Spotify Web API and also a web
server that the scripts need to use to handle authentication. The web server only runs while waiting for an
authentication response, then closes.

Edit `config.js` with the settings you want. Change the date range using any format that Javascript's `new Date()` constructor can handle. Make sure your client ID and secret are correct.

Set the playlist ID for the playlist that you want to dump all your songs into (you can get it by right-clicking a playlist, then selecting Share > Copy link to playlist.) Keep only the part after `/playlist/` and before the `?` if that's there. For example, `https://open.spotify.com/playlist/2XMCpIaTaFpVBgSloyeIPG?si=2f3bde71896e49f8` turns into just `2XMCpIaTaFpVBgSloyeIPG`.

Then, set your list of artist IDs to have automatically added. I'll add a separate script to generate these based off of existing playlists soon, but you can get the IDs the same way you do with playlists share links.

If you get timeouts or HTTP 500 errors, you can increase how long the script waits between each action in the `waitDurations` object. `waitDurations.addTracksToPlaylist` can safely be shortened to 1000ms but tracks may be added out of order on Spotify's side. Personally I would rather wait longer and make sure albums are ordered together correctly but you may disagree. Deleting tracks has a very long delay because their servers appear to take longer to resolve those calls correctly, and often result in 500 errors.

## License

GNU GPL v2. See [LICENSE.md](LICENSE.md) for complete text.
