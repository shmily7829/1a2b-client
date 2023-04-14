import type GameStateEnum from "./GameStateEnum";

export default interface Game {
    gameId: string;
    player1Id: string;
    player2Id: string;
    gameStateEnum: GameStateEnum;
    turnPlayerId: string;
    guessHistory: string[];
}
