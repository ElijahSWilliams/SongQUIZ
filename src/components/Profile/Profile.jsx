import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import quizContext from "../../Context/QuizContext";
import LogOutModal from "../Modal/Modal";

const Profile = () => {
  const { isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser } =
    useContext(quizContext);
  const [activeModal, setActiveModal] = useState("");

  const navigate = useNavigate();

  const handleOpenLogoutModal = () => {
    setActiveModal("logout");
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };

  const handleLogOut = () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      console.log("Logging out with token:", token);
    } else {
      console.log("No token found");
    }

    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken");
    console.log("User logged out");
    navigate("/");
    handleCloseModal();
  };

  return (
    <div className="profile">
      <h2 className="profile__title">Profile</h2>

      {currentUser ? (
        <div className="profile__info">
          <p>
            <h2 className="profile__info_name">Name:</h2>{" "}
            {currentUser.display_name}
          </p>
          <p>
            <h2 className="profile__info-email">Email:</h2>{" "}
            {currentUser.email || "Not available"}
          </p>
          {/* Add more info if available, like profile pic, etc. */}
        </div>
      ) : (
        <p>No user info available.</p>
      )}

      <button
        className="profile__logout-btn logout"
        onClick={handleOpenLogoutModal}
      >
        Log Out
      </button>

      <LogOutModal
        activeModal={activeModal}
        handleCloseModal={handleCloseModal}
        handleLogOut={handleLogOut}
      />
    </div>
  );
};

export default Profile;
