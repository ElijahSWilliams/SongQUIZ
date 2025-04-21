// Score.js
import "./Score.css";

const Score = ({ score }) => {
  return (
    <div className="score">
      <h1 className="score__title">Score: {score}</h1>
    </div>
  );
};

export default Score;
