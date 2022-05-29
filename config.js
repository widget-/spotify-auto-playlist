module.exports = {
  // configuration options:
  playlistId: "4imIe0P4kT3F4gluHKPHQb", // playlist ID to add songs to
  // playlistId: "1xTMNB2nmnm7Tp7ALYkJRw", // playlist ID to add songs to

  dateMin: "2021-01-01",
  dateMax: "2021-04-01",

  // what % of songs on an album need to come from artists listed here:
  albumMinimumArtistSignificance: 0.3,

  // These come from the spotify app developer page
  // Make an app at https://developer.spotify.com/dashboard/applications
  // and put the credentials here.
  clientId: "",
  clientSecret: "",
  redirectUri: "http://localhost:8081/auth",

  debugLog: true, // show debug messages
  disablePaginating: false, // only get first page of results of any API call, for testing
  authPort: 8081, // port to wait for server response. Must match application endpoint in Spotify App
  authTimeout: 5 * 60 * 1000, // 5 minutes by default - how long to wait for web response at most
  removeTracksDryRun: false,

  waitDurations: {
    default: 1000,
    getPlaylist: 25,
    getPlaylistTracks: 100,
    getArtistAlbums: 100,
    getAlbum: 1000,
    addTracksToPlaylist: 5000,
    removeTracksFromPlaylist: 10000,
  },

  // List of artist IDs to add
  artists: [
    "5XQLMFJlYMppzVqRUpFP5x", // M-Project (109)
    "0GsEX8wr2fhu19PIwQh1oG", // DJ Myosuke (99)
    "1Y81Ch90opScfpMfN17lZb", // Kobaryo (95)
    "4Y345wfGiorcB2NXcsJxOt", // t+pazolite (87)
    "0Vpv5NQP45aoAwj2XvWowr", // DJ Noriken (77)
    "4bwIf0yXJf0F9AmOl2J78M", // Camellia (72)
    "25iPl8VJFDu38JMFF6uMXI", // USAO (71)
    "5doDHBkL33VHZXcqAuQBj0", // Srav3R (69)
    "3CKAJHc0KjoFAbaqvvJ5kK", // Getty (58)
    "787mj6iFvEpBBuQQRDdMXB", // DJ Genki (55)
    "0lYM4mCc6IhbmfGYpeNCyO", // RoughSketch (55)
    "76V0LQ9DlR2N5tcn0ZworW", // Hommarju (50)
    "3m63JSv6jhLEKNXcEd5EUK", // REDALiCE (48)
    "7A5iW5McqgmSz4uV12zw5J", // P*Light (48)
    "3w4XD20Uhwh95PA6Hjfd0M", // DJ Shimamura (38)
    "7rT2Rg0fVfv3h3OxKG94yp", // Dustvoxx (37)
    "4FvSs32NRc6sS3V8ylZrzq", // aran (34)
    "6nnVxZM26xhcsPxc0uEGuU", // Noizenecio (29)
    "5CxWZpW3bKbMiOC6jJ5r7i", // YUKIYANAGI (29)
    "1sOYeIJ9RXcjlk8eIlv1U5", // RedOgre (26)
    "5fxJUmn4RTMzD0XPkTUpK3", // Laur (23)
    "4zu3DQyVnu3BnzErDmPULM", // Yukacco (21)
    "4L3O1fDeNi8btq5uOB6NyP", // M1DY (21)
    "1D3hV1Gke8LLRSn1aymglN", // Massive New Krew (21)
    "5fIZxtu9KYwRi3MnLEVLCC", // lapix (20)
    "1OC1dqSbe6zNiv0NBtODX1", // 6th (20)
    "1ioBfZldZvVAcqD3KXXTXy", // KO3 (19)
    "0bkkiFN0ghGl4j9aLi3oQx", // Nanahira (19)
    "3Q6X5VDF0Zfu1hGHTEARSR", // QUIL (17)
    "7IrnqAUYC6hWLeU7B85PEy", // S2i8 (16)
    "3lQXOLExyzsVreSYRiw6MN", // DJ DEPATH (16)
    "3JL2xJoZQDP7NjNiEmVpfa", // Team Grimoire (15)
    "67BCC33Zamb5TdL6di2xi1", // Freezer (14)
    "64LAMG3aVE73uvOjIKTbTJ", // Relect (13)
    "4Zyibxrgy9RPKmlgWmqtp6", // Relect (9)
    "2w6fOiIppkVrA659vJN89h", // nora2r (13)
    "2oLcOIIOg1HfUQXJCJ7ZY4", // Mameyudoufu (13)
    "5CpOu1MCJ2yXG1pOAZITCI", // Engage Blue (12)
    "2G6vDOA9bBlaexl60CCSY9", // H.U.T GiGAR (11)
    "2Pk3HjUb6vkyntnZuxr9Hp", // OZIGIRI (11)
    "0RQHoCy7kj0iHCBkeaB3lO", // DJ DiA (11)
    "1dap4gxo6scejBRWUkw41y", // DJPoyoshi (11)
    "667AP6niAXUnJkkum46TvZ", // kors k (10)
    "2sTG6aaa8grSDW0AHXZ4xb", // Nhato (10)
    "0wm9RjHf9Z8hVElYugxTJA", // dp (10)
    "20790HYg1CwbEEMr3xPtq7", // Signal (10)
    "0T63JmNIGEtIi6Qj1z53Os", // Signal (5)
    "6PMySOyfIwexvsRKizscSI", // Savage States (9)
    "3BGxTRSXPm85rLyfwNJQ71", // Dj Grimoire (9)
    "2psvrZAUoHkWuM5KZAbwc5", // Matatabi Sound System (9)
    "6as4D9YMg3oARLBH6GYhT7", // TOKYO BURST PROJECT (9)
    "5WujPuYBzdrWtFJgHYWIp8", // NASHURI (9)
    "1U1YnsPM35df5p4slCVSpp", // Minamotoya (8)
    "4cN1VW0tv2952s0ywPjQU6", // kenta-v.ez. (8)
    "7GzQljkebaUm94GJaAmzM1", // LU-I (8)
    "3sMoBcuGm33knrJxEoJY5k", // Yuta Imai (8)
    "3T4C9VQCeR73EPdY1cslYN", // Mitomoro (8)
    "5Em1ub39trbmoJ4nRYM8vS", // Dischord (7)
    "0CDZvRae3haSgekmaHvh05", // Quark (7)
    "2ey1mmBf0xodPVHi6f5YOs", // Quark (3)
    "0IsMF8JBfohxu578Q35hIu", // morrrrrro (7)
    "6HOgNCbcvjffiPo9fqZS1E", // Moro (6)
    "4TIcqGdemPlj8RZpKsrhux", // moro (3)
    "46CrX7GTEcWgCRHPRMCILk", // pocotan (7)
    "1ja7eEaClfVMH5XmgDIKMg", // NNN (6)
    "1QoQ8pInqGvagcOXK3XHOX", // nnn (6)
    "7wBN9cf6RvHPfryy3A3Ikz", // Xystran (6)
    "3p8H8HTn04KXh2NRzhKScl", // PSYQUI (6)
    "0S23vj2YyvxsVlhqqSohrk", // rejection (6)
    "3xgbqm0tIL7wZLS82PApei", // クサカアキラ (6)
    "0sHWB2xUPwdTLo2TT9MIi0", // DJ Laugh (5)
    "4cvzRhvPlb8EHirHqN3DtW", // Blacklolita (5)
    "2MKQpQHZ3OsTKUEzR0DAcT", // Filthy (5)
    "56yG4cWOY3gFKwicm4M34E", // JAKAZiD (5)
    "3xMDrBATQJ0FPwdZPb9If5", // Nizikawa (5)
    "3qYt5zzf9B414wKsDhrtaO", // Krystal (5)
    "27Y8ucj3Ev56vnIRSSMik9", // Gram (5)
    "3WtLwZYH0N8mqSaUjEW1kF", // Gram (3)
    "2iQejuii666Qz0TJvkPoCD", // Mayumi Morinaga (5)
    "7b84Qty3ghHQz8omvoXSPH", // YOU (5)
    "2LepA4xCKutXimpQQAA6Hy", // Daisuke (4)
    "4xpqY2rpUTUPranPlfKJkC", // sky_delta (4)
    "2XSi75DsGWhFBKPhKNWrJz", // sky_delta (3)
    "6gtzMTR0gRV6BYYyo0z7AN", // HiTNEX-X (4)
    "76eHPsoHfG6r4L66SLcEOy", // Aikapin (4)
    "1M3Nrg5KLgJTxCbwQYl0sG", // Yooh (4)
    "4os0GkCkfwC8HUjKn7wULI", // Shully (4)
    "6ImFfiM17Sg4T56akzOnu1", // Zekk (4)
    "1W41xau1GENFAmRjAvSVkH", // QURELESS (4)
    "6nFyBgKgu44RIgJEzLxWwr", // kanoryo (4)
    "0AVwoTqXBWS5ONMgqfuxmT", // FALCHiON (4)
    "3EvBMz7QylG4pgFqmmPqHr", // Falchion (3)
    "2M3bgGjf4ZsL6faoyeiEu7", // Militack (4)
    "2RVXnU56kIClg1UbAW9ehz", // KARUT (4)
    "74y1eBp00pK0DbMFZUnNP7", // kakeru (4)
    "3xJtcW37WR7RlAzH6ZJ3VY", // UTX (4)
    "69AgGP6Qc44vIksqFAPdoT", // Kamikaze (4)
    "6F0qHrc56rrBvr8j6nVsKD", // Srezcat (4)
    "3dJ5mXNLhIElreO64ian8W", // Sanaas (4)
    "3zYlyxKxwBaxNy1cMMr5CF", // Tanchiky (4)
    "2CpPSW5bxLgbCIwcaKrMwW", // Renko (3)
    "53UpHpx7DNSiTf1d6ufPo8", // Kuroa* (3)
    "4gDlrL7n3hUaweCjBwVSzj", // Ryu☆ (3)
    "4IsgVdOy2TTOTPArjMzDNp", // BlackY (3)
    "57eFNkPwLhad2Sg1zxTBWL", // Akira Complex (3)
    "474igmNpPSWMBAoSoVG9t0", // DJ Amane (3)
    "0FfRrq7HcOApDyjGam6UU4", // DJ Lia (3)
    "3B8850mEB9pCpQzLb2eXEM", // Hardestboy (3)
    "23vallNaMILMOgxcCYcuGP", // Tanukichi (3)
    "0YhlMnC5DCxSfvVAhVIUGR", // IceCreamSandWitch (3)
    "5KYCM5k0nXTnUAXBrOklOQ", // 3R2 (3)
    "2V0C2XQ4tjz7IhV7RVIuMj", // Spire (3)
    "2eNneuoOkNjTeYA45HHyni", // pianoid (3)
    "6lBHddG3zVO90MSR33IIOO", // Sho--nan (3)
    "48Ey3g76mtkdHJtAraXiPm", // mow*2 (3)
    "5pmwcvJqiHZ9ZaaFkK5YEo", // Remain Silent (3)
    "3FGNH6x571itirKdJnC93E", // Numb'n'dub (3)
    "4zjbW12Fq880EmWUp5YIXV", // tokiwa (3)
    "7LUcLP40GdBUyHqQhE4jG3", // Sober Bear (3)
    "6UA1sjVZZizfk3vb4TJqLQ", // Capchii (3)
    "1fKUDyAF6UxTwXkQImRIqO", // DJ-KATSUYA (3)
  ],
};
