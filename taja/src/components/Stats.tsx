interface Props {
  wpm: number;
  accuracy: number;
}

const Stats = ({ wpm, accuracy }: Props) => {
  return (
    <div className="flex items-center gap-4 text-dracula-cyan text-lg">
      <div>
        <span className="text-sm text-dracula-comment">WPM: </span>
        <span>{wpm.toFixed(0)}</span>
      </div>
      <div>
        <span className="text-sm text-dracula-comment">Accuracy: </span>
        <span>{accuracy.toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default Stats;