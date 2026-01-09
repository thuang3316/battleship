export function drawBoard(boardMatrix, containerId) {
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

        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.textContent = cell;
            cellDiv.classList.add('cell');
            
            cellDiv.addEventListener('click', () => {

            })
            wrapper.appendChild(cellDiv);
        });
    });

    container.appendChild(wrapper);
}
