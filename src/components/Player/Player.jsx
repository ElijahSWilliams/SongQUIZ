import "./Player.css";
import checkResponse from "../../utils/Api";
import { useEffect, useState } from "react";
import { playFromBeginning } from "../../utils/Api";
import { getRandomSong } from "../../utils/Constants";

const Player = ({
  accessToken,
  currentSong,
  onPlayerReady,
  isPlaying,
  setIsPlaying,
}) => {
  //State Variables
  const [player, setPlayer] = useState(null);
  /* const [isPlaying, setIsPlaying] = useState(""); */
  const [deviceID, setDeviceID] = useState(null);

  //UseEffect Hooks
  //initalize the player
  useEffect(() => {
    if (window.Spotify) {
      console.log("Spotify SDK:", window.Spotify);
      const spotifyPlayer = new window.Spotify.Player({
        name: "Song Quiz",
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.5,
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
        console.log("State:", state.context.uri);
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
          onPlayerReady(spotifyPlayer); //pass as prop to quiz component
        }
      });
    } else {
      console.error("Spotify SDK not loaded yet.");
    }
  }, [accessToken]); // Runs only if accessToken changes
  ///////////////END INITIALIZE PLAYER/////////////////////////////////////

  // Function to handle playback
  const togglePlayBack = () => {
    if (player && deviceID) {
      console.log("player:", player, "Device ID:", deviceID);
      console.log("isplaying:", isPlaying);
      if (isPlaying) {
        player.pause().then(() => {
          console.log("Paused!", isPlaying);
          setIsPlaying(false);
        });
      } else {
        console.log("RUNNING ON LINE 87");
        //if not playing
        transferPlayback() //tranfer playback to web device
          .then(() => {
            console.log("SONG:", currentSong);
            // After the playback is transferred, resume with the random song
            playFromBeginning(accessToken, deviceID, currentSong)
              .then(() => {
                console.log("Currently Playing:", currentSong);
                setIsPlaying(true);
                /* handlePause(); */
              })
              .catch((err) => console.error(err));
          })
          .catch((error) => {
            console.error("Error transferring playback:", error);
          });
      }
    }
  };

  /* const handlePause = () => {
    setTimeout(() => {
      player.pause();
      setIsPlaying(false);
    }, 10000);
  }; */
  ///////////////////END PLAYBACK CONTROL FUNCTION///////////////////////////////////
  //

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
      .then((response) => {
        if (response.status === 204 || response.status === 202) {
          console.log("Playback transferred successfully!");
          return; // No JSON to parse
        }

        if (!response.ok) {
          throw new Error(`Spotify API error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("Response data:", data);
        }
      })
      .catch((err) => {
        console.error("Error transferring playback:", err);
      });
  };

  return (
    <div className="controls">
      <button
        className="player__playback-btn"
        type="button"
        onClick={togglePlayBack}
      >
        <img
          src={
            isPlaying
              ? "https://img.icons8.com/ios-filled/100/pause--v1.png"
              : "https://img.icons8.com/ios-filled/100/play--v1.png"
          }
          alt={isPlaying ? "Pause" : "Play"}
          className="player__icon"
        />
      </button>
    </div>
  );
};

export default Player;
