import { useEffect, useState } from "react";
import "./App.css";
import quizContext from "../../Context/QuizContext";
import Entry from "../Entry/Entry";
import Score from "../Score/Score";
import Header from "../Header/Header";
import { handleRedirect } from "../../utils/Auth";
import Profile from "../Profile/Profile";
import { getProfileInfo } from "../../utils/Api";
function App() {
  const [score, setScore] = useState(0); //state for score
  const [isStarted, setIsStarted] = useState(); //context for quiz starting
  const [isLoggedIn, setIsLoggedIn] = useState(false); //logged in state
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if there is an access token stored (indicating the user is logged in)
    const token = localStorage.getItem("accessToken");

    if (token) {
      getProfileInfo()
        .then((userInfo) => {
          console.log("userInfo:", userInfo);
          setIsLoggedIn(true);
          setCurrentUser(userInfo);
          /*   console.log(currentUser); */
          navigate("/");
        })
        .catch((err) => console.error(err));
    } else if (!token) {
      console.log("No Token Found");
    }
  }, []);

  //functions

  //useEffect to get auth code from url after authorization
  useEffect(() => {
    handleRedirect();
  }, []);

  //useEffect to get user info
  // useEffect(() => {
  //   let token = localStorage.getItem("accessToken");
  //   /*  console.log(token); */
  //   if (token) {
  //     getProfileInfo();
  //   }
  // }, [isLoggedIn]);

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
