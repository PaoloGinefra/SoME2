function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;


    this.getNeighbors = function (selectedDirection = undefined) {
        let neighbors = [];
        if (grid[this.i][this.j - 1])
            neighbors[0] = grid[this.i][this.j - 1]; // top
        if (grid[this.i + 1] && grid[this.i + 1][this.j])
            neighbors[1] = grid[this.i + 1][this.j]; // right
        if (grid[this.i][this.j + 1])
            neighbors[2] = grid[this.i][this.j + 1]; // bottom
        if (grid[this.i - 1] && grid[this.i - 1][this.j])
            neighbors[3] = grid[this.i - 1][this.j]; // left

        if (selectedDirection === undefined)
            return neighbors;
        else
            return neighbors[selectedDirection];
    }

    this.checkNeighbors = function () {
        const neighbors = [];
        this.getNeighbors().forEach(dir => {
            if (dir && !dir.visited) {
                neighbors.push(dir);
            }
        });

        if (neighbors.length > 0)
            return neighbors[floor(random(0, neighbors.length))];
        else
            return undefined;
    }

    this.highLight = function (n = undefined) {
        noStroke();
        fill(255, 255, 255, 255);
        if (n !== undefined) {
            text(n, this.i * cellSize + cellSize / 2, this.j * cellSize + cellSize / 2);
        }
        fill(100, 100, 255, 100);
        rect(this.i * cellSize, this.j * cellSize, cellSize, cellSize);
    }

    this.show = function () {
        var x = this.i * cellSize;
        var y = this.j * cellSize;
        stroke(255);
        if (this.walls[0]) {
            line(x, y, x + cellSize, y);
        }
        if (this.walls[1]) {
            line(x + cellSize, y, x + cellSize, y + cellSize);
        }
        if (this.walls[2]) {
            line(x + cellSize, y + cellSize, x, y + cellSize);
        }
        if (this.walls[3]) {
            line(x, y + cellSize, x, y);
        }

        if (this.visited) {
            noStroke();
            fill(0, 0, 0, 100);
            rect(x, y, cellSize, cellSize);
        }
    }
}
