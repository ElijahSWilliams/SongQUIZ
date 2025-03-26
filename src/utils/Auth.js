//File for all things AUTHORIZATION (OAUTH)
import checkResponse from "./Api";
import {
  authUrl,
  redirectURI,
  clientID,
  clientSecret,
  responseType,
  scope,
} from "./Constants";

//function to redirect user to spotify auth page
const redirectAuth = () => {
  const authURL =
    `${authUrl}authorize?` + // Correct auth URL: https://accounts.spotify.com/authorize
    `client_id=${clientID}` + // Your Spotify client ID
    `&response_type=${responseType}` + // response_type=code (for Authorization Code Flow)
    `&scope=${encodeURIComponent(scope)}` + // The scope, URL-encoded
    `&redirect_uri=${encodeURIComponent(redirectURI)}`; // The redirect URI, URL-encoded

  console.log("Redirecting to:", authURL); // Check the URL being generated

  // Redirect to the Spotify authorization page
  window.location.href = authURL;
};

const checkForToken = (accessToken) => {
  if (!accessToken) {
    console.error("No Token Present");
    return Promise.reject("No Token Found");
  }
};

const handleRedirect = () => {
  const params = new URLSearchParams(window.location.search);
  const authCode = params.get("code"); //code from url after redirection back to local app
  console.log("authCod", authCode);
  if (authCode) {
    tokenExchange(authCode);
  } else {
    console.error("AUTH CODE NOT FOUND");
  }
};

const tokenExchange = (authCode) => {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${clientID}:${clientSecret}`), //base64 encoding. 'btoa' converts a string to base64 encoding
    },
    body: new URLSearchParams({
      code: authCode, //AUTHORIZATION CODE
      redirect_uri: redirectURI,
      grant_type: "authorization_code",
      client_id: clientID,
      client_secret: clientSecret,
    }),
  })
    .then((res) => {
      return checkResponse(res);
    })
    .then((data) => {
      console.log("data", data);
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token);
        /*  localStorage.setItem("refreshToken", data.refresh_token); */
        console.log("AccessToken:", data.access_token);
        /*  console.log("RefreshToken:", data.refresh_token); */
      } else {
        console.error(data);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export { redirectAuth, handleRedirect, checkForToken };
