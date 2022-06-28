const Top = 0, Right = 1, Bottom = 2, Left = 3; 

const cellSize = 50;
var grid = [];
const stack = [], states = [];
var current;
const cols = 11, rows = 11;

function generateMaze() {
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
    current = grid[0][0];
    states[0] = grid[floor(cols/2)][0];
    do {
        current.visited = true;
        var next = current.checkNeighbors();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j].show();
            }
        }
        if (next) {
            next.visited = true;
            stack.push(current);
            removeWalls(current, next);
            current = next;

        } else if (stack.length > 0) {
            current = stack.pop();
        }
    } while (stack.length !== 0);

}

function result() {
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            grid[i][j].show();
            if (isState(grid[i][j]) && i !== cols/2 && j !== 0)
                states.push(grid[i][j]);
        }
    }
    for (let i = 0; i < states.length; i++)
        states[i].highLight(i);
    return generateAutomaton();
}

function removeWalls(a, b) {
    var x = a.i - b.i, y = a.j - b.j;
    if (x === 1) {
        a.walls[Left] = false;
        b.walls[Right] = false;
    } else if (x === -1) {
        a.walls[Right] = false;
        b.walls[Left] = false;
    }
    if (y === 1) {
        a.walls[Top] = false;
        b.walls[Bottom] = false;
    } else if (y === -1) {
        a.walls[Bottom] = false;
        b.walls[Top] = false;
    }
}

function isState(cell) {
    return cell.walls.filter(Boolean).length < 2;
}
