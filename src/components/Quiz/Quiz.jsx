import { useContext, useState } from "react";
import { useEffect } from "react";
import "./Quiz.css";
import { getSavedSongs } from "../../utils/Api";
import quizContext from "../../Context/QuizContext";
import Player from "../Player/Player";
import Score from "../Score/Score";
import { accessToken, stopPlayback } from "../../utils/Constants";
import { getRandomSong } from "../../utils/Constants";
import { getSubscriptionStatus } from "../../utils/Api";

const Quiz = () => {
  //state Vars
  const [visible, setVisible] = useState(false);
  const [songs, setSongs] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [selection, setSelection] = useState(null);
  const [answerChoices, setAnswerChoices] = useState(null);
  const [score, setScore] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [hasPremium, setHasPremium] = useState(true);
  const [spotifyPlayer, setSpotifyPlayer] = useState(null);
  const { isStarted, setIsStarted } = useContext(quizContext);

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    /*  alert(answer.formattedAnswer); */

    //if statement to update score
    if (selection === answer.formattedAnswer) {
      console.log("Choice:", selection);
      setScore((prevScore) => prevScore + 1);
    } else if (!selection === answer.formattedAnswer) {
      console.log("Sorry, Incorrect Answer.");
    }
    console.log("Calling handleNextQuestion....");
    handleNextQuestion();
  };

  const handleResetQuiz = (e) => {
    e.preventDefault();
    console.log("Resetting");
    setIsStarted(false);
  };

  const handleAnswerSelect = (e) => {
    const playerSelection = e.target.value;
    setSelection(playerSelection);
    console.log("selected:", playerSelection);
  };

  const handlePlayerReady = (playerInstance) => {
    setSpotifyPlayer(playerInstance); // Store it if you want to use it later
    console.log("Player is ready and passed to parent:", playerInstance);
  };

  const handleNextQuestion = () => {
    console.log("Next Question...");
    const quizLimit = 5;

    //if currentQuestion is less than quizLimit and currentQuestion is less than the length of the songs array.
    if (currentQuestion < quizLimit - 1 && currentQuestion < songs.length - 1) {
      setCurrentQuestion((prev) => prev + 1); //increment currentQuestion Count
    } else {
      console.log("Quiz finished!");
      // Maybe show results or redirect to end screen
    }
  };

  //check for subscription status
  useEffect(() => {
    getSubscriptionStatus().then((data) => {
      /* console.log("Sub Status:", data.product); */
      if (data.product === "premium") {
        setHasPremium(true);
      } else {
        setHasPremium(false);
      }
    });
  }, []);

  //function to get other answer choices
  const getQuizOptions = (songs, randomSong) => {
    //pass in songs and randomSong obecjts
    /*    console.log("songs from getQuizOptions:", songs);
    console.log("randomSong from getQuizOptions:", randomSong.song); */

    /* console.log("randomSong +", randomSong); */
    const options = [`${randomSong.song.name} - ${randomSong.song.artist}`]; //put correct song in array
    console.log("options:", options);

    while (options.length < 4) {
      //while options array is less than 4
      const otherSong = getRandomSong(songs); //othersong = getRandomSong output

      //othersong has a nested song object
      console.log("otherSong:", otherSong.song);

      const otherSongText = `${otherSong.song.name} - ${otherSong.song.artist}`;
      /*  console.log("songtext:", otherSongText); */

      if (!options.includes(otherSongText)) {
        options.push(otherSongText);
      }
    }

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

  //get songs on inital webpage load
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await getSavedSongs();
        if (!songs) return; //if no songs, end function

        if (songs && songs.length > 4) {
          setSongs(songs);
          console.log(
            "Songs",
            songs.map((song) => song)
          );
          console.log(songs.map((song) => song.name));
          const randomSong = getRandomSong(songs); //object with song and name properties
          console.log("RANDOMSONG:", randomSong.song);
          setCurrentSong(randomSong.song.id);

          //shuffle songs
          const options = getQuizOptions(songs, randomSong);
          console.log("options:", options);
          console.log("correctSiong:", randomSong.song);
          const formattedAnswer = `${randomSong.song.name} - ${randomSong.song.artist}`;
          console.log(formattedAnswer);
          setAnswer({ ...randomSong, formattedAnswer: formattedAnswer });
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

  /*  useEffect(() => {
    console.log("AnswerChoices:", answerChoices);
    console.log("hasPremium:", hasPremium);
  }); */

  return (
    <form
      className={`quiz ${visible ? "quiz__visible" : ""}`}
      onSubmit={handleSubmitQuiz}
    >
      <h1 className="quiz__header">Name that Song {currentQuestion}</h1>

      {hasPremium === null ? (
        <p className="quiz__header-signedOut">Loading User Info...</p>
      ) : hasPremium ? (
        <Player
          accessToken={accessToken}
          currentSong={currentSong}
          songs={songs}
          onPlayerReady={handlePlayerReady}
        />
      ) : (
        <h1>PLACEHOLDER PLAYER</h1>
      )}
      {/* END TERNARY OPERATOR */}

      <Score score={score} />

      {/* Render the choices */}
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
