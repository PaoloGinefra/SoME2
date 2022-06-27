const cellSize = 50;
var grid = [];
const stack = [], states = [];
var current;
const cols = 12, rows = 12;

function generateMaze() {
    for (let i = 0; i < rows; i++) {
		grid[i] = [];
		for (let j = 0; j < cols; j++) {
			grid[i][j] = new Cell(i, j);
		}
	}
	current = grid[0][0];
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
            if (isState(grid[i][j])) {
                grid[i][j].highLight();
                states.push(grid[i][j]);
            }
        }
    }
}

function removeWalls(a, b) {
    var x = a.i - b.i, y = a.j - b.j;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function isState(cell) {
    return cell.walls.filter(Boolean).length < 2;
}
