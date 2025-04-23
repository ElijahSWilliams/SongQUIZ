import { useCallback, useContext, useEffect } from "react";
import "./Entry.css";
import Quiz from "../Quiz/Quiz.jsx";
import quizContext from "../../Context/QuizContext";

const Entry = () => {
  const {
    isStarted,
    setIsStarted,
    setCurrentUser,
    currentUser,
    setIsLoggedIn,
    isLoggedIn,
  } = useContext(quizContext);

  const handleStartQuiz = () => {
    setIsStarted(true);
  };
  useEffect(() => {
    console.log(`currentUser in ENtry: ${currentUser}`);
  }, []);

  return (
    <div className="entry">
      {!isStarted ? ( //if not started, render btn
        <button onClick={handleStartQuiz} className="entry__play-btn">
          {!isLoggedIn
            ? "Start Quiz (Guest Mode)"
            : `Start Quiz as ${currentUser?.display_name}`}
        </button>
      ) : (
        //if started, render quiz
        <Quiz />
      )}
    </div>
  );
};

export default Entry;
