import { useContext } from "react";
import "./Header.css";
import quizContext from "../../Context/QuizContext";
import headerLogo from "../../assets/musicLogo.jpg";
import { useEffect } from "react";
import { redirectAuth } from "../../utils/Auth";
import Profile from "../Profile/Profile";
import { getProfileInfo } from "../../utils/Api";
import { Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  //VARIABLES AND STATES
  const { isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser } =
    useContext(quizContext);

  const navigate = useNavigate();

  //FUNCTIONS
  //Sign In Function . maybe pass a function to open a modal that for Spotifys Oauth
  const handleSignIn = () => {
    console.log("Logging In");

    //start Authentication Process
    redirectAuth().then((res) => {
      console.log(res);
    });
  };

  //useEffect HOOKS
  useEffect(() => {
    // Check if there is an access token stored (indicating the user is logged in)
    const token = localStorage.getItem("accessToken");
    console.log(token);

    if (token) {
      getProfileInfo()
        .then((userInfo) => {
          /*     console.log("userInfo:", userInfo); */
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

  useEffect(() => {
    /*  console.log("update currentUser:", currentUser); */
  }, [currentUser]);

  /*   useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      console.log("token found:", token);
      checkToken(token)
        .then((userData) => {
          setCurrentUser(userData);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (!token) {
      console.log("No Token Found");
    }
  }, []); */

  ///
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} />

      {!isLoggedIn ? (
        <button className="header__login-btn" onClick={handleSignIn}>
          Sign In With Spotify
        </button>
      ) : (
        <Profile />
      )}
      {/* <button
        className="header__logout-btn"
        onClick={() => {
          alert("LOGGED OUT");
          setCurrentUser(null);
          handleLogOut();
        }}
      >
        Log Out
      </button> */}
    </header>
  );
};

export default Header;
