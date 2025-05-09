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
import EndModal from "../QuizEndModal/QuizEndModal";

const Quiz = () => {
  //state Vars
  const [visible, setVisible] = useState(false);
  const [songs, setSongs] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [currentSongImage, setCurrentSongImage] = useState("");
  const [selection, setSelection] = useState(null);
  const [answerChoices, setAnswerChoices] = useState(null);
  const [score, setScore] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [hasPremium, setHasPremium] = useState();
  const [disableOptions, setDisableOptions] = useState(null);
  const [activeModal, setActiveModal] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [spotifyPlayer, setSpotifyPlayer] = useState(null);
  const { isStarted, setIsStarted } = useContext(quizContext);

  const handleSubmitQuiz = (e) => {
    e.preventDefault();

    //Pause the music
    if (spotifyPlayer) {
      spotifyPlayer
        .pause()
        .then(() => {
          setIsPlaying(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    //if statement to update score
    if (selection === answer.formattedAnswer) {
      setScore((prevScore) => prevScore + 100);
    } else if (selection === null) {
      return; //prevent submission of null answers
    }
    //Pause the music

    handleNextQuestion();
  };

  const handleResetQuiz = (e) => {
    setIsStarted(false);
    setScore(0);
    setSelection(null);
    setCurrentQuestion(1);
  };

  const handleAnswerSelect = (e) => {
    const playerSelection = e.target.value;
    setSelection(playerSelection);
  };

  const handlePlayerReady = (playerInstance) => {
    setSpotifyPlayer(playerInstance); // Store it if you want to use it later
    console.log("Player is ready and passed to parent:", playerInstance);
  };

  const handleNextQuestion = () => {
    const quizLimit = 6;

    //if currentQuestion is less than quizLimit and currentQuestion is less than the length of the songs array.
    if (currentQuestion < quizLimit && currentQuestion < songs.length - 1) {
      setCurrentQuestion((prev) => prev + 1); //increment currentQuestion Count
      setSelection(null); //reset user choice for the next question
      generateNextQuestion(); //get new set of Songs
    } else {
      // Show results or redirect to end screen
      loadEndScreen();
    }
  };

  const generateNextQuestion = () => {
    //disable the radio buttons
    setDisableOptions(true);

    //uncheck the radio buttons
    setSelection(null);

    const randomSong = getRandomSong(songs); // pick a song
    setCurrentSong(randomSong.song.id);
    setCurrentSongImage(randomSong.song.image.url);

    const options = getQuizOptions(songs, randomSong); // get options
    const shuffledOptions = shuffleArray(options); //mix them up

    const formattedAnswer = `${randomSong.song.name} - ${randomSong.song.artist}`;

    setAnswer({ ...randomSong, formattedAnswer });
    setAnswerChoices(shuffledOptions); // use the shuffled version

    setTimeout(() => {
      setDisableOptions(false);
    }, 1200);
  };

  const loadEndScreen = () => {
    setActiveModal("endModal");
  };

  const handleCloseModal = (e) => {
    setActiveModal("");
  };

  //check for subscription status
  useEffect(() => {
    getSubscriptionStatus().then((data) => {
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
    const options = [`${randomSong.song.name} - ${randomSong.song.artist}`]; //put correct song in array

    while (options.length < 4) {
      //while options array is less than 4
      const otherSong = getRandomSong(songs); //othersong = getRandomSong output

      //othersong has a nested song object
      console.log("otherSong:", otherSong.song);

      const otherSongText = `${otherSong.song.name} - ${otherSong.song.artist}`;

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
          console.log(songs.map((song) => song));
          const randomSong = getRandomSong(songs); //object with song and name properties
          console.log("RANDOMSONG:", randomSong.song);
          setCurrentSong(randomSong.song.id);
          console.log(randomSong.song.image.url);
          setCurrentSongImage(randomSong.song.image.url);

          //shuffle songs
          const options = getQuizOptions(songs, randomSong);
          console.log("options:", options);
          console.log("correctSong:", randomSong.song);
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

  console.log(currentSongImage);

  return (
    <form
      className={`quiz ${visible ? "quiz__visible" : ""}`}
      onSubmit={handleSubmitQuiz}
    >
      <h1 className="quiz__header"> Question Number: {currentQuestion}</h1>

      <h2 className="quiz__header-question">Name That Song</h2>

      <Score score={score} />

      {hasPremium === null ? (
        <p className="quiz__header-signedOut">Loading User Info...</p>
      ) : hasPremium ? ( //if user has premium
        <Player
          accessToken={accessToken}
          currentSong={currentSong}
          songs={songs}
          onPlayerReady={handlePlayerReady}
          disableOptions={disableOptions}
          setDisableOptions={setDisableOptions}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      ) : (
        //if user does not have premium
        <img
          alt="Album Cover"
          src={currentSongImage}
          className="quiz__album-cover"
        />
      )}
      {/* END TERNARY OPERATOR */}

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
                    disabled={disableOptions}
                    checked={selection === song}
                  />
                  {song}
                </label>
              </li>
            ))}
        </ul>
      ) : (
        <p className="quiz__options">Getting Songs...</p>
      )}

      <button className="quiz__submit-btn" type="submit">
        Submit
      </button>

      <button className="quiz__reset-btn" onClick={handleResetQuiz}>
        Reset
      </button>

      {activeModal === "endModal" && (
        <EndModal
          activeModal={activeModal}
          handleCloseModal={handleCloseModal}
          handleResetQuiz={handleResetQuiz}
          score={score} // Passing score to EndModal component
        />
      )}
    </form>
  );
};

export default Quiz;
