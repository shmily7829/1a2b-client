export interface GameStartScreenProps {
  onGameStart: () => void;
}

export default function GameStartScreen(props: GameStartScreenProps) {
  return (
    <div>
      <h1>1A2B練功場</h1>
      <button onClick={props.onGameStart}>StartGame</button>
    </div>
  );
}
