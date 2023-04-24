import SetPlayerNumberRequest from "@/api/data/request/SetPlayerNumberRequest";
import GameStateData from "@/api/data/response/GameStateData";
import GameStateEnum from "@/api/entities/GameStateEnum";
import ApiContext from "@/components/ApiContext";
import { useRouter } from "next/router";
import {
  useContext,
  useState,
  useEffect,
  SetStateAction,
  ChangeEventHandler,
} from "react";

export default function HomePage() {
  /*Context*/
  const { gameController } = useContext(ApiContext);

  /*State*/
  const [playerId, setPlayerId] = useState("");
  const [number, setNumber] = useState("");
  const [guess, setGuess] = useState("");
  const [gameState, setGameState] = useState<GameStateData | null>(null);
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

  //P2的畫面
  useEffect(() => {
    var playerId = router.query.playerId;
    var gameId = router.query.gameId;

    const fetchData = async () => {
      //拿到遊戲狀態
      if (typeof gameId == "string") {
        const gameStateResponse = await gameController.getGameState(gameId);
        setGameState(gameStateResponse.data);
      }

      //取得P2的Id
      if (typeof playerId == "string") {
        setPlayerId(playerId);
      }
    };
    fetchData();
  }, [router.query]);

  useEffect(() => {
    if (gameState == null || gameState.gameState == GameStateEnum.GAME_OVER) {
      return;
    }

    if (
      gameState.gameState == GameStateEnum.GUESSING &&
      gameState.turnPlayerId == playerId
    ) {
      return;
    }

    const fetchData = async () => {
      console.log(gameState);
      const gameStateResponse = await gameController.getGameState(
        gameState.gameId
      );

      setGameState(gameStateResponse.data);
    };

    setTimeout(() => {
      fetchData();
    }, 5000);
  }, [gameState]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNumber(event.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("遊戲狀態:", gameState);
    if (gameState == null) {
      return;
    }

    if (gameState.gameState == GameStateEnum.SETTING_ANSWER) {
      const playerAnsResponse = await gameController.setPlayerNumber(
        { number },
        gameState.gameId,
        playerId
      );
      console.log(`${playerId}:`, playerAnsResponse);
    }

    if (gameState.gameState == GameStateEnum.GUESSING) {
      const playerAnsResponse = await gameController.guessPlayerNumber(
        { guesserId: playerId, number },
        gameState.gameId
      );

      const gameStateResponse = await gameController.getGameState(
        gameState.gameId
      );

      setGameState(gameStateResponse.data);

      console.log(`${playerId}:${playerAnsResponse.message}`);
    }
  }
  if (gameState == null) {
    return (
      <div>
        <h1>1A2B練功場</h1>
        <button onClick={handleClick}>StartGame</button>
      </div>
    );
  }

  //P1的畫面
  return (
    <div>
      <h1>1A2B練功場</h1>
      {/* <pre>顯示遊戲狀態 {JSON.stringify(gameState, null, 2)}</pre> */}
      <p>玩家id: {playerId}</p>
      <p>設置的答案: {number}</p>
      <p>遊戲狀態:{gameState.gameState}</p>
      <p>當前玩家id: {gameState.turnPlayerId}</p>
      <p>贏家：{gameState.winnerId}</p>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Answer:
          <input
            type="text"
            required
            maxLength={4}
            placeholder="請設置一組不重複的答案"
            value={number}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      猜測記錄：
      <textarea disabled value={toGameHistory(gameState).join("\n")}></textarea>
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
