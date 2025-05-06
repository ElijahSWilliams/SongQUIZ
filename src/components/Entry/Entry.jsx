import { useCallback, useContext, useEffect } from "react";
import "./Entry.css";
import Quiz from "../Quiz/Quiz.jsx";
import quizContext from "../../Context/QuizContext";
import { handleSignIn } from "../../utils/Auth.js";

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
      {!isStarted ? (
        <button
          onClick={!isLoggedIn ? handleSignIn : handleStartQuiz}
          className="entry__play-btn"
        >
          {!isLoggedIn
            ? "Sign In"
            : currentUser === null
            ? "Fetching info..."
            : `Start Quiz as ${currentUser.display_name}`}
        </button>
      ) : (
        <Quiz />
      )}
    </div>
  );
};

export default Entry;
