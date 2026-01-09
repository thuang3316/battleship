import './styles.css';
import { GameController } from "./gameControl";
import { renderBoard } from "./render";
import { Player, ComputerPlayer } from "./player";

const human = new Player();
const computer = new ComputerPlayer();

const game = new GameController(human, computer);
game.startGame();

function render() {
    renderBoard(
        human.gameBoard,
        'humanBoard'
    );

    renderBoard(
        computer.gameBoard,
        'computerBoard',
        handleHumanMove
    );
}

function handleHumanMove(x, y) {
    if (game.gameOver) {
        const dialog = document.querySelector('dialog');
        dialog.textContent = 'Computer wins!';
        dialog.showModal();
        return;
    }
    if (!(game.currentPlayer instanceof Player)) return;

    game.playTurn(x, y);
    render();

    setTimeout(handleComputerMove, 500);
}

function handleComputerMove() {
    if (game.gameOver) {
        const dialog = document.querySelector('dialog');
        dialog.textContent = 'You win!';
        dialog.showModal();
        return;
    }
    if (!(game.currentPlayer instanceof ComputerPlayer)) return;

    game.playTurn();
    render();
}

render();