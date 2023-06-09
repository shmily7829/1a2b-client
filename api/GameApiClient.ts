import type GuessPlayerNumberRequest from "./data/request/GuessPlayerNumberRequest";
import type SetPlayerNumberRequest from "./data/request/SetPlayerNumberRequest";
import type GameStateData from "./data/response/GameStateData";
import type GuessPlayerNumberData from "./data/response/GuessPlayerNumberData";
import type Game from "./entities/Game";
import type Response from "./data/response/Response";

export default class GameApiClient {
    constructor(private apiBaseUrl: string) {

    }

    async createGame(): Promise<Response<Game>> {
        const response = await fetch(`${this.apiBaseUrl}/games`, { method: "post" });
        return response.json();
    }

    async setPlayerNumber(request: SetPlayerNumberRequest, gameId: string, playerId: string): Promise<Response<Game>> {
        const response = await fetch(`${this.apiBaseUrl}/games/${gameId}/players/${playerId}/answer`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });
        return response.json();
    }

    async guessPlayerNumber(request: GuessPlayerNumberRequest, gameId: string): Promise<Response<GuessPlayerNumberData>> {
        const response = await fetch(`${this.apiBaseUrl}/games/${gameId}/guess`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });
        return response.json();
    }

    //TODO: Promise Obj 
    async getGameState(gameId: string): Promise<Response<GameStateData>> {
        const response = await fetch(`${this.apiBaseUrl}/games/${gameId}`);
        return response.json();
    }

    // async getGameState(gameId: string): Promise<Response<GameStateData>> {
    //     return fetch(`${this.apiBaseUrl}/games/${gameId}`, { method: "get" }).then((response) => response.json());
    // }
}