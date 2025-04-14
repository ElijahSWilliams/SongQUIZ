import { useEffect, useState } from "react";
import "./App.css";
import quizContext from "../../Context/QuizContext";
import Entry from "../Entry/Entry";
import Score from "../Score/Score";
import Header from "../Header/Header";
import { handleRedirect } from "../../utils/Auth";
import { getProfileInfo } from "../../utils/Api";
import { useNavigate } from "react-router-dom";

function App() {
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        // We're likely being redirected with a ?code from Spotify
        const userInfo = await handleRedirect();
        if (userInfo) {
          setIsLoggedIn(true);
          setCurrentUser(userInfo);
          navigate("/");
        }
      } else {
        // Already signed in
        try {
          const userInfo = await getProfileInfo();
          setIsLoggedIn(true);
          setCurrentUser(userInfo);
        } catch (err) {
          console.error("Token exists but user fetch failed:", err);
        }
      }
    };

    checkAuth(); //call checkAuth
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
        {/* <Score /> */}
        <Entry />
      </div>
    </quizContext.Provider>
  );
}

export default App;
