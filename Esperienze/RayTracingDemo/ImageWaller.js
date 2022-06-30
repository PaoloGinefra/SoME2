class ImageWaller{
    /**
     * This obj can generate the walls for a givven binary matrix
     * @param {*} size The size of the image in wu
     */
    constructor(size = 1){
        this.size = size;
        this.Colors = [color('black'), color('white')]
        this.walls = [];
    }

    /**
     * Whether the indexes are in the matrix
     * @param {*} col # of columns
     * @param {*} row # of rows
     * @param {*} i 
     * @param {*} j 
     * @returns Bool
     */
    isIn(col, row, i, j){
        return i >= 0 && i < col && j >= 0 && j < row;
    }

    /**
     * Creates the walls for the matrix and it puts them in this.walls
     * @param {*} matrix Tha matrix
     */
    createWalls(matrix){
        this.walls = [];
        let col = matrix.length;
        let row = matrix[0].length;
        this.cellSize = this.size / matrix.length;

        for(let i = 0; i < col; i++){
            for(let j = 0; j < row; j++){
                let pos=createVector(
                            (j + 0.5)*this.cellSize - this.size/2,
                            (i - 0.5)*this.cellSize - this.size/2
                            );

                if(!this.isIn(col, row, i, j + 1) || matrix[i][j] == 0 && matrix[i][j + 1] == 1){
                    let offset = createVector(
                        this.cellSize / 2,
                        this.cellSize / 2,
                    );
                    this.walls.push(new Wall(
                        p5.Vector.add(pos, offset),
                        p5.Vector.add(pos, offset.rotate(-PI/2)),
                    ));
                }

                if(!this.isIn(col, row, i, j - 1) || matrix[i][j] == 0 && matrix[i][j - 1] == 1){
                    let offset = createVector(
                        -this.cellSize / 2,
                        -this.cellSize / 2,
                    );
                    this.walls.push(new Wall(
                        p5.Vector.add(pos, offset),
                        p5.Vector.add(pos, offset.rotate(-PI/2)),
                    ));
                }

                if(!this.isIn(col, row, i - 1, j) || matrix[i][j] == 0 && matrix[i - 1][j] == 1){
                    let offset = createVector(
                        this.cellSize / 2,
                        -this.cellSize / 2,
                    );
                    this.walls.push(new Wall(
                        p5.Vector.add(pos, offset),
                        p5.Vector.add(pos, offset.rotate(-PI/2)),
                    ));
                }

                if(!this.isIn(col, row, i + 1, j) || matrix[i][j] == 0 && matrix[i + 1][j] == 1){
                    let offset = createVector(
                        this.cellSize / 2,
                        this.cellSize / 2,
                    );
                    this.walls.push(new Wall(
                        p5.Vector.add(pos, offset),
                        p5.Vector.add(pos, offset.rotate(PI/2)),
                    ));
                }
            }
        }

        this.walls.forEach(wall => wall.draw())
    }

    /**
     * Draws the matrix [Surprising isn't it]
     * @param {*} matrix 
     */
    drawMatrix(matrix){
        this.cellSize = this.size / matrix.length;
        let wGS = this.cellSize * World.w2s();
        for(let i = 0; i < matrix.length; i++){
            for(let j = 0; j < matrix[i].length; j++){
                let pos = World.w2s(createVector(j*this.cellSize - this.size/2, i*this.cellSize - this.size/2));
                fill(this.Colors[matrix[i][j]]);
                square(pos.x, pos.y, wGS);
            }
        }
    }
}