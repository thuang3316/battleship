export function drawBoard(boardMatrix, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    boardMatrix.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.style.display = 'flex';

        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.textContent = cell;
            cellDiv.style.width = '30px';
            cellDiv.style.height = '30px';
            cellDiv.style.textAlign = 'center';
            cellDiv.style.border = '1px solid black';
            rowDiv.appendChild(cellDiv);
        });

        container.appendChild(rowDiv);
    });
}
