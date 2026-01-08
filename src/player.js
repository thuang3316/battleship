import { GameBoard } from "./gameboard";

export class Player {
    constructor() {
        this.gameBoard = new GameBoard();
    }

    takeTurn(opponentBoard, x, y) {
        return opponentBoard.receiveAttack(x, y);
    }
}

export class ComputerPlayer extends Player {
    constructor() {
        super();
        this.attacked = new Set();
    }

    takeTurn(opponentBoard) {
        let x, y, key;

        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            key = `${x},${y}`;
        } while (this.attacked.has(key));

        this.attacked.add(key);
        return opponentBoard.receiveAttack(x, y);
    }
}