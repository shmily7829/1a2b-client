import GameApiClient from "@/api/GameApiClient";
import React, { useContext } from "react";

const ApiClientContext = React.createContext({
    game: new GameApiClient("http://localhost:8080/api/v1"),
});

export function useApiClients() {
    return useContext(ApiClientContext);
}

export default ApiClientContext;