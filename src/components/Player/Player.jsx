import "./Player.css";
import { useEffect, useState } from "react";

const Player = ({ accessToken, songs }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState("");

  //create a random song uri (which is the song id)
  const getRandomSong = (songs) => {
    const randomNumber = Math.floor(Math.random() * songs.length);
    const songId = songs[randomNumber].id;
    console.log(songId);
    return `spotify:track:${songId}`; //create uri by prepending 'spotify:track:' to the tracks ID.
  };

  //create the player
  useEffect(() => {
    if (window.Spotify) {
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

  const togglePlayBack = () => {
    if (player) {
      //get random song if player isnt null
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
