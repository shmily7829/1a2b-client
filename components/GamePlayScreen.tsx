import GameStateData from "@/api/data/response/GameStateData";
import GameStateEnum from "@/api/entities/GameStateEnum";
import { useState } from "react";

export interface GamePlayScreenProps {
  gameState: GameStateData;
  playerId: string;
  onPlayerSetNumber: (number: string) => void;
  onPlayerGuessNumber: (number: string) => void;
}

export default function GamePlayScreen(props: GamePlayScreenProps) {
  const [number, setNumber] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (props.gameState.gameState == GameStateEnum.SETTING_ANSWER) {
      props.onPlayerSetNumber(number);
    }

    if (props.gameState.gameState == GameStateEnum.GUESSING) {
      props.onPlayerGuessNumber(number);
    }
  }

  const form = (
    <form onSubmit={handleSubmit}>
      <label>
        Answer:
        <input
          type="text"
          required
          maxLength={4}
          placeholder="請設置一組不重複的答案"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );

  return (
    <div>
      <h1>1A2B練功場</h1>
      {/* <pre>顯示遊戲狀態 {JSON.stringify(gameState, null, 2)}</pre> */}
      <p>玩家id: {props.playerId}</p>
      <p>設置的答案: {number}</p>
      <p>遊戲狀態:{props.gameState.gameState}</p>
      <p>當前玩家id: {props.gameState.turnPlayerId}</p>
      <p>贏家：{props.gameState.winnerId}</p>
      <br />
      {form}
      猜測記錄：
      <textarea
        readOnly
        value={toGameHistory(props.gameState).join("\n")}
      ></textarea>
    </div>
  );
}

function toGameHistory(gameState: GameStateData): string[] {
  const gameHistory: string[] = [];
  for (let index = 0; index < gameState.guessHistory.length; index++) {
    const guessNumber = gameState.guessHistory[index];
    const guessResult = gameState.resultHistory[index];

    if (index % 2 == 0) {
      gameHistory.push(`player1 ${guessNumber} ${guessResult}`);
    } else {
      gameHistory.push(`player2 ${guessNumber} ${guessResult}`);
    }
  }
  return gameHistory;
}
