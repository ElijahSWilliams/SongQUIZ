import "./QuizEndModal.css";

function QuizEndModal({ activeModal, handleCloseModal, score }) {
  const getEndMessage = () => {
    if (score >= 350) return "🎉 You're a music master!";
    if (score >= 250) return "👏 Great job!";
    if (score >= 50) return "👍 Not bad, but you can do better!";
    return "😅 Yikes… Better Luck Next Time?";
  };

  return (
    <div
      className={`modal ${activeModal === "endModal" ? "modal__opened" : ""} `}
    >
      <div className="modal__content">
        <h2 className="modal__logout-title">
          Your score is {score}. {getEndMessage()}
        </h2>
        <button
          className="modal__logout-btn"
          onClick={() => {
            console.log("ENDED!");
            /*  handleCloseModal(); */
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default QuizEndModal;
