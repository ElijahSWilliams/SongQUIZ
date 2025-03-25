import "./Player.css";
import checkResponse from "../../utils/Api";
import { useEffect, useState } from "react";

const Player = ({ accessToken, songs }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState("");
  const [deviceID, setDeviceID] = useState(null);

  //genertate a random song
  const getRandomSong = (songs) => {
    const randomNumber = Math.floor(Math.random() * songs.length);
    const songId = songs[randomNumber].id;
    /*     console.log(songId); */
    return `spotify:track:${songId}`; //create uri by prepending 'spotify:track:' to the tracks ID.
  };

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

      setPlayer((prev) => {
        spotifyPlayer;
      });

      // web player event listeners
      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with Device ID:", device_id);
        setDeviceID((prev) => {
          device_id;
        });

        transferPlayback(); //automatically transfer playback when player sends 'ready' event
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Player is not ready:", device_id);
      });

      spotifyPlayer.addListener("player_state_changed", (state) => {
        console.log("Player state changed:", state);
      });

      spotifyPlayer.connect().then((success) => {
        if (success) {
          console.log("Player Connected!");
        }
      });
    } else {
      console.error("Spotify SDK not loaded yet.");
    }
  }, [accessToken]); // Runs only if accessToken changes

  useEffect(() => {
    if (deviceID) {
      console.log(deviceID);
      console.log(player);
    }
  });

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
      body: JSON.stringify({ device_ids: [deviceID], play: false }),
    })
      .then((res) => {
        console.log(res);
        return checkResponse(res);
      })
      .catch((err) => {
        console.log("error tranferring playback:", err);
      });
  };

  //start and stop playback
  const togglePlayBack = () => {
    //check for active player and deviceId
    if (!player || !deviceID) {
      console.log("player:", player);
      console.log("deviceID:", deviceID);
      console.log("Waiting for player...");
      return; //end function execution
    }

    if (player) {
      //get random song if player isnt null
      console.log("READY");
      const randomSong = getRandomSong(songs);
      if (!isPlaying) {
        setIsPlaying(true);
        player.togglePlay({ uris: [randomSong] }).then(() => {
          console.log(randomSong);
          console.log("Playing!");
        });
      }
      if (isPlaying) {
        setIsPlaying(false);
        player.pause().then(() => {
          console.log("Paused!");
        });
      }
    }
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
