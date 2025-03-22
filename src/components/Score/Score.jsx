import "./Score.css";

const Score = () => {
  const [score, setScore] = useState(0);

  const handleUpdateScore = () => {
    setScore((prevScore) => prevScore + 1);
  };

  return (
    <div className="score">
      <h1 className="score__title">Score:{score}</h1>
    </div>
  );
};

export default Score;
