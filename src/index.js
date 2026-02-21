import './styles.css';
import { GameController } from "./gameControl";
import { renderBoard, renderFleetTracker, renderPlacementPanel } from "./render";
import { Player, ComputerPlayer } from "./player";

// ── State ──────────────────────────────────────────────────────────────
let human, computer, game;
let gamePhase = 'placement'; // 'placement' | 'battle' | 'over'
let selectedShipIndex = 0;
let placedShips = new Set();
let direction = [0, 1]; // [0,1] = horizontal, [1,0] = vertical
let previewCells = [];

// Generation counter — incremented on every restart so stale
// setTimeout callbacks from the previous game know to bail out.
let generation = 0;

// ── Boot ───────────────────────────────────────────────────────────────
function init() {
    generation++;                  // invalidate any pending setTimeout from last game

    human = new Player();
    computer = new ComputerPlayer();
    game = new GameController(human, computer);
    game.startGame();              // places computer board only

    gamePhase = 'placement';
    selectedShipIndex = 0;
    placedShips = new Set();
    direction = [0, 1];
    previewCells = [];

    // Close dialog if it's open (mid-game restart via button)
    const dialog = document.querySelector('dialog');
    if (dialog.open) dialog.close();

    renderAll();
}

// ── Render ─────────────────────────────────────────────────────────────
function renderAll() {
    updateStatusBar();
    renderFleetTracker(
        human.gameBoard.fleet,
        computer.gameBoard.fleet,
        gamePhase
    );

    // Human board — with placement hooks during placement phase
    const placementOptions = gamePhase === 'placement'
        ? { onHover: showPreview, onLeave: clearPreview, onClick: placeShipAt }
        : null;

    renderBoard(human.gameBoard, 'humanBoard', null, placementOptions);

    // Placement panel (only during placement)
    if (gamePhase === 'placement') {
        renderPlacementPanel(
            human.gameBoard.fleet,
            placedShips,
            selectedShipIndex,
            direction,
            {
                toggleDirection,
                selectShip: (i) => { selectedShipIndex = i; renderAll(); },
                randomize: randomPlacement,
                clear: clearPlacement,
                start: startBattle,
            }
        );
        // Hide computer board during placement
        document.getElementById('computerBoard').innerHTML = '';
    } else {
        renderBoard(computer.gameBoard, 'computerBoard', handleHumanAttack);
    }
}

function updateStatusBar() {
    const msg = document.getElementById('status-message');
    const hitsEl = document.getElementById('human-hits');
    const sunkEl = document.getElementById('enemy-sunk');
    const restartBtn = document.getElementById('restart-btn');

    if (hitsEl) hitsEl.textContent = game.humanHits;
    if (sunkEl) sunkEl.textContent = game.enemySunk;

    // Show the restart button only once battle has started
    if (restartBtn) restartBtn.style.display = gamePhase === 'placement' ? 'none' : '';

    if (!msg) return;
    if (gamePhase === 'placement') {
        const ship = human.gameBoard.fleet[selectedShipIndex];
        msg.textContent = ship
            ? `PLACING: ${ship.name.toUpperCase()} (${ship.length})`
            : 'ALL SHIPS PLACED';
    } else if (gamePhase === 'battle') {
        msg.textContent = 'FIRE AT WILL';
    } else {
        msg.textContent = 'BATTLE COMPLETE';
    }
}

// ── Placement ──────────────────────────────────────────────────────────
function toggleDirection() {
    direction = direction[0] === 0 ? [1, 0] : [0, 1];
}

function showPreview(ri, ci) {
    clearPreview();
    if (placedShips.has(selectedShipIndex) || selectedShipIndex < 0) return;
    const ship = human.gameBoard.fleet[selectedShipIndex];
    if (!ship) return;

    const [dx, dy] = direction;
    const canP = human.gameBoard.canPlace(ship, [ri, ci], direction);

    for (let i = 0; i < ship.length; i++) {
        const r = ri + dx * i;
        const c = ci + dy * i;
        if (r < 0 || r > 9 || c < 0 || c > 9) continue;
        const cellDiv = document.querySelector(
            `#humanBoard .cell[data-row="${r}"][data-col="${c}"]`
        );
        if (cellDiv) {
            cellDiv.classList.add('place-preview');
            if (!canP) cellDiv.classList.add('invalid-preview');
            previewCells.push(cellDiv);
        }
    }
}

function clearPreview() {
    previewCells.forEach(c => c.classList.remove('place-preview', 'invalid-preview'));
    previewCells = [];
}

function placeShipAt(ri, ci) {
    if (placedShips.has(selectedShipIndex) || selectedShipIndex < 0) return;
    const ship = human.gameBoard.fleet[selectedShipIndex];
    if (!ship) return;

    if (human.gameBoard.placeShip(ship, [ri, ci], direction)) {
        placedShips.add(selectedShipIndex);
        // Advance to next unplaced ship
        selectedShipIndex = -1;
        for (let i = 0; i < human.gameBoard.fleet.length; i++) {
            if (!placedShips.has(i)) { selectedShipIndex = i; break; }
        }
        renderAll();
    }
}

function randomPlacement() {
    human.gameBoard.resetBoard();
    human.gameBoard.placeBoard();
    placedShips = new Set(human.gameBoard.fleet.map((_, i) => i));
    selectedShipIndex = -1;
    renderAll();
}

function clearPlacement() {
    human.gameBoard.resetBoard();
    placedShips = new Set();
    selectedShipIndex = 0;
    renderAll();
}

// ── Battle ─────────────────────────────────────────────────────────────
function startBattle() {
    gamePhase = 'battle';
    renderAll();
}

function handleHumanAttack(x, y) {
    if (gamePhase !== 'battle') return;

    const { result, winner } = game.playTurn(x, y);
    if (result === 'repeat') return;

    renderAll();

    if (winner) { endGame(true); return; }

    // Capture generation so the callback can detect a restart
    const myGeneration = generation;

    // Disable board during computer turn
    setComputerBoardClickable(false);
    setTimeout(() => {
        // If generation changed, a restart happened — abort this callback
        if (generation !== myGeneration) return;

        const turnResult = game.playTurn();
        renderAll();
        if (turnResult?.winner) { endGame(false); return; }
        setComputerBoardClickable(true);
    }, 600);
}

function setComputerBoardClickable(enabled) {
    const cells = document.querySelectorAll('#computerBoard .cell.available');
    cells.forEach(c => c.style.pointerEvents = enabled ? '' : 'none');
}

function endGame(humanWon) {
    gamePhase = 'over';
    renderAll();

    const dialog = document.querySelector('dialog');
    const titleEl = dialog.querySelector('h2');
    const subEl = dialog.querySelector('p');

    if (humanWon) {
        titleEl.textContent = 'VICTORY';
        titleEl.className = 'win';
        subEl.textContent = 'All enemy ships have been destroyed.';
    } else {
        titleEl.textContent = 'DEFEATED';
        titleEl.className = 'lose';
        subEl.textContent = 'Your fleet has been annihilated.';
    }

    setTimeout(() => dialog.showModal(), 400);
}

// ── Restart button (status bar) & dialog button ────────────────────────
document.getElementById('restart-btn').addEventListener('click', init);
document.querySelector('dialog button').addEventListener('click', () => {
    document.querySelector('dialog').close();
    init();
});

init();