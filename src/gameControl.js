export class GameController {
    constructor(player1, player2) {
        this.currentPlayer = player1;
        this.waitingPlayer = player2;
        this.gameOver = false;
        this.winner = null;
    }

    playTurn(x = null, y = null) {
        if (this.gameOver) return null;

        const result = this.currentPlayer.takeTurn(
            this.waitingPlayer.gameBoard,
            x,
            y
        );

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
        this.currentPlayer.gameBoard.placeBoard();
        this.waitingPlayer.gameBoard.placeBoard();
    }

}
