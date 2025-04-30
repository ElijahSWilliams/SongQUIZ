import { authUrl } from "./Constants";
import { baseUrl } from "./Constants";
import { accessToken } from "./Constants";
import { checkForToken } from "./Auth";

//catch errors or convert to response to json
export default function checkResponse(res) {
  if (!res.ok) {
    //check for 401 error
    if (res.status === 401) {
      console.error("Unauthorized");
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(`Error: ${res.status}`);
  } else {
    return res.json();
  }
}

const getSubscriptionStatus = () => {
  return fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => {
      return checkResponse(res);
    })
    .then((data) => {
      console.log("Subscription Status:", data.product);
      return data;
      /*  if (data.product === "") */
    });
};

const getProfileInfo = () => {
  const token = localStorage.getItem("accessToken");
  /* console.log("getProfile Token:", token); */

  if (!token) {
    console.log("Token Unavailable");
    return;
  }

  if (token) {
    return fetch(`${baseUrl}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, //include token for authorization
        "Content-Type": `application/json`,
      },
    })
      .then((res) => {
        return checkResponse(res);
      })
      .then((data) => {
        /*  console.log("Data:", data);
        console.log("User Name:", data.display_name); */
        return data;
      });
  } else {
    console.log("NO TOKEN AVAILABLE");
    return;
  }
};

const getSavedSongs = () => {
  checkForToken(accessToken);

  return fetch(`${baseUrl}/me/tracks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return checkResponse(res);
    })
    .then((data) => {
      //If no data
      if (!data.items.length) {
        console.log("No saved songs found.");
        return []; // Return an empty array
      }
      //map songs
      let songs = data.items.map((song) => {
        return {
          name: song.track.name || "Unknown Song",
          artist: song.track.artists[0].name || "Unknown Artist",
          id: song.track.id || "Unknown ID",
        };
      });
      /*  console.log("Song data from Spotify:", songs); */

      return songs;
    })
    .catch((err) => {
      console.error(err);
    });
};

const playSong = (accessToken) => {
  return fetch(`${baseUrl}/me/player/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return checkResponse(res);
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.error(err));
};

const playFromBeginning = (accessToken, deviceID, currentSong) => {
  console.log("PLAYINGGGG", currentSong);
  return fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [`spotify:track:${currentSong}`], //play random song
        position_ms: 0, //start song from beginning
      }),
    }
  )
    .then((res) => {
      return checkResponse(res);
    })
    .catch((err) => {
      console.error(err);
    });
};

export {
  getProfileInfo,
  getSavedSongs,
  playSong,
  playFromBeginning,
  getSubscriptionStatus,
};
