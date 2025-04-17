import { useContext, useState } from "react";
import { useEffect } from "react";
import "./Quiz.css";
import { getSavedSongs } from "../../utils/Api";
import quizContext from "../../Context/QuizContext";
import Player from "../Player/Player";
import { accessToken, stopPlayback } from "../../utils/Constants";
import { getRandomSong } from "../../utils/Constants";

const Quiz = ({ player }) => {
  //state Vars
  const [visible, setVisible] = useState(false);
  const [songs, setSongs] = useState([]);
  const [Question, setQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [answerChoices, setAnswerChoices] = useState(null);
  const [score, setScore] = useState(0);
  const { isStarted, setIsStarted } = useContext(quizContext);

  //Functions
  const handleResetQuiz = (e) => {
    e.preventDefault();
    console.log("Reset");

    setIsStarted(false);
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    alert(answer);
  };

  //check for correct answer
  /*     if (answer === `${song.name} - ${song.artist}`) {
      setScore((prevScore) => prevScore + 1); //increment score
    } */

  const handleAnswerSelect = (e) => {
    const selection = e.target.value;
    console.log(selection);
    setAnswer(selection);
  };

  //function to get other answer choices
  const getQuizOptions = (songs, randomSong) => {
    console.log("hi"); // This log will tell you if the function is being called

    // Create an array with the correct song
    const options = [`${randomSong.name} - ${randomSong.artist}`]; // Corrected to use randomSong.name

    // Get 3 other random songs that are not the correct answer
    while (options.length < 4) {
      // While there are less than 4 songs
      const otherSong = getRandomSong(songs);
      const otherSongText = `${otherSong.name} - ${otherSong.artist}`; // Get song name and artist

      // Make sure we don't add the same song multiple times
      if (!options.includes(otherSongText)) {
        options.push(otherSongText);
      }
    }

    // Shuffle the options so the correct answer isn't always in the same position
    return shuffleArray(options);
  };

  /*  */
  //Function to shuffle answer choices
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  //

  /////END FUNCTIONS ///////////
  //fade in animation
  /* useEffect(() => {
    if (isStarted) {
      setTimeout(() => {
        setVisible(true);
      }, 150);
    } else {
      setVisible(false);
    }
  }, [isStarted]); */

  //get songs on load

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await getSavedSongs();
        if (songs && songs.length > 4) {
          const getRandomSong = (songList) =>
            songList[Math.floor(Math.random() * songList.length)];

          setSongs(songs);
          console.log(
            "Songs",
            songs.map((song) => song)
          );
          console.log(songs.map((song) => song.name));
          const randomSong = getRandomSong(songs);
          console.log("Songs:", songs, "RandomSong:", randomSong);
          const options = getQuizOptions(songs, randomSong);
          console.log("options:", options);
          setAnswer(randomSong.song);
          setAnswerChoices(options);
        } else {
          console.error("Not enough songs or no songs found.");
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  console.log("Answer choices:", answerChoices);

  useEffect(() => {
    console.log("answer:", answer);
    console.log("answerChoices:", answerChoices);
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
          {answerChoices &&
            answerChoices.map((song, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name="quiz__option"
                    value={song}
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
