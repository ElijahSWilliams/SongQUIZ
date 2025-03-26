import "./Player.css";
import checkResponse from "../../utils/Api";
import { useEffect, useState } from "react";

const Player = ({ accessToken, songs }) => {
  //State Variables
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState("");
  const [deviceID, setDeviceID] = useState(null);

  //UseEffect Hooks

  //initalize the player
  useEffect(() => {
    if (window.Spotify) {
      console.log("Spotify SDK:", window.Spotify);
      const spotifyPlayer = new window.Spotify.Player({
        name: "Song Quiz",
        getOAuthToken: (cb) => cb(accessToken),
        volume: 1,
        robustness: "max",
      });

      setPlayer(spotifyPlayer);

      // web player event listeners
      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with Device ID:", device_id);
        setDeviceID(device_id);

        transferPlayback(); //automatically transfer playback when player sends 'ready' event
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Player is not ready:", device_id);
      });

      spotifyPlayer.addListener("player_state_changed", (state) => {
        console.log("Player state changed:", state);
      });

      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      //call connect to
      spotifyPlayer.connect().then((success) => {
        if (success) {
          console.log("Player Connected!");
        }
      });
    } else {
      console.error("Spotify SDK not loaded yet.");
    }
  }, [accessToken]); // Runs only if accessToken changes

  // Function to handle play/pause functions
  const togglePlayBack = () => {
    if (player && deviceID) {
      console.log("player:", player, "Device ID:", deviceID);
      if (isPlaying) {
        player.pause();
      } else {
        const randomSong = getRandomSong(songs);
        transferPlayback();
        player.resume({ uris: [randomSong] });
      }
      setIsPlaying(!isPlaying);
    }
  };

  //genertate a random song
  const getRandomSong = (songs) => {
    const randomNumber = Math.floor(Math.random() * songs.length);
    const songId = songs[randomNumber].id;
    /*     console.log(songId); */
    return `spotify:track:${songId}`; //create uri by prepending 'spotify:track:' to the tracks ID.
  };

  //Transfer playback to current device
  const transferPlayback = () => {
    //check for active device
    if (!deviceID) return;

    //make api call to transfer playback to current device
    return fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ device_ids: [deviceID], play: true }),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .catch((err) => {
        console.log("error tranferring playback:", err);
      });
  };

  return (
    <div className="controls">
      {/*  <button onClick={() => player?.previousTrack()}>&laquo; Prev</button> */}
      <button
        className="player__playback-btn"
        type="button"
        onClick={togglePlayBack}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      {/* <button onClick={() => player?.nextTrack()}>Next &raquo;</button> */}
    </div>
  );
};

export default Player;
