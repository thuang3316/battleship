import { GameBoard } from "./gameboard";

const LETTERS = 'ABCDEFGHIJ'.split('');

export function renderBoard(gameBoard, containerId, onCellClick, placementOptions = null) {
    const boardMatrix = gameBoard.board;
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = '24px repeat(10, 28px)';
    wrapper.style.gridTemplateRows = '24px repeat(10, 28px)';
    wrapper.style.gap = '2px';

    // Corner cell
    wrapper.appendChild(document.createElement('div'));

    // Column headers (A–J)
    LETTERS.forEach(letter => {
        const label = document.createElement('div');
        label.textContent = letter;
        label.className = 'axis-label';
        wrapper.appendChild(label);
    });

    boardMatrix.forEach((row, rowIndex) => {
        // Row header (1–10)
        const rowLabel = document.createElement('div');
        rowLabel.textContent = rowIndex + 1;
        rowLabel.className = 'axis-label';
        wrapper.appendChild(rowLabel);

        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.col = colIndex;

            /* ── State classes ── */
            if (cell === 'hit') {
                cellDiv.classList.add('hit');
            } else if (cell === 'miss') {
                cellDiv.classList.add('miss');
            } else if (cell && cell !== '') {
                const ship = gameBoard.getShipById(cell);
                if (ship?.sunk) {
                    cellDiv.classList.add('sunk');
                } else if (containerId === 'humanBoard') {
                    cellDiv.classList.add('ship');
                }
            }

            /* ── Placement preview hover ── */
            if (placementOptions) {
                const { onHover, onLeave, onClick } = placementOptions;
                cellDiv.classList.add('place-target');
                cellDiv.addEventListener('mouseenter', () => onHover(rowIndex, colIndex));
                cellDiv.addEventListener('mouseleave', () => onLeave());
                cellDiv.addEventListener('click', () => onClick(rowIndex, colIndex));
            }

            /* ── Attack click (enemy board only) ── */
            const isAttackable =
                containerId === 'computerBoard' &&
                cell !== 'hit' &&
                cell !== 'miss' &&
                typeof onCellClick === 'function';

            if (isAttackable) {
                cellDiv.classList.add('available');
                cellDiv.addEventListener('click', () => onCellClick(rowIndex, colIndex));
            }

            wrapper.appendChild(cellDiv);
        });
    });

    container.appendChild(wrapper);
}

export function renderFleetTracker(humanFleet, computerFleet, phase) {
    const el = document.getElementById('fleet-tracker');
    if (!el) return;
    el.innerHTML = '';

    const makePanel = (label, fleet) => {
        const panel = document.createElement('div');
        panel.className = 'fleet-panel';

        const title = document.createElement('div');
        title.className = 'fleet-title';
        title.textContent = label;
        panel.appendChild(title);

        fleet.forEach(ship => {
            const row = document.createElement('div');
            row.className = 'ship-row';

            const name = document.createElement('span');
            name.className = 'ship-name';
            name.textContent = ship.name.slice(0, 4).toUpperCase();
            row.appendChild(name);

            for (let i = 0; i < ship.length; i++) {
                const block = document.createElement('div');
                block.className = 'ship-block' + (ship.sunk ? ' sunk-block' : '');
                row.appendChild(block);
            }

            panel.appendChild(row);
        });

        return panel;
    };

    el.appendChild(makePanel('YOUR FLEET', humanFleet));
    if (phase !== 'placement') {
        el.appendChild(makePanel('ENEMY FLEET', computerFleet));
    }
}

export function renderPlacementPanel(fleet, placedShips, selectedIndex, direction, callbacks) {
    const panel = document.getElementById('placement-panel');
    if (!panel) return;
    panel.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'DEPLOY FLEET';
    panel.appendChild(title);

    // Direction toggle
    const dirWrap = document.createElement('div');
    dirWrap.id = 'dir-toggle';
    dirWrap.innerHTML = `<span>DIRECTION</span>`;
    const dirBtn = document.createElement('button');
    dirBtn.textContent = direction[0] === 0 ? 'HORIZ' : 'VERT';
    dirBtn.onclick = () => {
        callbacks.toggleDirection();
        dirBtn.textContent = direction[0] === 0 ? 'VERT' : 'HORIZ';
    };
    dirWrap.appendChild(dirBtn);
    panel.appendChild(dirWrap);

    // Ship list
    const list = document.createElement('div');
    list.className = 'ship-select-list';
    fleet.forEach((ship, i) => {
        const item = document.createElement('div');
        const isPlaced = placedShips.has(i);
        const isSelected = i === selectedIndex && !isPlaced;
        item.className = 'ship-select-item' +
            (isPlaced ? ' placed' : '') +
            (isSelected ? ' selected-ship' : '');

        const blocks = document.createElement('div');
        blocks.className = 'ship-blocks-preview';
        for (let b = 0; b < ship.length; b++) {
            const mb = document.createElement('div');
            mb.className = 'mini-block';
            blocks.appendChild(mb);
        }
        item.appendChild(blocks);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${ship.name} (${ship.length})`;
        item.appendChild(nameSpan);

        if (!isPlaced) item.onclick = () => callbacks.selectShip(i);
        list.appendChild(item);
    });
    panel.appendChild(list);

    // Buttons
    const randomBtn = document.createElement('button');
    randomBtn.className = 'btn';
    randomBtn.textContent = '⟳ RANDOM PLACEMENT';
    randomBtn.onclick = callbacks.randomize;
    panel.appendChild(randomBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn danger';
    clearBtn.textContent = '✕ CLEAR BOARD';
    clearBtn.onclick = callbacks.clear;
    panel.appendChild(clearBtn);

    const startBtn = document.createElement('button');
    startBtn.className = 'btn';
    startBtn.textContent = '▶ START BATTLE';
    startBtn.disabled = placedShips.size < fleet.length;
    startBtn.onclick = callbacks.start;
    panel.appendChild(startBtn);
}