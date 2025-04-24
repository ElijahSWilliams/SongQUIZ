import "./QuizEndModal.css";
import Score from "../Score/Score";
import { useNavigate } from "react-router-dom";

function EndModal({ activeModal, handleCloseModal }) {
  return (
    <div
      className={`modal ${activeModal === "endModal" ? "modal__opened" : ""} `}
    >
      <div className="modal__content">
        <h2 className="modal__logout-title">
          Congrats! Your Score is unknown at the moment lmaoooo
        </h2>
        <button
          className="modal__logout-btn"
          onClick={() => {
            console.log("ENDED!");
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default EndModal;
