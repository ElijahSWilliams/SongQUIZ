export const authUrl = "https://accounts.spotify.com/";

export const baseUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:2002"
    : "https://api.songquiz.pii.at";

export const responseType = "code";

export const accessToken = localStorage.getItem("accessToken"); //get token from local storage

export const scope =
  "user-library-read user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming";

export const redirectURI =
  process.env.NODE_ENV === "production"
    ? "https://api.songquiz.pii.at/callback"
    : "http://localhost:2001/callback";

export const getRandomSong = (songs) => {
  if (!songs || songs.length === 0) return null; // Safety check
  const randomNumber = Math.floor(Math.random() * songs.length);
  const song = songs[randomNumber];
  const songUri = `spotify:track:${song.id}`;
  /* console.log("getRandomSong function song:", song); */
  /* console.log(songUri); */
  return { song, songUri };
};

export const stopPlayback = () => {
  player.pause();
};
