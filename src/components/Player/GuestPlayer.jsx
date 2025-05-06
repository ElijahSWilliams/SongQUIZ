import { useEffect, useRef } from "react";

const GuestPlayer = ({
  currentSong,
  disableOptions,
  setDisableOptions,
  songs,
}) => {
  const audioRef = useRef(null);

  useEffect(() => {
    console.log(songs.map((song) => song));
  }, [songs]);

  if (!currentSong?.preview_url) {
    return <div>No preview available 😢</div>;
  }

  const handlePlay = () => {
    if (!disableOptions) {
      audioRef.current?.play();
    }
  };

  const handlePause = () => {
    audioRef.current?.pause();
  };

  return (
    <div className="controls">
      <audio ref={audioRef} src={currentSong.preview_url} />
      <button onClick={handlePlay} disabled={disableOptions}>
        ▶️ Play
      </button>
      <button onClick={handlePause} disabled={disableOptions}>
        ⏸️ Pause
      </button>
    </div>
  );
};

export default GuestPlayer;
