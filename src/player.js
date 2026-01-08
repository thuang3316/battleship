import { GameBoard } from "./gameBoard";

export class Player {
    constructor(type = "human") {
        this.type = type;          // "human" | "computer"
        this.gameBoard = new GameBoard();
    }

    attack(opponentBoard, x, y) {
        return opponentBoard.receiveAttack(x, y);
    }
}

export class ComputerPlayer extends Player {
    constructor() {
        super("computer");
        this.attackedCoords = new Set();
    }

    randomAttack(opponentBoard) {
        let x, y, key;

        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            key = `${x},${y}`;
        } while (this.attackedCoords.has(key));

        this.attackedCoords.add(key);
        return opponentBoard.receiveAttack(x, y);
    }
}