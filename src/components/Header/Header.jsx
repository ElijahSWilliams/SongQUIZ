import { useContext, useState } from "react";
import "./Header.css";
import quizContext from "../../Context/QuizContext";
import headerLogo from "../../assets/musicLogo.jpg";
import { useEffect } from "react";
/* import { redirectAuth } from "../../utils/Auth"; */
import Profile from "../Profile/Profile";
import { getProfileInfo } from "../../utils/Api";
import { Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleSignIn } from "../../utils/Auth";

const Header = () => {
  //VARIABLES AND STATES
  const { isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser } =
    useContext(quizContext);
  /*  console.log(currentUser); */
  const [loading, setLoading] = useState(true); //inital stage for page load

  const navigate = useNavigate();

  //FUNCTIONS
  //Sign In Function . maybe pass a function to open a modal that for Spotifys Oauth

  //useEffect HOOKS
  ///
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); //retrieve token
    if (token) {
      setIsLoggedIn(true);
      getProfileInfo()
        .then((userInfo) => {
          setCurrentUser(userInfo);
          /* console.log("CurrentUSER:", userInfo); */
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  /* 
  useEffect(() => {
    let logoutTimer;

    if (isLoggedIn) {
      logoutTimer = setTimeout(() => {
        signOut();
      }, 60 * 60 * 1000); // 1 hour
    }

    return () => clearTimeout(logoutTimer); // Cleanup
  }, [isLoggedIn]); */

  if (loading) return null; //early exit if data is still loading

  return (
    <>
      {loading ? null : (
        <header className="header">
          <img className="header__logo" src={headerLogo} />
          {!isLoggedIn ? (
            <button className="header__login-btn" onClick={handleSignIn}>
              Sign In With Spotify
            </button>
          ) : (
            <Profile />
          )}
        </header>
      )}
    </>
  );
};

export default Header;
