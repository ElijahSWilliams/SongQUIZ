import { useEffect } from "react";
import "./Modal.css";

function LogOutModal({ activeModal, handleCloseModal, handleLogOut }) {
  //close modal on keydown
  useEffect(() => {
    const handleEscClose = (e) => {
      console.log(e.target);
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [handleCloseModal]);

  return (
    <div
      className={`modal ${activeModal === "logout" ? "modal__opened" : ""}`}
      onClick={(e) => {
        if (e.target.classList.contains("modal")) {
          handleCloseModal();
        }
      }}
    >
      <div className="modal__content">
        <button className="modal__close-btn" onClick={handleCloseModal}>
          <img
            className="modal__close-img"
            /* src="src/assets/closebutton.svg" */
          ></img>
        </button>
        <h2 className="modal__logout-title">
          Are You Sure You Want to Log Out?
        </h2>
        <button className="modal__logout-btn" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default LogOutModal;
