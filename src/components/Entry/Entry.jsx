import { useCallback, useContext } from "react";
import "./Entry.css";
import Quiz from "../Quiz/Quiz";
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

  return (
    <div className="entry">
      {!isStarted ? ( //if not started, render btn
        <button onClick={handleStartQuiz} className="entry__play-btn">
          {!isLoggedIn
            ? "Start Quiz (Guest Mode)"
            : `Start Quiz as ${currentUser?.name}`}
        </button>
      ) : (
        //if started, render quiz
        <Quiz />
      )}
    </div>
  );
};

export default Entry;
