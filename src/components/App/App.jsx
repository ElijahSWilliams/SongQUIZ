import { useEffect, useState } from "react";
import "./App.css";
import quizContext from "../../Context/QuizContext";
import Entry from "../Entry/Entry";
import Score from "../Score/Score";
import Header from "../Header/Header";
import { handleRedirect } from "../../utils/Auth";

function App() {
  const [score, setScore] = useState(0); //state for score
  const [isStarted, setIsStarted] = useState(); //context for quiz starting
  const [isLoggedIn, setIsLoggedIn] = useState(false); //logged in state
  const [authProcessed, setAuthProcessed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  //functions

  //useEffect to get auth code from url after authorization
  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <quizContext.Provider
      value={{
        isStarted,
        setIsStarted,
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
      }}
    >
      <div className="page">
        <Header />

        {/*  <Score /> */}
        <Entry />
      </div>
    </quizContext.Provider>
  );
}

export default App;
