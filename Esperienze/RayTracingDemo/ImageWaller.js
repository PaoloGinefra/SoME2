class ImageWaller{
    /**
     * This obj can generate the walls for a givven binary matrix
     * @param {*} size The size of the image in wu
     */
    constructor(size = 1){
        this.size = size;
        this.Colors = [color('black'), color(255, 120)]
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
     * Recursive function to find walls bigger than one cell
     * @returns the index of the last cell of the wall
     */
    rightCheck(matrix, dir, i, j, col, row, wallCheck){
        let di = Number(dir == 'up')
        let dj = Number(!di);
        wallCheck[i][j][Number(dir != 'up')] = true
        if(this.isWall(i, j, i + di, j + dj, col, row, matrix, wallCheck) ||
          !this.isWall(i + di, j + dj, i + 1, j + 1, col, row, matrix, wallCheck)){
            return dir == 'up' ? i : j;
        }
        return this.rightCheck(matrix, dir, i + di, j + dj, col, row, wallCheck);
    }

    /**
     * Checks whether a wall sould be drawn between (i, j) an (k, l)
     */
    isWall(i, j, k, l, col, row, matrix, wallCheck){
        return (!this.isIn(col, row, k, l) || matrix[i][j] != matrix[k][l]) &&
        this.isIn(col, row, i, j) && !wallCheck[i][j][Number(i != k)];
    }

    /**
     * Creates the walls for the matrix and it puts them in this.walls
     * @param {*} matrix Tha matrix
     */
    createWalls(matrix){
        let col = matrix.length;
        let row = matrix[0].length;

        //wall Check's purpose is to store the spots alreay checked [right, up]
        let wallCheck = []
        for(let i = 0; i < col; i++){
            wallCheck.push([])
            for(let j = 0; j < row; j++){
                wallCheck[i].push([false, false]);
            }
        }

        this.walls = [];
        this.cellSize = this.size / matrix.length;

        //Finds the bottom edge walls
        for(let J = 0; J < 2; J++){
            let j = Boolean(J);
            for(let i = 0; i < (j ? col : row); i++){
                let pos=createVector(
                    ((j ? -1 : i) + 0.5)*this.cellSize - this.size/2,
                    ((j ? i : -1) - 0.5)*this.cellSize - this.size/2
                    );

                let start = i;

                while(!this.isWall(j ? i : 0,
                                  !j ? i : 0,
                                  j ? i + 1 : 0,
                                  !j ? i + 1 : 0, col, row, matrix, wallCheck) &&
                                  i + 1 < (j ? col : row))
                    i++;

                let offset = createVector(
                    this.cellSize / 2 * (j ? 1 : -1),
                    this.cellSize / 2 * (!j ? 1 : -1),
                );

                let p1 = p5.Vector.add(pos, offset);
                j ? offset.y *= -1 : offset.x *= -1
                j ? offset.y += (i - start) * this.cellSize : offset.x += (i - start) * this.cellSize;
                let p2 = p5.Vector.add(pos, offset);

                this.walls.push(new Wall(
                    p1,
                    p2,
                ));
            }
        }

        //Finds all the other walls
        for(let i = 0; i < col; i++){
            for(let j = 0; j < row; j++){
                let right = this.isWall(i, j, i, j + 1, col, row, matrix, wallCheck);
                let up = this.isWall(i, j, i + 1, j, col, row, matrix, wallCheck);
                let pos=createVector(
                            (j + 0.5)*this.cellSize - this.size/2,
                            (i - 0.5)*this.cellSize - this.size/2
                            );

                if(right){
                    if(!up){
                        let endI = this.rightCheck(matrix, 'up', i, j, col, row, wallCheck);
    
                        let offset = createVector(
                            this.cellSize / 2,
                            -this.cellSize / 2,
                        );
    
                        let p1 = p5.Vector.add(pos, offset);
                        offset.y *= -1
                        offset.y += (endI - i) * this.cellSize;
                        let p2 = p5.Vector.add(pos, offset);
    
                        this.walls.push(new Wall(
                            p1,
                            p2,
                        ));
                    }
                    else{
                        let offset = createVector(
                            this.cellSize / 2,
                            this.cellSize / 2,
                        );
                        this.walls.push(new Wall(
                            p5.Vector.add(pos, offset),
                            p5.Vector.add(pos, offset.rotate(-PI/2)),
                        ));
                        wallCheck[i][j][0] = true
                    }
                }
                
                if(up){
                    if(!right){
                        let endJ = this.rightCheck(matrix, 'right', i, j, col, row, wallCheck);
    
                        let offset = createVector(
                            -this.cellSize / 2,
                            this.cellSize / 2,
                        );
    
                        let p1 = p5.Vector.add(pos, offset);
                        offset.x *= -1
                        offset.x += (endJ - j) * this.cellSize;
                        let p2 = p5.Vector.add(pos, offset);
    
                        this.walls.push(new Wall(
                            p1,
                            p2,
                        ));
                    }
                    else{
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
        }
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