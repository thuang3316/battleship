import './styles.css';
import { GameController } from "./gameControl";
import { drawBoard } from "./render";
import { Player, ComputerPlayer } from "./player";

const human = new Player();
const computer = new ComputerPlayer();

const game = new GameController(human, computer);
game.startGame();
drawBoard(human.gameBoard.renderBoard(), 'humanBoard');
drawBoard(computer.gameBoard.renderBoard(true), 'computerBoard');

const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {

})