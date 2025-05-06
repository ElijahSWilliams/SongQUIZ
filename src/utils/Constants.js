export const authUrl = "https://accounts.spotify.com/";

export const baseUrl = "https://api.spotify.com/v1";

export const clientID = "ac40f20f44c548a28bfced1d80cdbaab";

export const clientSecret = "729747a765e54c2fa395963a1b149cba";

export const responseType = "code";

export const accessToken = localStorage.getItem("accessToken"); //get token from local storage

export const scope =
  "user-library-read user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming";

export const redirectURI = "http://localhost:2001/";

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
