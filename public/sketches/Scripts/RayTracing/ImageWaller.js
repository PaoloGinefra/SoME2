class ImageWaller {
  /**
   * This obj can generate the walls for a givven binary matrix
   * @param {*} size The size of the image in wu
   */
  constructor(size = 1) {
    this.size = size
    this.Colors = [color('black'), color(255, 120)]
    this.walls = []
  }

  /**
   * Whether the indexes are in the matrix
   * @param {*} col # of columns
   * @param {*} row # of rows
   * @param {*} i
   * @param {*} j
   * @returns Bool
   */
  isIn(i, j) {
    return i >= 0 && i < this.col && j >= 0 && j < this.row
  }

  /**
   * Checks whether a wall sould be drawn between (i, j) an (k, l)
   */
  isWall(i, j, k, l, matrix) {
    return !this.isIn(k, l) || matrix[i][j] != matrix[k][l]
  }

  indexToPos(i, j) {
    return createVector(
      j * this.cellSize - this.size / 2,
      (i + 1) * this.cellSize - this.size / 2
    )
  }

  checkNeighbour(index, i, j, k, l, wi, wj, wk, wl, matrix, wallMatrix) {
    let wall

    if (
      this.isIn(k, l) &&
      wallMatrix[k][l][index] != undefined &&
      !this.isWall(i, j, k, l, matrix)
    ) {
      wall = wallMatrix[k][l][index]
      wall.p2.add(createVector(j - l, i - k).mult(this.cellSize))
    } else {
      wall = new Wall(this.indexToPos(wi, wj), this.indexToPos(wk, wl))
      this.walls.push(wall)
    }
    wallMatrix[i][j][index] = wall
  }

  createWalls(matrix) {
    // Up, Right, Down, Left
    this.col = matrix.length
    this.row = matrix[0].length
    this.cellSize = this.size / matrix.length
    this.walls = []

    let wallMatrix = []
    for (let i = 0; i < this.col; i++) {
      wallMatrix.push([])
      for (let j = 0; j < this.row; j++) {
        wallMatrix[i].push([])
      }
    }

    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.row; j++) {
        let right = this.isWall(i, j, i, j + 1, matrix)
        let up = this.isWall(i, j, i + 1, j, matrix)

        if (up) {
          this.checkNeighbour(
            0,
            i,
            j,
            i,
            j - 1,
            i,
            j,
            i,
            j + 1,
            matrix,
            wallMatrix
          )
        }

        if (right) {
          this.checkNeighbour(
            1,
            i,
            j,
            i - 1,
            j,
            i - 1,
            j + 1,
            i,
            j + 1,
            matrix,
            wallMatrix
          )
        }

        if (!this.isIn(i - 1, j)) {
          let wall
          if (
            this.isIn(i, j - 1) &&
            wallMatrix[i][j - 1][2] != undefined &&
            !this.isWall(i, j, i, j - 1, matrix)
          ) {
            wall = wallMatrix[i][j - 1][2]
            wall.p2.add(createVector(this.cellSize, 0))
          } else {
            wall = new Wall(
              this.indexToPos(i - 1, j),
              this.indexToPos(i - 1, j + 1)
            )
            this.walls.push(wall)
          }
          wallMatrix[i][j][2] = wall
        }

        if (!this.isIn(i, j - 1)) {
          let wall
          if (
            this.isIn(i - 1, j) &&
            wallMatrix[i - 1][j][3] != undefined &&
            !this.isWall(i, j, i - 1, j, matrix)
          ) {
            wall = wallMatrix[i - 1][j][3]
            wall.p2.add(createVector(0, this.cellSize))
          } else {
            wall = new Wall(this.indexToPos(i - 1, j), this.indexToPos(i, j))
            this.walls.push(wall)
          }
          wallMatrix[i][j][3] = wall
        }
      }
    }
  }

  /**
   * Draws the matrix [Surprising isn't it]
   * @param {*} matrix
   */
  drawMatrix(matrix) {
    this.cellSize = this.size / matrix.length
    let wGS = World.w2s(this.cellSize)
    rectMode(CORNER)
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        let pos = World.w2s(
          createVector(
            j * this.cellSize - this.size / 2,
            i * this.cellSize - this.size / 2
          )
        )
        fill(this.Colors[matrix[i][j]])
        square(pos.x, pos.y, wGS)
      }
    }
  }
}
