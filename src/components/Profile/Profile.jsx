import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import quizContext from "../../Context/QuizContext";
import LogOutModal from "../Modal/Modal";

const Profile = () => {
  //import userContext
  const { isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser } =
    useContext(quizContext);
  const [activeModal, setActiveModal] = useState("");

  const navigate = useNavigate();

  const handleOpenLogoutModal = () => {
    console.log("Log Out Modal");
    setActiveModal("logout");
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };

  const handleLogOut = () => {
    let token = localStorage.getItem("accessToken");

    if (token) {
      console.log(token);
    } else {
      console.log("No Token FOund");
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken"); // remove from local storage
    console.log("User logged out"); //debugging
    navigate("/"); // Redirect to home page '/' using router
    handleCloseModal();
  };

  //Modal

  return (
    <div className="profile">
      <button className="profile__btn" onClick={handleOpenLogoutModal}>
        {currentUser?.display_name}
      </button>
      {/* Show when logout is active */}
      <LogOutModal
        activeModal={activeModal}
        handleCloseModal={handleCloseModal}
        handleLogOut={handleLogOut}
      />
    </div>
  );
};

export default Profile;
