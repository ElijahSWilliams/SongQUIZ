import { authUrl } from "./Constants";
import { baseUrl } from "./Constants";
import { accessToken } from "./Constants";
import { checkForToken } from "./Auth";

//catch errors or convert to response to json
export default function checkResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  } else {
    return res.json();
  }
}

const getProfileInfo = () => {
  console.log("Get Profile Running");
  console.log(accessToken);

  if (accessToken) {
    return fetch(`${baseUrl}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, //include token for authorization
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
      /*    console.log(data.items); */
      let songs = data.items.map((song) => {
        return {
          name: song.track.name,
          artist: song.track.artists[0].name,
          id: song.track.id,
        };
      });
      /*   console.log("mapped Songs:", songs); */
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
export { getProfileInfo, getSavedSongs, playSong };
