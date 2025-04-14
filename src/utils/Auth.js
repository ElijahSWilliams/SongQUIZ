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

const handleRedirect = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return null;

  try {
    const tokenData = await tokenExchange(code); // this gets access_token
    localStorage.setItem("accessToken", tokenData.access_token);

    const userInfo = await getProfileInfo();

    // Clean URL
    window.history.replaceState({}, document.title, "/");

    return userInfo;
  } catch (error) {
    console.error("Error during token exchange:", error);
    return null;
  }
};

const tokenExchange = async (authCode) => {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${clientID}:${clientSecret}`),
      },
      body: new URLSearchParams({
        code: authCode,
        redirect_uri: redirectURI, // Ensure this matches the URL where you're expecting the code
        grant_type: "authorization_code",
      }),
    });

    const data = await checkResponse(response);

    if (data && data.access_token) {
      localStorage.setItem("accessToken", data.access_token);
      console.log("AccessToken:", data.access_token);

      // After receiving the token, clear the URL's query parameters
      window.history.pushState({}, document.title, window.location.pathname); // This should clean up the URL

      // Redirect to the home page
      window.location.replace("/"); // Redirects to the home page

      return data;
    } else {
      console.error("Error: No access token received");
      return null;
    }
  } catch (err) {
    console.error("Token exchange failed:", err);
    return null;
  }
};

export { redirectAuth, handleRedirect, checkForToken };
