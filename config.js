module.exports = {
  playlistId: '4imIe0P4kT3F4gluHKPHQb', // playlist ID to add songs to

  dateMin: '2019-04-01',
  dateMax: '2019-07-01',

  // These come from the spotify app developer page
  // Make an app at https://developer.spotify.com/dashboard/applications
  // and put the credentials here.
  clientId: '',
  clientSecret: '',
  redirectUri: 'http://localhost:8081/auth',

  debugLog: true, // show debug messages
  disablePaginating: false, // only get first page of results of any API call, for testing
  authPort: 8081, // port to wait for server response. Must match application endpoint in Spotify App
  authTimeout: 5 * 60 * 1000, // 5 minutes by default - how long to wait for web response at most
  removeTracksDryRun: false,

  waitDurations: {
    default: 1000,
    getPlaylist: 100,
    getPlaylistTracks: 100,
    getArtistAlbums: 100,
    getAlbum: 1000,
    addTracksToPlaylist: 5000,
    removeTracksFromPlaylist: 10000
  },

  // List of artist IDs to add
  artists: [
    "0GsEX8wr2fhu19PIwQh1oG", // DJ Myosuke (91)
    "1Y81Ch90opScfpMfN17lZb", // Kobaryo (87)
    "25iPl8VJFDu38JMFF6uMXI", // USAO (75)
    "0Vpv5NQP45aoAwj2XvWowr", // DJ Noriken (65)
    "4Y345wfGiorcB2NXcsJxOt", // t+pazolite (62)
    "5doDHBkL33VHZXcqAuQBj0", // Srav3R (52)
    "7A5iW5McqgmSz4uV12zw5J", // P*Light (49)
    "4bwIf0yXJf0F9AmOl2J78M", // Camellia (48)
    "787mj6iFvEpBBuQQRDdMXB", // DJ Genki (48)
    "3m63JSv6jhLEKNXcEd5EUK", // REDALiCE (47)
    "5XQLMFJlYMppzVqRUpFP5x", // M-Project (43)
    "3CKAJHc0KjoFAbaqvvJ5kK", // Getty (35)
    "7rT2Rg0fVfv3h3OxKG94yp", // Dustvoxx (34)
    "0lYM4mCc6IhbmfGYpeNCyO", // RoughSketch (32)
    "4FvSs32NRc6sS3V8ylZrzq", // aran (29)
    "6nnVxZM26xhcsPxc0uEGuU", // Noizenecio (29)
    "76V0LQ9DlR2N5tcn0ZworW", // Hommarju (26)
    "3w4XD20Uhwh95PA6Hjfd0M", // DJ Shimamura (24)
    "5fxJUmn4RTMzD0XPkTUpK3", // Laur (22)
    "7IrnqAUYC6hWLeU7B85PEy", // S2i8 (18)
    "4zu3DQyVnu3BnzErDmPULM", // Yukacco (17)
    "1sOYeIJ9RXcjlk8eIlv1U5", // RedOgre (16)
    "4L3O1fDeNi8btq5uOB6NyP", // M1DY (16)
    "3Q6X5VDF0Zfu1hGHTEARSR", // QUIL (14)
    "1D3hV1Gke8LLRSn1aymglN", // Massive New Krew (14)
    "1OC1dqSbe6zNiv0NBtODX1", // 6th (12)
    "20790HYg1CwbEEMr3xPtq7", // Signal (12)
    "2sTG6aaa8grSDW0AHXZ4xb", // Nhato (11)
    "27Y8ucj3Ev56vnIRSSMik9", // Gram (11)
    "0wm9RjHf9Z8hVElYugxTJA", // dp (11)
    "2G6vDOA9bBlaexl60CCSY9", // H.U.T GiGAR (9)
    "5fIZxtu9KYwRi3MnLEVLCC", // lapix (9)
    "0CDZvRae3haSgekmaHvh05", // Quark (9)
    "5Em1ub39trbmoJ4nRYM8vS", // Dischord (9)
    "1U1YnsPM35df5p4slCVSpp", // Minamotoya (9)
    "4cN1VW0tv2952s0ywPjQU6", // kenta-v.ez. (8)
    "1ja7eEaClfVMH5XmgDIKMg", // NNN (8)
    "6HOgNCbcvjffiPo9fqZS1E", // Moro (7)
    "1LYxLNWGFFHFsV2022FIgi", // Aoi Sumito (7)
    "667AP6niAXUnJkkum46TvZ", // kors k (7)
    "2LepA4xCKutXimpQQAA6Hy", // Daisuke (6)
    "2MKQpQHZ3OsTKUEzR0DAcT", // Filthy (5)
    "0IsMF8JBfohxu578Q35hIu", // morrrrrro (5)
    "4kNiJhxDk2jyJkryS7Mao1", // Kanae Asaba (5)
    "5CxWZpW3bKbMiOC6jJ5r7i", // YUKIYANAGI (5)
    "1ioBfZldZvVAcqD3KXXTXy", // KO3 (5)
    "64LAMG3aVE73uvOjIKTbTJ", // Relect (5)
    "0bkkiFN0ghGl4j9aLi3oQx", // Nanahira (5)
    "2Pk3HjUb6vkyntnZuxr9Hp", // OZIGIRI (5)
    "1W41xau1GENFAmRjAvSVkH", // QURELESS (4)
    "7wBN9cf6RvHPfryy3A3Ikz", // Xystran (4)
    "4TIcqGdemPlj8RZpKsrhux", // moro (4)
    "1QoQ8pInqGvagcOXK3XHOX", // nnn (4)
    "3BGxTRSXPm85rLyfwNJQ71", // Dj Grimoire (4)
    "5WujPuYBzdrWtFJgHYWIp8", // NASHURI (4)
    "3xJtcW37WR7RlAzH6ZJ3VY", // UTX (4)
    "3sMoBcuGm33knrJxEoJY5k", // Yuta Imai (4)
    "2psvrZAUoHkWuM5KZAbwc5", // Matatabi Sound System (4)
    "2w6fOiIppkVrA659vJN89h", // nora2r (4)
    "3T4C9VQCeR73EPdY1cslYN", // Mitomoro (4)
    "6gtzMTR0gRV6BYYyo0z7AN", // HiTNEX-X (4)
    "2eNneuoOkNjTeYA45HHyni", // pianoid (3)
    "67BCC33Zamb5TdL6di2xi1", // Freezer (3)
    "01lCDOSmLgxqtrZbDEsEkv", // BCM (3)
    "5CpOu1MCJ2yXG1pOAZITCI", // Engage Blue (3)
    "2oLcOIIOg1HfUQXJCJ7ZY4", // Mameyudoufu (3)
    "6PMySOyfIwexvsRKizscSI", // Savage States (3)
    "56yG4cWOY3gFKwicm4M34E", // JAKAZiD (3)
    "5hQBTkKk5ah1iOrPywqEkI", // DJ Nanashi (3)
    "48Ey3g76mtkdHJtAraXiPm", // mow*2 (3)
    "4gDlrL7n3hUaweCjBwVSzj", // Ryu☆ (3)
    "53UpHpx7DNSiTf1d6ufPo8", // Kuroa* (3)
    "6KjZQbaALqvxcj59bhXWPu", // MC KCD (3)
    "3EvBMz7QylG4pgFqmmPqHr", // Falchion (3)
    "6F0qHrc56rrBvr8j6nVsKD", // Srezcat (3)
    "4xpqY2rpUTUPranPlfKJkC", // sky_delta (3)
    "474igmNpPSWMBAoSoVG9t0", // DJ Amane (3)
    "29nY3biBns7dh08cYj5DBT", // Aitsuki Nakuru (3)
    "3bnPd6eVBsKQQovPQ2qK88" // Stringamp
  ]
};
