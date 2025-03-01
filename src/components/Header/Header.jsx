import { useContext } from "react";
import "./Header.css";
import quizContext from "../../Context/QuizContext";
import headerLogo from "../../assets/musicLogo.jpg";
import { useEffect } from "react";
import { redirectAuth } from "../../utils/Auth";
import Profile from "../Profile/Profile";
const Header = () => {
  //VARIABLES AND STATES
  const { isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser } =
    useContext(quizContext);
  console.log(currentUser);

  //FUNCTIONS
  //Sign In Function . maybe pass a function to open a modal that for Spotifys Oauth
  const handleSignIn = () => {
    console.log("Logging In");

    setIsLoggedIn(true);
    console.log(currentUser);
    /* redirectAuth().then((res) => {
      console.log(res);
      setCurrentUser(res);
    }); */
  };

  //useEffect HOOKS
  useEffect(() => {
    // Check if there is an access token stored (indicating the user is logged in)
    const token = localStorage.getItem("accessToken");
    console.log(token);

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  {
    /* <button
          className="header__profile-btn"
          onClick={() => {
            handleLogOut();
          }}
        >
          {currentUser.name}
        </button> */
  }

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
