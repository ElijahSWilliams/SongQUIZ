import { useContext, useState } from "react";
import "./Profile.css";
import quizContext from "../../Context/QuizContext";
import LogOutModal from "../Modal/Modal";

const Profile = () => {
  //import userContext
  const { isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser } =
    useContext(quizContext);
  const [activeModal, setActiveModal] = useState("");

  const handleOpenLogoutModal = () => {
    console.log("Log Out Modal");
    setActiveModal("logout");
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };

  const handleLogOut = () => {
    setCurrentUser("");
    /*   localStorage.removeItem("accessToken"); // If using localStorage
    sessionStorage.removeItem("accessToken"); // If using sessionStorage */
    console.log("User logged out");
    /* window.location.href = "/"; */ // Redirect to home/login page
  };

  //Modal

  return (
    <div className="profile">
      <button className="profile__btn" onClick={handleOpenLogoutModal}>
        {currentUser?.name}
      </button>
      {/* Show when logout is active */}
      <LogOutModal
        activeModal={activeModal}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default Profile;
