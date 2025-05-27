import { useEffect, useState } from "react";
import "./App.css";
import quizContext from "../../Context/QuizContext";
import Entry from "../Entry/Entry";
import Header from "../Header/Header";
import { handleRedirect } from "../../utils/Auth";
import { getProfileInfo } from "../../utils/Api";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Callback from "../Callback";

function App() {
  //state variables
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [activeModal, setActiveModal] = useState("");

  //variables
  const ONE_HOUR = 60 * 60 * 1000; //variable for an hour timer
  const navigate = useNavigate();

  //FUNCTIONS

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem("accessToken");
      /* console.log("token:", token); */

      if (!token) {
        // if no token
        const userInfo = await handleRedirect(); //call handle redirect
        token = localStorage.getItem("accessToken"); //reassign token after handleRedirect runs
        console.log("TOKEN in APP:", token);
        if (userInfo && token) {
          //thers a token and an active user
          setAccessToken(token);
          setIsLoggedIn(true);
          setCurrentUser(userInfo);
          navigate("/");
        }
      } else {
        // if already signed in
        try {
          console.log("TOKEN FOUND");
          const userInfo = await getProfileInfo(); //get profile info
          console.log("User info from API:", userInfo);
          setAccessToken(token);
          setIsLoggedIn(true);
          setCurrentUser(userInfo);
        } catch (err) {
          console.error("Token exists but user fetch failed:", err);
        }
      }
    };

    checkAuth(); //call checkAuth
  }, []);

  //auto logout and token check
  useEffect(() => {
    let logoutTimer;

    const checkTokenValidity = () => {
      const token = localStorage.getItem("accessToken"); //get token from localStorage
      const tokenTimestamp = localStorage.getItem("tokenTimestamp"); //create a timeStamo from when token was created

      if (token && tokenTimestamp) {
        //if theres a token and a timeStamp
        const tokenAge = Date.now() - parseInt(tokenTimestamp, 10);

        if (tokenAge > ONE_HOUR) {
          console.log("🔒 Token expired on load. Logging out.");
          localStorage.removeItem("accessToken"); //remove accessToken
          localStorage.removeItem("tokenTimestamp"); //remove tokenTimestamp
          setIsLoggedIn(false);
          setCurrentUser(null);
          navigate("/"); // redirect to login
        } else {
          // Token is still good — set auto logout timer
          const timeLeft = ONE_HOUR - tokenAge;
          logoutTimer = setTimeout(() => {
            console.log("⏰ Token expired. Auto logging out.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("tokenTimestamp");
            setIsLoggedIn(false);
            setCurrentUser(null);
            navigate("/");
          }, timeLeft);
        }
      }
    };

    checkTokenValidity();

    return () => clearTimeout(logoutTimer); // cleanup timer if component unmounts
  }, [isLoggedIn, navigate]);

  //check if user has premium subscription
  useEffect(() => {});

  return (
    <quizContext.Provider
      value={{
        isStarted,
        setIsStarted,
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
        accessToken,
        setAccessToken,
      }}
    >
      <div className="page">
        <Header />
        <Routes>
          <Route path="/callback" element={<Callback />} />
        </Routes>
        <Entry />
        {activeModal === "endModal" && (
          <EndModal
            activeModal={activeModal}
            handleCloseModal={handleCloseModal}
            score={score}
          />
        )}
      </div>
    </quizContext.Provider>
  );
}

export default App;
