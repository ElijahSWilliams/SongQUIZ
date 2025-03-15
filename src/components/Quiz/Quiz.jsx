import { useState } from "react";
import { useEffect } from "react";
import "./Quiz.css";
import { getSavedSongs } from "../../utils/Api";

const Quiz = () => {
  //state Vars
  const [visible, setVisible] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [songs, setSongs] = useState([]);

  //Function
  const handleResetQuiz = (e) => {
    e.preventDefault();
    console.log("Reset");
    setIsStarted(false);
  };

  //fade in animation
  useEffect(() => {
    if (isStarted) {
      setTimeout(() => {
        setVisible(true);
      }, 150);
    } else {
      setVisible(false);
    }
  }, [isStarted]);

  useEffect(() => {
    getSavedSongs().then((songs) => {
      if (songs) {
        console.log(songs);
        setSongs(songs);
        /* const songNames = songs.items.map((song) => song.track.name);
        console.log("SONGS:", songNames); */
      } else {
        console.error("No Songs Found");
      }
    });
  }, []);

  return (
    <form className={`quiz ${visible ? "quiz__visible" : ""}`}>
      <h1 className="quiz__header">Question 1</h1>

      {songs.length > 0 ? (
        <ul className="quiz__options">
          {songs.slice(0, 4).map((song) => {
            //slice (0, 4) to get first four songs and then map them to a list element.
            return (
              //make sure to return
              <li key={song?.track?.id}>
                {/* get track name and artist name */}
                {song?.track?.name} - {song?.track?.artists[0]?.name}{" "}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="quiz__options">Loading Songs...</p>
      )}

      <button className="quiz__reset-btn" onClick={handleResetQuiz}>
        Reset
      </button>
    </form>
  );
};

export default Quiz;
