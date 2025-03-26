import { useContext, useState } from "react";
import { useEffect } from "react";
import "./Quiz.css";
import { getSavedSongs } from "../../utils/Api";
import quizContext from "../../Context/QuizContext";
import Player from "../Player/Player";
import { accessToken } from "../../utils/Constants";
import { getRandomSong } from "../../utils/Constants";

const Quiz = () => {
  //state Vars
  const [visible, setVisible] = useState(false);
  const [songs, setSongs] = useState([]);
  const [Question, setQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [answerChoices, setAnswerChoices] = useState(null);
  const { isStarted, setIsStarted } = useContext(quizContext);

  //Functions
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

  //function to get other answer choices
  const getQuizOptions = (songs, randomSong) => {
    //create an array eith the correct song
    const options = [`${randomSong.song.name} - ${randomSong.song.artist}`]; //set song name and artist
    console.log(options);
    // Get 3 other random songs that are not the correct answer
    while (options.length < 4) {
      //while there are less than 4 songs
      const otherSong = getRandomSong(songs);
      const otherSongText = `${otherSong.song.name} - ${otherSong.song.artist}`; //get song name and artist
      // Make sure we don't add the same song multiple times
      if (!options.includes(otherSongText)) {
        options.push(otherSongText);
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

  /////END FUNCTIONS ///////////
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
      if (songs && songs.length > 4) {
        //ensure we have more than 4 songs
        setSongs(songs);
        console.log(
          "Songs",
          songs.map((song) => song)
        );
        console.log(songs.map((song) => song.name));
        /*  console.log(songs.map((song) => song.artist)); */
        const randomSong = getRandomSong(songs);
        const options = getQuizOptions(songs, randomSong);
        console.log(randomSong.songUri);
        setAnswer(randomSong);
        setAnswerChoices(options);
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
      <Player accessToken={accessToken} songs={songs} />

      {songs.length > 0 ? (
        <ul className="quiz__options">
          {answerChoices.map((song) => (
            <li key={song?.id}>
              <label>
                <input
                  type="radio"
                  name="quiz__option"
                  value={`${song?.name} - ${song?.artist}`}
                  onChange={handleAnswerSelect}
                />
                {song}
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
