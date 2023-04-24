import GameApiClient from "@/api/GameController";
import React from "react";

const ApiContext = React.createContext({
    gameController: new GameApiClient("http://localhost:8080/api/v1"),
});

export default ApiContext;