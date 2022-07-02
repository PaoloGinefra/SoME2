class NonPerfectMazeGenerator{
    //The directions of [N, E, S, W]
    static imageDir = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    /**
     * This Class generates a non perfect maze given the parameters.
     * To generate the maze call this.generateMaze()
     * An Image rappresentation of the maze in stored in this.image.
     * @param {*} m the # of columns
     * @param {*} n the # of rows
     * @param {*} seed the seed of the maze
     * @param {*} ph the percentage of horizontal walls, 0 -> all horizontal 1 -> all vertical
     * @param {*} pc the percentage of cycles, 0 -> no Cycles 1 -> all the cycles
     */
    constructor(m, n, seed = 0, ph = 0.5, pc = 0.1){
        this.m = m;
        this.n = n;
        this.ph = ph;
        this.pc = pc;
        this.seed = seed;
        this.rng = new RNG(seed);

        /**
         * The graph is the graph rappresentation of the maze, containing whether
         * there is a wall facing NESW for every cell
         * graph = [[[N, E, S, W], ...],
         *          [[N, E, S, W], ...],
         *          ...
         *         ]
         */
        this.graph = this.populateMatrix(m, n, (i, j) => [1, 1, 1, 1]);

        /**
         * The image is a bitmap rappresentation of the maze composed of rooms, pillars, rooms and gateways
         * 0 = wall or pillar, 1 = rooms and gateways
         */
        this.image = this.populateMatrix(2*m + 1, 2*n + 1, (i, j) => (i % 2)*(j % 2));

        this.updateImage();
    }

    /**
     * Creates and populate a matrix
     * @param {*} col # of colomns
     * @param {*} row # of rows
     * @param {*} value (i, j) => value in every cell
     * @returns Tha matrix filled
     */
    populateMatrix(col, row, value){
        let matrix = [];
        for(let i = 0; i < col; i++){
            matrix.push([]);
            for(let j = 0; j < row; j++){
                matrix[i].push(value(i, j));
            }
        }
        return matrix
    }

    /**
     * Updates this.image using this.graph
     */
    updateImage(){
        //Image reset
        this.image = this.populateMatrix(2*this.m + 1, 2*this.n + 1, (i, j) => (i % 2)*(j % 2));

        //Image Update
        for(let i = 0; i < this.m; i++){
            for(let j = 0; j < this.n; j++){
                this.graph[i][j].slice(0, 2).forEach((val, index) => {
                    let dir = NonPerfectMazeGenerator.imageDir[index];
                    this.image[2*i+1 + dir[0]][2*j+1 + dir[1]] = Number(!val);
                });
            }
        }
    }

    /**
     * An helper function to print a matrix in the console
     * @param {*} matrix 
     */
    printMatrix(matrix){
        for(let i = this.m - 1; i >= 0; i--){
            console.log(matrix[i]);
        }
    }

    /**
     * A maze generated using a modified Kruskal algorithm. The algorithm is explain in details here: https://www.researchgate.net/publication/350489871_Non-perfect_maze_generation_using_Kruskal_algorithm
     */
    generateMaze(){
        let m = this.m; let n = this.n;

        //# of added edges to the spanning tree
        let k = ceil(this.pc*(m*n-m-n+1));

        //total # of active walls
        let wa = m*n-m-n-k+1;

        //total # of horizontal active walls
        let thw = ceil(this.ph*wa);

        //total # of vertical active walls
        let tvw = wa-thw;

        //total # of horizontal edges of the gragh
        let the = (n-1)*m - tvw;

        //total # of vertical edges of the gragh
        let tve = (m-1)*n - thw;

        //number of horizontal edges added
        this.ch = 0;

        //number of vertical edges added
        this.cv = 0;

        //Rng reset
        this.rng = new RNG(this.seed);

        //Graph reset
        this.graph = this.populateMatrix(m, n, (i, j) => [1, 1, 1, 1]);

        //Every node has a set id initialized at -1
        this.sets = []
        for(let i = 0; i < this.m; i++){
            this.sets.push([])
            for(let j = 0; j < this.n; j++){
                this.sets[i].push(-1);
            }
        }

        //the next setID
        this.setID = 0;

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
        for(let i = 0; i < this.m; i++){
            for(let j = 0; j < this.n; j++){
                this.graph[i][j].slice(0,2).forEach((val, index) => {
                    if(!(i == this.m - 1 && index == 0) && !(j == this.n - 1 && index == 1) &&
                       !(i == 0 && index == 2) && !(j == 0 && index == 3)){
                        let edge = {};
                        edge.i = i; edge.j = j; edge.index = index;
                        this.Edges.push(edge);
                    }
                });
            }
        }

        //Adds the required edge in order to ensure a connected graph
        this.addRequiredEdges(the, tve);
        
        //Randomly shuffles the edges list
        this.Edges = this.Edges.sort(() => {
            return this.rng.nextFloat() > 0.5 ? 1 : -1
          })

        //A copy is necessary because the list is modified throught the loop 
        let EdgeCopy = this.Edges.slice();
        EdgeCopy.forEach(edge => {
            //The edge direction
            let dir = NonPerfectMazeGenerator.imageDir[edge.index];

            //The landing node coordinates as grid index
            let k = edge.i + dir[0];
            let l = edge.j + dir[1];

            //The set ids od the origin and landing nodes
            let u = this.sets[edge.i][edge.j];
            let v = this.sets[k][l];

            //Checks if the nodes belongs to different sets or are both setless
            if(u != v || (u == -1)){
                //Tries to add an endge
                this.checkEdge(edge, k, l, the, tve);
            }
        });

        EdgeCopy = this.Edges.slice();
        EdgeCopy.forEach(edge => {
            let dir = NonPerfectMazeGenerator.imageDir[edge.index];
            let k = edge.i + dir[0];
            let l = edge.j + dir[1];
            this.checkEdge(edge, k, l, the, tve);
        });

        this.updateImage();
    }

    /**
     * Updates the sets when a new edge is built
     * @param {*} i origin node i
     * @param {*} j origin node j
     * @param {*} k landing node i
     * @param {*} l landing node j
     */
    union(i, j, k, l){
        //Checks if the origin node's set is uninitialized
        if(this.sets[i][j] == -1){
            //Initialize the origin node's set
            this.sets[i][j] = this.setID;
            this.setID ++;
        }

        //Checks if the landing node's set is not uninitialized
        if(this.sets[k][l] != -1){
            //Replaces all the old set with the new set by replacing all the matching ids in this.sets
            let old = min(this.sets[k][l], this.sets[i][j]);
            let New = max(this.sets[k][l], this.sets[i][j]);
            
            for(let a = 0; a < this.m; a++){
                for(let b = 0; b < this.n; b++){
                    if(this.sets[a][b] == old){
                        this.sets[a][b] = New
                    }
                }
            }
        }
        else{
            this.sets[k][l] = this.sets[i][j];
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
    checkEdge(edge, k, l, the, tve){
        //Checks if the edge is orizontal and if there are horizontal edges left to draw
        if(edge.index % 2 && this.ch < the){
            //Builds the edge
            this.graph[edge.i][edge.j][edge.index] = 0;

            //Updates the sets
            this.union(edge.i, edge.j, k, l);

            //Removes the edge from the edge list
            this.Edges = this.Edges.filter(e => e.i != edge.i || e.j != edge.j || e.index != edge.index);

            this.ch ++;
        }

        //Checks if the edge is vertical and if there are vertical edges left to draw
        if(!(edge.index % 2) && this.cv < tve){
            //Builds the edge
            this.graph[edge.i][edge.j][edge.index] = 0;

            //Updates the sets
            this.union(edge.i, edge.j, k, l);

            //Removes the edge from the edge list
            this.Edges = this.Edges.filter(e => e.i != edge.i || e.j != edge.j || e.index != edge.index);

            this.cv ++;
        }
    }

    /**
     * In order to ensure a connected graph, and thus a maze without
     * inaccessible parts, a random horizontal(vertical) connection
     * is made for every column(row)
     * @param {*} the total # of horizontal edges
     * @param {*} tve total # of vertical edges
     */
    addRequiredEdges(the, tve){
        for(let m = 0; m < this.m - 1; m++){
            let n = floor(this.rng.nextFloat() * this.n);

            let edge = {};
            edge.i = m; edge.j = n; edge.index = 0;
            
            //The edge direction
            let dir = NonPerfectMazeGenerator.imageDir[edge.index];

            //landing node coordinates as a grid index
            let k = edge.i + dir[0];
            let l = edge.j + dir[1];
            this.checkEdge(edge, k, l, the, tve);
        }

        for(let n = 0; n < this.n - 1; n++){
            let m = floor(this.rng.nextFloat() * this.m);

            let edge = {};
            edge.i = m; edge.j = n; edge.index = 1;

            //The edge direction
            let dir = NonPerfectMazeGenerator.imageDir[edge.index];
            
            //landing node coordinates as a grid index
            let k = edge.i + dir[0];
            let l = edge.j + dir[1];

            this.checkEdge(edge, k, l, the, tve);
        }
    }

    draw(size = 1, Colors = ['black', 'white']){
        noStroke();
        let matrix = this.image
        let cellSize = size / matrix.length;
        let wGS = World.w2s(cellSize);
        rectMode(CORNER);
        for(let i = 0; i < matrix.length; i++){
            for(let j = 0; j < matrix[i].length; j++){
                let pos = World.w2s(createVector(j*cellSize - size/2, i*cellSize - (size - 0.25)/2));
                fill(Colors[matrix[i][j]]);
                square(pos.x, pos.y, wGS);
            }
        }
    }
}