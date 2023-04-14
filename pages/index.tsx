import GameStateData from "@/api/data/response/GameStateData";
import ApiContext from "@/components/ApiContext";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";

export default function HomePage() {
  //useState -> 狀態更新
  //setcode -> code 資料更新 -> useState -> 更新的資料給 homepage -> 重新render
  const [playerId, setPlayerId] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [guess, setGuess] = useState("");
  const [number, setNumber] = useState("");
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const { gameController } = useContext(ApiContext);
  const router = useRouter();

  const handleClick = async () => {
    const gameResponse = await gameController.createGame();
    const gameStateResponse = await gameController.getGameState(
      gameResponse.data.gameId
    );
    setPlayerId(gameStateResponse.data.player1Id);
    setGameState(gameStateResponse.data);
    prompt(
      "請複製這串遊戲網址給另一名玩家",
      `${location.origin}/?gameId=${gameResponse.data.gameId}&playerId=${gameResponse.data.player2Id}`
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (typeof router.query.gameId == "string") {
        const gameStateResponse = await gameController.getGameState(
          router.query.gameId
        );
        setGameState(gameStateResponse.data);
      }

      if (typeof router.query.playerId == "string") {
        setPlayerId(router.query.playerId);
      }
    };
    fetchData();
  }, [router.query.gameId]);

  if (gameState == null) {
    return (
      <div>
        <h1>1A2B練功場</h1>
        <button onClick={handleClick}>StartGame</button>
      </div>
    );
  }

  return (
    <div>
      <h1>1A2B練功場</h1>
      <pre>顯示遊戲狀態 {JSON.stringify(gameState, null, 2)}</pre>
      <p>{playerId}</p>
      <br />
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
