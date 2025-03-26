import "./Player.css";
import checkResponse from "../../utils/Api";
import { useEffect, useState } from "react";
import { playFromBeginning } from "../../utils/Api";
import { getRandomSong } from "../../utils/Constants";

const Player = ({ accessToken, songs }) => {
  //State Variables
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState("");
  const [deviceID, setDeviceID] = useState(null);
  const [correctSong, setCorrectSong] = useState(null);

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
        console.log("Sate:", state.context.uri);
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
  ///////////////END INITIALIZE PLAYER/////////////////////////////////////

  /* const getRandomSong = (songs) => {
    console.log("song list:", songs);
    const randomNumber = Math.floor(Math.random() * songs.length);
    const songId = songs[randomNumber].id;
    return `spotify:track:${songId}`; //create uri by prepending 'spotify:track:' to the tracks ID.
  }; 
 */

  /*  const getRandomSong = (songs) => {
    if (!songs || songs.length === 0) return null; // Safety check
    const randomNumber = Math.floor(Math.random() * songs.length);
    console.log(songs[randomNumber]);
    return songs[randomNumber]; // Return the whole song object
  };
 */
  const getQuizOptions = (songs, randomSong) => {
    //create an array eith the correct song
    const options = [randomSong];

    // Get 3 other random songs that are not the correct answer
    while (options.length < 4) {
      //while there are less than 4 songs
      const otherSong = getRandomSong(songs);
      // Make sure we don't add the same song multiple times
      if (!options.includes(otherSong)) {
        options.push(otherSong);
      }
    }

    // Shuffle the options so the correct answer isn't always in the same position
    return shuffleArray(options);
  };

  //Function to shuffle answer choices
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Function to handle play/pause functions
  const togglePlayBack = () => {
    if (player && deviceID) {
      console.log("player:", player, "Device ID:", deviceID);
      if (isPlaying) {
        player.pause().then(() => {
          console.log("Paused!");
          setIsPlaying(false);
        });
      } else {
        //if not playing
        const randomSong = getRandomSong(songs); //get random song
        setCorrectSong(randomSong);
        transferPlayback() //tranfer playback to web device
          .then(() => {
            // After the playback is transferred, resume with the random song
            playFromBeginning(accessToken, deviceID, randomSong)
              .then(() => {
                console.log("Song:", randomSong);
                setIsPlaying(true);
              })
              .catch((err) => console.error(err));
          })
          .catch((error) => {
            console.error("Error transferring playback:", error);
          });
      }
      setIsPlaying(!isPlaying);
    }
  };
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
      body: JSON.stringify({
        device_ids: [deviceID],
        play: false,
      }),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .catch((err) => {
        console.log("error tranferring playback:", err);
      });
  };

  const playRandomSong = (randomSong) => {
    //check for active device and player
    if (!deviceID || !player) {
      console.log("No Device:", deviceID, "No Player:", player);
      return;
    }
    //api call
    playFromBeginning(accessToken, deviceID, randomSong)
      .then((data) => {
        setIsPlaying(true);
        console.log(data);
      })
      .catch((err) => {
        console.err(err);
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
