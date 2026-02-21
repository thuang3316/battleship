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
        this.targetQueue = []; // hunt/target AI queue
    }

    takeTurn(opponentBoard) {
        let x, y, key;

        // If we have targets queued from a previous hit, use them first
        while (this.targetQueue.length > 0) {
            [x, y] = this.targetQueue.shift();
            key = `${x},${y}`;
            if (x >= 0 && x < 10 && y >= 0 && y < 10 && !this.attacked.has(key)) break;
            x = null;
        }

        // Otherwise pick a random unattacked cell
        if (x == null) {
            let tries = 0;
            do {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
                key = `${x},${y}`;
                tries++;
            } while (this.attacked.has(key) && tries < 200);
        }

        this.attacked.add(key);
        const result = opponentBoard.receiveAttack(x, y);

        if (result === 'hit') {
            // Queue adjacent cells to continue targeting this ship
            [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].forEach(([nx, ny]) => {
                const nk = `${nx},${ny}`;
                if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10 && !this.attacked.has(nk)) {
                    this.targetQueue.push([nx, ny]);
                }
            });
        } else if (result === 'sunk') {
            // Ship sunk — clear the queue and go back to random hunting
            this.targetQueue = [];
        }

        return result;
    }

    reset() {
        this.attacked = new Set();
        this.targetQueue = [];
    }
}