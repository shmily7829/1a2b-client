import GameController from "@/api/GameController";
import React from "react";

const ApiContext = React.createContext({
    gameController: new GameController("http://localhost:8080/api/v1"),
});

export default ApiContext;