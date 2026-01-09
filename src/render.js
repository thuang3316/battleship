import { GameBoard } from "./gameboard";

export function renderBoard(gameBoard, containerId, onCellClick) {
    const boardMatrix = gameBoard.board;
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const letters = 'ABCDEFGHIJ'.split('');
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = '40px repeat(10, 30px)';
    wrapper.style.gridTemplateRows = '30px repeat(10, 30px)';
    wrapper.style.gap = '2px';

    const corner = document.createElement('div');
    wrapper.appendChild(corner); 

    letters.forEach(letter => {
        const label = document.createElement('div');
        label.textContent = letter;
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.justifyContent = 'center';
        label.style.fontWeight = 'bold';
        wrapper.appendChild(label);
    });

    boardMatrix.forEach((row, rowIndex) => {
        const rowLabel = document.createElement('div');
        rowLabel.textContent = rowIndex + 1;
        rowLabel.style.display = 'flex';
        rowLabel.style.alignItems = 'center';
        rowLabel.style.justifyContent = 'center';
        rowLabel.style.fontWeight = 'bold';
        wrapper.appendChild(rowLabel);

        row.forEach((cell, colIndex) => {
            // cell = '', 'miss', 'hit', 'sunk', 'repeat'
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');

            /* ---------- Hit / Miss ---------- */

            if (cell === 'hit') {
                cellDiv.classList.add('hit');
                cellDiv.textContent = 'X';
            }

            if (cell === 'miss') {
                cellDiv.classList.add('miss');
                cellDiv.textContent = 'O';
            }

            /* ---------- Ship handling ---------- */

            if (cell && cell !== 'hit' && cell !== 'miss') {
                const ship = gameBoard.getShipById(cell);

                if (ship?.sunk) {
                    cellDiv.classList.add('sunk');
                } else if (containerId === 'humanBoard') {
                    cellDiv.classList.add('ship');
                }
            }

            /* ---------- Click interaction (enemy board only) ---------- */

            const isAttackable =
                containerId === 'computerBoard' &&
                cell !== 'hit' &&
                cell !== 'miss' &&
                typeof onCellClick === 'function';

            if (isAttackable) {
                cellDiv.classList.add('available');
                cellDiv.addEventListener('click', () => {
                    onCellClick(rowIndex, colIndex);
                });
            }
            wrapper.appendChild(cellDiv);
        });
    });

    container.appendChild(wrapper);
}