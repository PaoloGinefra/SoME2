class NonPerfectMazeGenerator {
  //The directions of [N, E, S, W]
  static imageDir = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ]

  /**
   * This Class generates a non perfect maze given the parameters.
   * To generate the maze call this.generateMaze()
   * An Image rappresentation of the maze in stored in this.image.
   * @param {*} m the # of columns
   * @param {*} n the # of rows
   * @param {*} seed the seed of the maze
   * @param {*} ph the percentage of horizontal walls, 0 -> all horizontal 1 -> all vertical
   * @param {*} pc the percentage of cycles, 0 -> no Cycles 1 -> all the cycles
   * @param {*} size the size of the maze in wu
   */
  constructor(m, n, seed = 0, ph = 0.5, pc = 0.1, size = 1) {
    this.m = m
    this.n = n
    this.ph = ph
    this.pc = pc
    this.seed = seed
    this.rng = new RNG(seed)
    this.size = size
    this.cellSize = size / m

    this.shovelSprite = loadImage('../Art/ShovelIcon.png')
    this.brickSprite = loadImage('../Art/BrickIcon.png')

    this.bgSprite = loadImage('../Art/GroundBgTile.png')
    this.ladderSprite = loadImage('../Art/LadderTile.png')
    this.exitSprite = loadImage('../Art/ExitTile.png')
    /**
     * The graph is the graph rappresentation of the maze, containing whether
     * there is a wall facing NESW for every cell
     * graph = [[[N, E, S, W], ...],
     *          [[N, E, S, W], ...],
     *          ...
     *         ]
     */
    this.graph = this.populateMatrix(m, n, (i, j) => [1, 1, 1, 1])

    /**
     * The image is a bitmap rappresentation of the maze composed of rooms, pillars, rooms and gateways
     * 0 = wall or pillar, 1 = rooms and gateways
     */
    this.image = this.populateMatrix(
      2 * m + 1,
      2 * n + 1,
      (i, j) => (i % 2) * (j % 2)
    )

    this.updateImage()
  }

  /**
   * Creates and populate a matrix
   * @param {*} col # of colomns
   * @param {*} row # of rows
   * @param {*} value (i, j) => value in every cell
   * @returns Tha matrix filled
   */
  populateMatrix(col, row, value) {
    let matrix = []
    for (let i = 0; i < col; i++) {
      matrix.push([])
      for (let j = 0; j < row; j++) {
        matrix[i].push(value(i, j))
      }
    }
    return matrix
  }

  /**
   * @returns the image index of a graph cell at (i, j)
   */
  g2i(i, j) {
    return [2 * i + 1, 2 * j + 1]
  }

  /**
   * Updates this.image using this.graph
   */
  updateImage() {
    //Image reset
    this.image = this.populateMatrix(
      2 * this.m + 1,
      2 * this.n + 1,
      (i, j) => (i % 2) * (j % 2)
    )

    //Image Update
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        this.graph[i][j].slice(0, 2).forEach((val, index) => {
          let dir = NonPerfectMazeGenerator.imageDir[index]
          this.image[2 * i + 1 + dir[0]][2 * j + 1 + dir[1]] = Number(!val)
        })
      }
    }

    this.cellSize = this.size / this.image.length
  }

  getImage() {
    return Array.from(this.image, (row) =>
      Array.from(row, (e) => Number(e != 0))
    )
  }

  /**
   * An helper function to print a matrix in the console
   * @param {*} matrix
   */
  printMatrix(matrix) {
    for (let i = this.m - 1; i >= 0; i--) {
      console.log(matrix[i])
    }
  }

  /**
   * A maze generated using a modified Kruskal algorithm. The algorithm is explain in details here: https://www.researchgate.net/publication/350489871_Non-perfect_maze_generation_using_Kruskal_algorithm
   */
  generateMaze() {
    let m = this.m
    let n = this.n

    //# of added edges to the spanning tree
    let k = ceil(this.pc * (m * n - m - n + 1))

    //total # of active walls
    let wa = m * n - m - n - k + 1

    //total # of horizontal active walls
    let thw = ceil(this.ph * wa)

    //total # of vertical active walls
    let tvw = wa - thw

    //total # of horizontal edges of the gragh
    let the = (n - 1) * m - tvw

    //total # of vertical edges of the gragh
    let tve = (m - 1) * n - thw

    //number of horizontal edges added
    this.ch = 0

    //number of vertical edges added
    this.cv = 0

    //Rng reset
    this.rng = new RNG(this.seed)

    //Graph reset
    this.graph = this.populateMatrix(m, n, (i, j) => [1, 1, 1, 1])

    //Every node has a set id initialized at -1
    this.sets = []
    for (let i = 0; i < this.m; i++) {
      this.sets.push([])
      for (let j = 0; j < this.n; j++) {
        this.sets[i].push(-1)
      }
    }

    //the next setID
    this.setID = 0

    /**
     * Initializing a list of all the .
     * An edge is stored as
     * edge = {
     *          i : the i index of the origin in this.graph,
     *          j : the j index of the origin in this.graph,
     *          index : the index of the direction the edge it's going towards
     * }
     */
    //
    this.Edges = []
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        this.graph[i][j].slice(0, 2).forEach((val, index) => {
          if (
            !(i == this.m - 1 && index == 0) &&
            !(j == this.n - 1 && index == 1) &&
            !(i == 0 && index == 2) &&
            !(j == 0 && index == 3)
          ) {
            let edge = {}
            edge.i = i
            edge.j = j
            edge.index = index
            this.Edges.push(edge)
          }
        })
      }
    }

    //Adds the required edge in order to ensure a connected graph
    this.addRequiredEdges(the, tve)

    //Randomly shuffles the edges list
    this.Edges = this.Edges.sort(() => {
      return this.rng.nextFloat() > 0.5 ? 1 : -1
    })

    //A copy is necessary because the list is modified throught the loop
    let EdgeCopy = this.Edges.slice()
    EdgeCopy.forEach((edge) => {
      //The edge direction
      let dir = NonPerfectMazeGenerator.imageDir[edge.index]

      //The landing node coordinates as grid index
      let k = edge.i + dir[0]
      let l = edge.j + dir[1]

      //The set ids od the origin and landing nodes
      let u = this.sets[edge.i][edge.j]
      let v = this.sets[k][l]

      //Checks if the nodes belongs to different sets or are both setless
      if (u != v || u == -1) {
        //Tries to add an endge
        this.checkEdge(edge, k, l, the, tve)
      }
    })

    EdgeCopy = this.Edges.slice()
    EdgeCopy.forEach((edge) => {
      let dir = NonPerfectMazeGenerator.imageDir[edge.index]
      let k = edge.i + dir[0]
      let l = edge.j + dir[1]
      this.checkEdge(edge, k, l, the, tve)
    })

    this.updateImage()
  }

  /**
   * Updates the sets when a new edge is built
   * @param {*} i origin node i
   * @param {*} j origin node j
   * @param {*} k landing node i
   * @param {*} l landing node j
   */
  union(i, j, k, l) {
    //Checks if the origin node's set is uninitialized
    if (this.sets[i][j] == -1) {
      //Initialize the origin node's set
      this.sets[i][j] = this.setID
      this.setID++
    }

    //Checks if the landing node's set is not uninitialized
    if (this.sets[k][l] != -1) {
      //Replaces all the old set with the new set by replacing all the matching ids in this.sets
      let old = min(this.sets[k][l], this.sets[i][j])
      let New = max(this.sets[k][l], this.sets[i][j])

      for (let a = 0; a < this.m; a++) {
        for (let b = 0; b < this.n; b++) {
          if (this.sets[a][b] == old) {
            this.sets[a][b] = New
          }
        }
      }
    } else {
      this.sets[k][l] = this.sets[i][j]
    }
  }

  /**
   * Main function for adding new edges
   * @param {*} edge the origin node
   * @param {*} k i of the landing node
   * @param {*} l j of the landing node
   * @param {*} the total # of horizontal edges
   * @param {*} tve total # of vertical edges
   */
  checkEdge(edge, k, l, the, tve) {
    //Checks if the edge is orizontal and if there are horizontal edges left to draw
    if (edge.index % 2 && this.ch < the) {
      //Builds the edge both ways
      this.graph[edge.i][edge.j][edge.index] = 0
      this.graph[k][l][(edge.index + 2) % 4] = 0

      //Updates the sets
      this.union(edge.i, edge.j, k, l)

      //Removes the edge from the edge list
      this.Edges = this.Edges.filter(
        (e) => e.i != edge.i || e.j != edge.j || e.index != edge.index
      )

      this.ch++
    }

    //Checks if the edge is vertical and if there are vertical edges left to draw
    if (!(edge.index % 2) && this.cv < tve) {
      //Builds the edge both ways
      this.graph[edge.i][edge.j][edge.index] = 0
      this.graph[k][l][(edge.index + 2) % 4] = 0

      //Updates the sets
      this.union(edge.i, edge.j, k, l)

      //Removes the edge from the edge list
      this.Edges = this.Edges.filter(
        (e) => e.i != edge.i || e.j != edge.j || e.index != edge.index
      )

      this.cv++
    }
  }

  /**
   * In order to ensure a connected graph, and thus a maze without
   * inaccessible parts, a random horizontal(vertical) connection
   * is made for every column(row)
   * @param {*} the total # of horizontal edges
   * @param {*} tve total # of vertical edges
   */
  addRequiredEdges(the, tve) {
    for (let m = 0; m < this.m - 1; m++) {
      let n = floor(this.rng.nextFloat() * this.n)

      let edge = {}
      edge.i = m
      edge.j = n
      edge.index = 0

      //The edge direction
      let dir = NonPerfectMazeGenerator.imageDir[edge.index]

      //landing node coordinates as a grid index
      let k = edge.i + dir[0]
      let l = edge.j + dir[1]
      this.checkEdge(edge, k, l, the, tve)
    }

    for (let n = 0; n < this.n - 1; n++) {
      let m = floor(this.rng.nextFloat() * this.m)

      let edge = {}
      edge.i = m
      edge.j = n
      edge.index = 1

      //The edge direction
      let dir = NonPerfectMazeGenerator.imageDir[edge.index]

      //landing node coordinates as a grid index
      let k = edge.i + dir[0]
      let l = edge.j + dir[1]

      this.checkEdge(edge, k, l, the, tve)
    }
  }

  /**
   * @returns the world position of the cell at (i, j)
   */
  getCellwp(i, j) {
    let matrix = this.image
    let cellSize = this.size / matrix.length
    return createVector(
      (j + 0.5) * cellSize - this.size / 2,
      (i + 0.5) * cellSize - this.size / 2
    )
  }

  /**
     * Draws the maze
z     * @param {*} Colors The colors list [fullCell, emptyCell, state, mapState]
     */
  draw(
    drawNumbers = true,
    offset = undefined,
    scale = 1,
    Colors = ['black', 'white', 'purple', 'orange']
  ) {
    offset = offset ? offset : createVector(0, 0)
    noStroke()
    let matrix = this.image
    let cellSize = this.size / matrix.length
    this.cellSize = cellSize
    let wGS = World.w2s(cellSize) * scale
    let stateId = 0
    let stateMap = 0
    rectMode(CENTER)
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        let pos = World.w2s(
          p5.Vector.mult(this.getCellwp(i, j), scale).add(offset)
        )
        fill(0)

        if (matrix[i][j] != 0) {
          noSmooth()
          imageMode(CENTER)
          image(this.bgSprite, pos.x, pos.y, wGS, wGS)
          smooth()
        } else square(pos.x, pos.y, wGS)

        if (matrix[i][j] > 1) {
          let height = World.w2s((cellSize / 2) * scale)
          fill(255)
          textSize(height)
          textAlign(CENTER, TOP)

          if (drawNumbers && matrix[i][j] == 2) {
            //ellipse(pos.x, pos.y, World.w2s(this.cellSize - 0.02))
            fill(255)
            blendMode(SOFT_LIGHT)
            text(stateId.toString(), pos.x, pos.y - height / 2)
            blendMode(BLEND)
            stateId++
          }
          if (matrix[i][j] == 4) {
            noSmooth()
            imageMode(CENTER)
            blendMode(SOFT_LIGHT)
            image(this.exitSprite, pos.x, pos.y, wGS, wGS)
            blendMode(BLEND)
            smooth()
          }
          //text(stateMap.toString(), pos.x, pos.y - height);
          stateMap++
        }

        if (
          matrix[i][j] != 0 &&
          matrix[i][j] != 4 &&
          ((i > 0 && matrix[i - 1][j] != 0) ||
            (i < matrix.length - 1 && matrix[i + 1][j] != 0))
        ) {
          noSmooth()
          image(this.ladderSprite, pos.x, pos.y, wGS, wGS)
          smooth()
        }
      }
    }
  }

  /**
   * @returns whether the node in position (i, j) is a State
   */
  isState(i, j, graph = this.graph) {
    let n = NonPerfectMazeGenerator.count(graph[i][j], 0)
    return n >= 3
  }

  /**
   * @returns whether the node in position (i, j) is a MapState
   */
  isMapState(i, j, graph = this.graph) {
    let n = NonPerfectMazeGenerator.count(graph[i][j], 0)
    return n >= 3 || !NonPerfectMazeGenerator.isStraight(i, j, graph) || n <= 1
  }

  /**
   * @returns the # of times value is in array
   */
  static count(array, value) {
    let count = 0
    array.forEach((e) => {
      count += e === value
    })
    return count
  }

  /**
   * @returns Whether a cell has just two gates wich are also alligned
   */
  static isStraight(i, j, graph = this.graph) {
    let node = graph[i][j]
    let n = NonPerfectMazeGenerator.count(node, 0)
    return (n == 2 && node[0] == node[2]) || n == 1
  }

  /**
   * @param {*} state The cell position
   * @param {*} dir The direction index [N, E, S, W]
   * @returns The neighbour of a cell given the direction
   */
  getNeighbour(state, dir) {
    let [i, j] = state
    let [dirI, dirJ] = NonPerfectMazeGenerator.imageDir[dir]
    let neiState = [i + dirI, j + dirJ]
    return [neiState, this.graph[i + dirI][j + dirJ]]
  }

  /**
   * Goes thru the maze starting from state twards dir, return the first valid state encountered.
   * If a dead end is found it returns the starting state itself
   * @param {*} state The starting state position [i, j]
   * @param {*} stateId The index of the starting state in the states list
   * @param {*} dir The dir index
   * @param {*} States The States list
   * @param {*} isState A function (i, j, graph) => isAValidState
   * @returns The found state position?s index
   */
  getNeiState(state, stateId, dir, States, isState) {
    //Gets the neighbour
    let [neiState, neiNode] = this.getNeighbour(state, dir)
    let [neiI, neiJ] = neiState

    //immediately found a state
    if (isState(neiI, neiJ, this.graph)) {
      return States.findIndex((s) => s[0] == neiI && s[1] == neiJ)
    } else {
      //The number of directions without walls
      let n = NonPerfectMazeGenerator.count(neiNode, 0)

      //DeadEnd
      if (n == 1) {
        return stateId
      }
      //Road
      //Keeps going thru the maze until a valid state is found
      let outDirIndex = neiNode.findIndex(
        (w, index) => !w && index != (dir + 2) % 4
      )
      let [nextState, nextNode] = this.getNeighbour(neiState, outDirIndex)
      let [nextI, nextJ] = nextState

      while (!isState(nextI, nextJ, this.graph)) {
        let n = NonPerfectMazeGenerator.count(nextNode, 0)
        if (n == 1) return stateId

        ;[neiState, neiNode] = [nextState.slice(), nextNode.slice()]
        outDirIndex = neiNode.findIndex(
          (w, index) => !w && index != (outDirIndex + 2) % 4
        )
        let temp = this.getNeighbour(neiState, outDirIndex)
        nextState = temp[0]
        nextNode = temp[1]
        ;[nextI, nextJ] = nextState
      }

      return States.findIndex((s) => s[0] == nextI && s[1] == nextJ)
    }
  }

  /**
   * Returns the first connected states to the starting states in the four directions.
   * If a dead end is found the starting state is returned
   * @param {*} state The starting state's coordinates [i, j]
   * @param {*} stateId The index of the starting state in the states list
   * @param {*} States The list of all the states
   * @param {*} isState A function (i, j, graph) => isAValidState
   * @returns A list with the indicies of the found states
   */
  stateNeighbours(state, stateId, States, isState) {
    let [i, j] = state
    let node = this.graph[i][j]
    let neighbours = []

    node.forEach((isWall, d) => {
      if (!isWall) {
        neighbours.push(this.getNeiState(state, stateId, d, States, isState))
      } else {
        neighbours.push(stateId)
      }
    })

    return neighbours
  }

  /**
   * Builds the Automata
   * this.Automaton => the automaton between the proper states
   * this.MapAutomaton => the automaton between the map state
   * A proper state is a cell with less then 2 walls
   * A mapState is either a proper state or a corner as of a cell with just two adjacent walls
   */
  buildAutomata() {
    //Compute a list of states, where a state is a node with 3 or more exits
    //A state is [i, j] as of the graph index of the node
    this.States = []
    this.mapStates = []
    this.roomStates = []
    this.state2mapState = {}
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.isState(i, j, this.graph)) {
          this.state2mapState[this.States.length] = this.mapStates.length
          this.States.push([i, j])
          this.mapStates.push([i, j])
          let [k, l] = this.g2i(i, j)
          this.image[k][l] = 2
        } else if (this.isMapState(i, j, this.graph)) {
          this.mapStates.push([i, j])
          let [k, l] = this.g2i(i, j)
          this.image[k][l] = 3
        }
      }
    }

    this.Nodes = this.States.map((s) =>
      this.getCellwp(2 * s[0] + 1, 2 * s[1] + 1)
    )
    this.mapNodes = this.mapStates.map((s) =>
      this.getCellwp(2 * s[0] + 1, 2 * s[1] + 1)
    )

    this.roomNodes = []
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        this.roomStates.push([i, j])
        this.roomNodes.push(this.getCellwp(2 * i + 1, 2 * j + 1))
      }
    }

    //For each state find the neighbours and but them in the automaton
    this.Automaton = []
    this.States.forEach((state, stateId) => {
      this.Automaton.push(
        this.stateNeighbours(state, stateId, this.States, this.isState)
      )
    })

    this.MapAutomaton = []
    this.mapStates.forEach((state, stateId) => {
      this.MapAutomaton.push(
        this.stateNeighbours(state, stateId, this.mapStates, this.isMapState)
      )
    })

    this.RoomAutomaton = []
    this.roomStates.forEach((state, stateId) => {
      this.RoomAutomaton.push(
        this.stateNeighbours(state, stateId, this.roomStates, () => true)
      )
    })

    //Carve out exit
    let [ei, ej] = this.States[this.States.length - 1]
    this.image[2 * ei + 2][2 * ej + 1] = 4
  }

  /**
   * @param {*} pos a P5 vector in wu
   * @returns The index in image of pos
   */
  getCellIndex(pos) {
    return [
      floor((pos.y + this.size / 2 + this.cellSize / 2) / this.cellSize - 0.5),
      floor((pos.x + this.size / 2 + this.cellSize / 2) / this.cellSize - 0.5),
    ]
  }

  /**
   * @returns Whether the index is in this.graph
   */
  isIn(i, j) {
    return i >= 0 && i < this.graph.length && j >= 0 && j < this.graph[0].length
  }

  /**
   * @returns whether the index points to a wall/path
   */
  isEditable(i, j, tool) {
    return (
      i >= 1 &&
      i < this.image.length - 1 &&
      j >= 1 &&
      j < this.image[0].length - 1 &&
      i % 2 ^ j % 2 &&
      this.image[i][j] != tool
    )
  }

  /**
   * @returns whether the cell is an horizontal path
   */
  isHor(i, j) {
    return i % 2 && !(j % 2)
  }

  /**
   * @returns whether the cell is a vertical path
   */
  isVer(i, j) {
    return !(i % 2) && j % 2
  }

  /**
   * Performs a depth first search in the Map Automaton and upates check with the nodes encountered
   * @param {*} check A bool array
   * @param {*} state The starting state
   */
  dfs(check, state) {
    check[state] = true
    for (let m = 0; m < 4; m++) {
      let newState = this.MapAutomaton[state][m]
      if (!check[newState]) this.dfs(check, newState)
    }
  }

  /**
   * @returns Whether the map automaton is connected
   */
  isConnectedAutomaton() {
    let check = []
    this.MapAutomaton.forEach((g) => check.push(false))
    this.dfs(check, 0)

    return !check.some((e) => !e)
  }

  /**
   * Uses the tool in the desired spot, remove/put the wall
   */
  move(i, j, k, l, wall, tool) {
    if (this.isIn(i, j)) this.graph[i][j][wall] = Number(!tool)
    if (this.isIn(k, l)) this.graph[k][l][wall + 2] = Number(!tool)
    this.updateImage()
  }

  /**
   * The fuction to be called for tool using
   * @param {*} pos The mouse position
   * @param {*} tool 0 => Wall Brush, 1 => Wall Ereaser
   * @returns whether some chenges are made
   */
  brush(pos, tool = 0) {
    let [I, J] = this.getCellIndex(pos)

    if (!this.isEditable(I, J, tool)) {
      return false
    }

    if (this.isHor(I, J)) {
      let [i, j] = [(I - 1) / 2, (J - 2) / 2]
      this.move(i, j, i, j + 1, 1, tool)
      this.buildAutomata()

      if (!this.isConnectedAutomaton()) {
        this.move(i, j, i, j + 1, 1, !tool)
        this.buildAutomata()
      }
    } else if (this.isVer(I, J)) {
      let [i, j] = [(I - 2) / 2, (J - 1) / 2]
      this.move(i, j, i + 1, j, 0, tool)
      this.buildAutomata()

      if (!this.isConnectedAutomaton()) {
        this.move(i, j, i + 1, j, 0, !tool)
        this.buildAutomata()
      }
    }
    return true
  }

  /**
   * Draws the brush preview
   * @param {*} pos
   * @param {*} tool
   */
  drawBrush(pos, tool = 0) {
    let [I, J] = this.getCellIndex(pos)
    pos.x = floor((pos.x + this.cellSize / 2) / this.cellSize) * this.cellSize
    pos.y = floor((pos.y + this.cellSize / 2) / this.cellSize) * this.cellSize
    pos = World.w2s(pos)
    let size = World.w2s(this.cellSize)

    if (tool > 1 || !this.isEditable(I, J, tool)) {
      return
    }

    let sprite

    imageMode(CENTER)
    if (!tool) {
      fill(0, 120)
      sprite = this.brickSprite
      square(pos.x, pos.y, size)
    } else {
      tint(255, 0, 0, 200)
      sprite = this.shovelSprite
      noSmooth()
      image(this.bgSprite, pos.x, pos.y, size, size)
      smooth()
      tint(255)
    }

    noSmooth()
    image(sprite, pos.x, pos.y, size, size)
    smooth()
  }
}
