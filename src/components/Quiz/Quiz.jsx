import { useState } from "react";
import { useEffect } from "react";
import "./Quiz.css";

const Quiz = () => {
  //state Vars
  const [visible, setVisible] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  //Function
  const handleResetQuiz = (e) => {
    e.preventDefault();
    console.log("Reset");
    setIsStarted(false);
  };

  //fade in animation
  useEffect(() => {
    if (isStarted) {
      setTimeout(() => {
        setVisible(true);
      }, 150);
    } else {
      setVisible(false);
    }
  }, [isStarted]);

  return (
    <form className={`quiz ${visible ? "quiz__visible" : ""}`}>
      <h1 className="quiz__header">Question 1</h1>

      <button className="quiz__reset-btn" onClick={handleResetQuiz}>
        Reset
      </button>
    </form>
  );
};

export default Quiz;
