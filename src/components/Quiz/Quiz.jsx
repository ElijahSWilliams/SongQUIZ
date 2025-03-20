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
  const [answer, setAnswer] = useState("");

  const { isStarted, setIsStarted } = useContext(quizContext);

  //Function
  const handleResetQuiz = (e) => {
    e.preventDefault();
    console.log("Reset");
    console.log(e);
    setIsStarted(false);
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    alert(answer);
  };

  const handleAnswerSelect = (e) => {
    const selection = e.target.value;
    console.log(selection);
    setAnswer(selection);
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
        console.log(
          "Songs",
          songs.map((song) => song)
        );
        console.log(songs.map((song) => song.name));
        console.log(songs.map((song) => song.artist));
      } else {
        console.error("No Songs Found");
      }
    });
  }, []);

  return (
    <form
      className={`quiz ${visible ? "quiz__visible" : ""}`}
      onSubmit={handleSubmitQuiz}
    >
      <h1 className="quiz__header">Question {Question}</h1>

      {songs.length > 0 ? (
        <ul className="quiz__options">
          {songs.slice(0, 4).map((song) => (
            <li key={song?.id}>
              <label>
                <input
                  type="radio"
                  name="quiz__option"
                  value={`${song?.name} - ${song?.artist}`}
                  onChange={handleAnswerSelect}
                />
                {song.name} - {song.artist}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="quiz__options">Loading Songs...</p>
      )}

      <button className="quiz__submit-btn" type="submit">
        Submit
      </button>

      <button className="quiz__reset-btn" onClick={handleResetQuiz}>
        Reset
      </button>
    </form>
  );
};

export default Quiz;
