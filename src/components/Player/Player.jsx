import "./Player.css";
import { useEffect, useState } from "react";
import { playSong } from "../../utils/Api";

const Player = ({ accessToken }) => {
  const [player, setPlayer] = useState(null);

  if (!accessToken) {
    <p>Please Log In to Spotify</p>;
  }

  // Load the Spotify Web Playback SDK
};

export default Player;
