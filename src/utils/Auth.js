import checkResponse from "./Api";
import {
  authUrl,
  redirectURI,
  clientID,
  responseType,
  scope,
} from "./Constants";

const generateCodeVerifier = (length = 128) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let verifier = "";
  for (let i = 0; i < length; i++) {
    verifier += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return verifier;
};

const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const base64String = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return base64String
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const redirectAuth = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("pkce_code_verifier", codeVerifier);

  const authURL =
    `${authUrl}authorize?` +
    `client_id=${clientID}` +
    `&response_type=${responseType}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(redirectURI)}` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}`;

  console.log("Redirecting to:", authURL);
  window.location.href = authURL;
};

const handleSignIn = () => {
  console.log("Signing In");
  redirectAuth().then(() => {
    console.log("Redirected to Spotify for authentication");
  });
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
    const tokenData = await tokenExchange(code);
    localStorage.setItem("accessToken", tokenData.access_token);

    const userInfo = await getProfileInfo(); // You should define this function in your actual code

    // Clean up URL
    window.history.replaceState({}, document.title, "/");

    return userInfo;
  } catch (error) {
    console.error("Error during token exchange:", error);
    return null;
  }
};

const tokenExchange = async (authCode) => {
  const codeVerifier = localStorage.getItem("pkce_code_verifier");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientID,
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: redirectURI,
        code_verifier: codeVerifier,
      }),
    });

    const data = await checkResponse(response);

    if (data && data.access_token) {
      localStorage.setItem("accessToken", data.access_token);
      window.history.pushState({}, document.title, window.location.pathname);
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

export { redirectAuth, handleRedirect, checkForToken, handleSignIn };
