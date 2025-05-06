import PremiumPlayer from "./PremiumPlayer";
import GuestPlayer from "./PlayerWrapper";

const PlayerWrapper = ({
  accessToken,
  currentSong,
  songs,
  onPlayerReady,
  disableOptions,
  setDisableOptions,
  isGuest,
}) => {
  return isGuest ? (
    <GuestPlayer
      currentSong={currentSong}
      disableOptions={disableOptions}
      setDisableOptions={setDisableOptions}
    />
  ) : (
    <PremiumPlayer
      accessToken={accessToken}
      currentSong={currentSong}
      songs={songs}
      onPlayerReady={onPlayerReady}
      disableOptions={disableOptions}
      setDisableOptions={setDisableOptions}
    />
  );
};

export default PlayerWrapper;
