import { useContext, useState } from "react";
import { useEffect } from "react";
import "./Quiz.css";
import { getSavedSongs } from "../../utils/Api";
import quizContext from "../../Context/QuizContext";

const Quiz = () => {
  //state Vars
  const [visible, setVisible] = useState(false);
  const [songs, setSongs] = useState([]);
  const [Question, setQuestion] = useState(1);

  const { isStarted, setIsStarted } = useContext(quizContext);

  //Function
  const handleResetQuiz = (e) => {
    e.preventDefault();
    console.log("Reset");
    console.log(e);
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

  //get songs on load
  useEffect(() => {
    getSavedSongs().then((songs) => {
      if (songs) {
        setSongs(songs);
        console.log(songs.map((song) => song.name));
      } else {
        console.error("No Songs Found");
      }
    });
  }, []);

  return (
    <form className={`quiz ${visible ? "quiz__visible" : ""}`}>
      <h1 className="quiz__header">Question {Question}</h1>

      {songs.length > 0 ? (
        <ul className="quiz__options">
          {songs.slice(0, 4).map((song) => (
            <li key={song?.track?.id}>
              <label>
                <input type="radio" name="quizOption" value={song?.track?.id} />
                {song.name}
              </label>
            </li>
          ))}
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
