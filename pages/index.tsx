import Game from "@/api/entities/Game";
import ApiContext from "@/components/ApiContext";
import { useContext, useState } from "react";

export default function HomePage() {
  //useState -> 狀態更新
  //setcode -> code 資料更新 -> useState -> 更新的資料給 homepage -> 重新render
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [guess, setGuess] = useState("");
  const [number, setNumber] = useState("");
  const [game, setGame] = useState<Game | null>(null);
  const { gameController } = useContext(ApiContext);

  // setTimeout(() => {
  //   setCode(Date.now().toString());
  // }, 1000);

  if (game == null) {
    return (
      <div>
        <h1>1A2B練功場</h1>
        <button
          onClick={async () => {
            const gameResponse = await gameController.createGame();
            setGame(gameResponse.data);
          }}
        >
          StartGame
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>1A2B練功場</h1>
      <label id={game.gameId}>遊戲ID:{game.gameId}</label>
      <label id={game.player1Id}>Player1</label>
      <label id={game.player2Id}>Player2</label>
      <label id={game.turnPlayerId}>當前玩家</label>
      <input
        required
        maxLength={4}
        placeholder="請輸入數字"
        type="text"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
    </div>
  );
}
