interface Props {
  onRestart: () => void;
}

const RestartButton = ({ onRestart }: Props) => {
  return (
    <button
      onClick={onRestart}
      className="mt-4 px-4 py-2 bg-dracula-pink text-white font-bold rounded hover:bg-opacity-80 transition-colors"
    >
      Restart
    </button>
  );
};

export default RestartButton;
