export const authUrl = "https://accounts.spotify.com/";

export const baseUrl = "https://api.spotify.com/v1";

export const clientID = "ac40f20f44c548a28bfced1d80cdbaab";

export const clientSecret = "729747a765e54c2fa395963a1b149cba";

export const responseType = "code";

export const accessToken = localStorage.getItem("accessToken"); //get token from local storage

export const scope =
  "user-library-read user-read-private user-read-email streaming";

export const redirectURI = "http://localhost:2001/";
