import { useContext, useState } from "react";
import "./Profile.css";
import quizContext from "../../Context/QuizContext";
import logOutModal from "../Modal/Modal";

const Profile = ({ activeModal }) => {
  //import userContext
  const { isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser } =
    useContext(quizContext);

  const handleOpenLogoutModal = () => {
    setActiveModal("logout");
  };

  const handleLogOut = () => {
    setCurrentUser("");
    /*   localStorage.removeItem("accessToken"); // If using localStorage
    sessionStorage.removeItem("accessToken"); // If using sessionStorage */
    console.log("User logged out");
    /* window.location.href = "/"; */ // Redirect to home/login page
  };

  console.log(currentUser?.name);
  return (
    <div className="profile">
      <button className="profile__btn" onClick={handleLogOut}>
        {currentUser?.name}
      </button>
    </div>
  );
};

export default Profile;
