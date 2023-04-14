import type GameStateEnum from "../../entities/GameStateEnum";

export default interface GameStateData {
    gameId: string;
    player1Id: string;
    player2Id: string;
    gameStateEnum: GameStateEnum;
    turnPlayerId: string;
    guessHistory: string[];
}