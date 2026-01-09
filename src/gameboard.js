import { Ship } from "./ship";

export class GameBoard {
    constructor() {
        this.board = Array(10).fill(null).map(()=> Array(10).fill(''));
        this.fleet = [new Ship(2), new Ship(3), new Ship(4), new Ship(4), new Ship(5)];
    }

    // helper functions
    resetBoard() {
        this.board = Array(10).fill(null).map(() => Array(10).fill(''));
        for (const ship of this.fleet) {
            ship.resetShip();
        }
    }

    isLegal(x, y) {
        // showcase whether a coordinate is illegal or not
        return (
            x >= 0 &&
            x < 10 &&
            y >= 0 &&
            y < 10 &&
            this.board[x][y] === ''
        );
    }

    createCoord() {
        // randomly initialize the head coordinate of a ship
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        return [x, y];
    }

    createDirection() {
        // randomly initialize the direction of a ship
        const directions = [[0,1], [0,-1], [1,0], [-1,0]];
        const index = Math.floor(Math.random() * 4);
        return directions[index];
    }

    getShipById(id) {
        for (const ship of this.fleet) {
            if (ship.id === id) return ship;
        }
        return null;
    }

    // methods
    placeShip(ship, coord, direction) {
        // e.g. coord = [3,4], representing the coordinate of the head of the ship
        // direction should be [0,1], [0,-1], [1,0] or [-1,0]

        const [x, y] = coord;
        const [dx, dy] = direction;

        // determine if it's legal to place the ship this way
        for (let i=0; i<ship.length; i++) {
            if (!this.isLegal(x+dx*i, y+dy*i)) {
                return false;
            } 
        }
        
        // if legal, change the values of the board;
        for (let i=0; i<ship.length; i++) {
            this.board[x+dx*i][y+dy*i] = ship.id;
        }

        return true;
    }

    placeBoard(maxAttempts = 1000) {
        let attempts = 0;

        while (attempts < maxAttempts) {
            attempts++;
            this.resetBoard();

            let placed = true;
            for (const ship of this.fleet) {
                if (!this.placeShip(ship, this.createCoord(), this.createDirection())) {
                    placed = false;
                    break;
                }
            }

            if (placed) return true;
        }

        throw new Error("Failed to place board");
    }

    receiveAttack(x, y) {
        const cell = this.board[x][y];

        if (cell === '') {
            this.board[x][y] = 'miss';
            return 'miss';
        }

        if (cell === 'hit' || cell === 'miss') {
            return 'repeat';
        }

        const ship = this.getShipById(cell);
        ship.hit();
        this.board[x][y] = 'hit';

        return ship.sunk ? 'sunk' : 'hit';
    }

    isGameOver() {
        return this.fleet.every(ship => ship.sunk);
    }

    renderBoard(forOpponent = false) {
        return this.board.map(row => 
            row.map(cell => {
                if (cell === '') return '';
                if (cell === 'hit') return 'X';
                if (cell === 'miss') return 'O';
                if (!forOpponent) return 'S'; // show ship for self
                return ''; // hide opponent ships
            })
        );
    }
}