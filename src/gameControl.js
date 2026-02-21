export class GameController {
    constructor(player1, player2) {
        this.currentPlayer = player1;
        this.waitingPlayer = player2;
        this.gameOver = false;
        this.winner = null;
        this.humanHits = 0;
        this.enemySunk = 0;
    }

    playTurn(x = null, y = null) {
        if (this.gameOver) return null;

        const result = this.currentPlayer.takeTurn(
            this.waitingPlayer.gameBoard,
            x,
            y
        );

        // Track human stats
        if (x !== null && (result === 'hit' || result === 'sunk')) {
            this.humanHits++;
        }
        if (x !== null && result === 'sunk') {
            this.enemySunk++;
        }

        if (this.waitingPlayer.gameBoard.isGameOver()) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            return { result, winner: this.winner };
        }

        this.switchTurns();
        return { result };
    }

    switchTurns() {
        [this.currentPlayer, this.waitingPlayer] =
            [this.waitingPlayer, this.currentPlayer];
    }

    startGame() {
        // Only place computer board here; human places manually
        this.waitingPlayer.gameBoard.placeBoard();
    }
}