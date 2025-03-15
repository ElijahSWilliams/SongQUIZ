import { useContext, useState } from "react";
import "./Profile.css";
import quizContext from "../../Context/QuizContext";
import LogOutModal from "../Modal/Modal";

const Profile = () => {
  //import userContext
  const { isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser } =
    useContext(quizContext);
  const [activeModal, setActiveModal] = useState("");

  console.log("Profile:", currentUser);

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
    setCurrentUser("");
    localStorage.removeItem("accessToken"); // If using localStorage
    console.log("User logged out");
    window.location.href = "/"; // Redirect to home page '/'. Try using router
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
