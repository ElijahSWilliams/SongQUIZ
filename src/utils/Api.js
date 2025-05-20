import { baseUrl } from "./Constants";
import { handleRedirect } from "./Auth"; // ✅ your function name

// Checks fetch response
export default function checkResponse(res) {
  if (!res.ok) {
    console.log(res.status);
    if (res.status === 401) {
      console.error("Unauthorized");
      localStorage.removeItem("accessToken");
      // Optional: redirect to login
    }
    return Promise.reject(`Error: ${res.status}`);
  }
  return res.json();
}

// Get valid token from localStorage or handle PKCE redirect
async function getToken() {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    console.warn(
      "No access token found. Attempting to handle PKCE redirect..."
    );
    token = await handleRedirect(); // ✅ using your function name
  }

  if (!token) {
    console.error("Token retrieval failed.");
    return null;
  }

  return token;
}

const getSubscriptionStatus = async () => {
  const token = await getToken();
  if (!token) return;

  return fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .then((data) => {
      console.log("Subscription Status:", data.product);
      return data;
    });
};

const getProfileInfo = async () => {
  const token = await getToken();
  if (!token) return;

  return fetch(`${baseUrl}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then(checkResponse)
    .then((data) => data);
};

const getSavedSongs = async () => {
  const token = await getToken();
  if (!token) return;

  return fetch(`${baseUrl}/me/tracks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then(checkResponse)
    .then((data) => {
      if (!data.items.length) {
        console.log("No saved songs found.");
        return [];
      }

      let songs = data.items.map((song) => {
        return {
          name: song.track.name || "Unknown Song",
          artist: song.track.artists[0].name || "Unknown Artist",
          id: song.track.id || "Unknown ID",
          image: song.track.album.images[0] || "No Album Cover Found",
        };
      });

      console.log("Song data from Spotify:", songs);
      return songs;
    })
    .catch((err) => console.error(err));
};

const playSong = async () => {
  const token = await getToken();
  if (!token) return;

  return fetch(`${baseUrl}/me/player/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then(checkResponse)
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
};

const playFromBeginning = async (token, deviceID, currentSong) => {
  if (!token) return;

  console.log("PLAYING:", currentSong);

  return fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [`spotify:track:${currentSong}`],
        position_ms: 0,
      }),
    }
  )
    .then((res) => {
      return checkResponse(res);
    })
    .catch((err) => console.error(err));
};

export {
  getProfileInfo,
  getSavedSongs,
  playSong,
  playFromBeginning,
  getSubscriptionStatus,
};
