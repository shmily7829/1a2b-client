import GameStateData from "@/api/data/response/GameStateData";
import GameStateEnum from "@/api/entities/GameStateEnum";
import { useApiClients } from "@/components/ApiClientContext";
import GamePlayScreen from "@/components/GamePlayScreen";
import GameStartScreen from "@/components/GameStartScreen";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function HomePage() {
  /*Context*/
  const { game: gameApiClient } = useApiClients();

  /*State*/
  const [playerId, setPlayerId] = useState("");
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const router = useRouter();

  const startGame = async () => {
    const gameResponse = await gameApiClient.createGame();
    const gameStateResponse = await gameApiClient.getGameState(
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
    var playerId = router.query.playerId;
    var gameId = router.query.gameId;

    const fetchData = async () => {
      if (typeof gameId == "string") {
        const gameStateResponse = await gameApiClient.getGameState(gameId);
        setGameState(gameStateResponse.data);
      }

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
      const gameStateResponse = await gameApiClient.getGameState(
        gameState.gameId
      );

      setGameState(gameStateResponse.data);
    };

    setTimeout(() => {
      fetchData();
    }, 5000);
  }, [gameState]);

  if (gameState == null) {
    return <GameStartScreen onGameStart={startGame} />;
  }

  async function playerSetNumber(number: string) {
    await gameApiClient.setPlayerNumber(
      { number },
      gameState!.gameId,
      playerId
    );
  }

  async function playerGuessNumber(number: string) {
    await gameApiClient.guessPlayerNumber(
      { guesserId: playerId, number },
      gameState!.gameId
    );

    const gameStateResponse = await gameApiClient.getGameState(
      gameState!.gameId
    );

    setGameState(gameStateResponse.data);
  }

  return (
    <GamePlayScreen
      gameState={gameState}
      playerId={playerId}
      onPlayerSetNumber={playerSetNumber}
      onPlayerGuessNumber={playerGuessNumber}
    />
  );
}
