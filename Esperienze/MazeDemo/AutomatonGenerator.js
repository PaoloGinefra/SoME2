const automaton = [];

function generateAutomaton() {
    for (let i = 0; i < states.length; i++) {
        automaton[i] = [];
        for (let j = 0; j < states[i].walls.length; j++) {
            if (states[i].walls[j])
                automaton[i][j] = i;
            else {
                automaton[i][j] = checkPath(states[i], i, j);
            }

        }
    }
    return automaton;
}

function checkPath(cell, initialState, exitDirection) {
    const neighbor = cell.getNeighbors(exitDirection);
    const entryDirection = exitDirection < 2 ? exitDirection + 2 : exitDirection - 2;

    if (states.indexOf(neighbor) !== -1)
        return states.indexOf(neighbor);

    if (neighbor.walls.filter((_, i) => i !== entryDirection).filter(Boolean).length == 3)
        return initialState;

    const nextEntryDirection = neighbor.walls.findIndex((dir, i) => {
        if (i !== entryDirection && dir == false)
            return true;
        return false;
    })
    return checkPath(neighbor, initialState, nextEntryDirection)
}


function printMatrix(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        let out = "";
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === undefined)
                out += '*\t';
            else
                out += matrix[i][j] + '\t';
        }
        console.log(out);
    }
}