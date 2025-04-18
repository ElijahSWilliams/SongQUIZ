import { useContext, useState } from "react";
import { useEffect } from "react";
import "./Quiz.css";
import { getSavedSongs } from "../../utils/Api";
import quizContext from "../../Context/QuizContext";
import Player from "../Player/Player";
import { accessToken, stopPlayback } from "../../utils/Constants";
import { getRandomSong } from "../../utils/Constants";
import { getSubscriptionStatus } from "../../utils/Api";

const Quiz = () => {
  //state Vars
  const [visible, setVisible] = useState(false);
  const [songs, setSongs] = useState([]);
  const [Question, setQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [answerChoices, setAnswerChoices] = useState(null);
  const [score, setScore] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [hasPremium, setHasPremium] = useState(true);
  const { isStarted, setIsStarted } = useContext(quizContext);

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    alert(answer);
  };

  const handleAnswerSelect = (e) => {
    const selection = e.target.value;
    console.log(selection);
    setAnswer(selection);
  };

  //check for subscription status
  useEffect(() => {
    getSubscriptionStatus().then((data) => {
      console.log("Sub Status:", data);
      if (data === "premium") {
        setHasPremium(true);
      } else {
        console.log("Free Plan");
        setHasPremium(false);
      }
    });
  }, []);

  //function to get other answer choices
  const getQuizOptions = (songs, randomSong) => {
    //pass in songs and randomSong obecjts
    console.log("songs from getQuizOptions:", songs);
    console.log("randomSong from getQuizOptions:", randomSong.song);

    console.log("randomSong +", randomSong);
    const options = [`${randomSong.song.name} - ${randomSong.song.artist}`]; //put correct song in array
    console.log("options:", options);

    while (options.length < 4) {
      //while options array is less than 4
      const otherSong = getRandomSong(songs); //othersong = getRandomSong output

      //othersong has a nested song object
      console.log("otherSong:", otherSong.song);

      const otherSongText = `${otherSong.song.name} - ${otherSong.song.artist}`;
      console.log("songtext:", otherSongText);

      if (!options.includes(otherSongText)) {
        options.push(otherSongText);
      }
    }

    return shuffleArray(options);
  };

  /*  */
  //Function to shuffle answer choices
  const shuffleArray = (array) => {
    console.log("SHUFFLEARRAY FUNCTION");
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
          setAnswer(randomSong);
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

  useEffect(() => {
    console.log("AnswerChoices:", answerChoices);
  });

  return (
    <form
      className={`quiz ${visible ? "quiz__visible" : ""}`}
      onSubmit={handleSubmitQuiz}
    >
      <h1 className="quiz__header">Name that Song {Question}</h1>

      {hasPremium === null ? (
        <p className="quiz__header-signedOut">Loading User Info...</p>
      ) : hasPremium ? (
        <Player
          accessToken={accessToken}
          currentSong={currentSong}
          songs={songs}
        />
      ) : (
        <h1>PLACEHOLDER PLAYER</h1>
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
                  />
                  {song}
                </label>
              </li>
            ))}
        </ul>
      ) : (
        <p className="quiz__options">Loading Songs...</p>
      )}
    </form>
  );
};

export default Quiz;
