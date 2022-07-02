class NonPerfectMazeGenerator{
    //0-wall 1-space
    //graph -> [[Up, Right, Down, Left] ...]
    //image [0, 1, 0]

    static imageDir = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    constructor(m, n, ph = 0.5, pc = 0.1){
        this.m = m;
        this.n = n;
        this.ph = ph;
        this.pc = pc;

        this.graph = [];
        for(let i = 0; i < this.m; i++){
            this.graph.push([]);
            for(let j = 0; j < this.n; j++){
                this.graph[i].push([1, 1, 1, 1])
            }
        }

        this.image = [];
        for(let i = 0; i < 2 * this.m + 1; i++){
            this.image.push([]);
            for(let j = 0; j < 2 * this.n + 1; j++){
                let val = (i % 2)*(j % 2);
                this.image[i].push(val);
            }
        }

        this.updateImage()
    }

    updateImage(){
        for(let i = 0; i < this.m; i++){
            for(let j = 0; j < this.n; j++){
                this.graph[i][j].slice(0, 2).forEach((val, index) => {
                    let dir = NonPerfectMazeGenerator.imageDir[index];
                    this.image[2*i+1 + dir[0]][2*j+1 + dir[1]] = Number(!val);
                });
            }
        }
    }

    printMatrix(matrix){
        for(let i = this.m - 1; i >= 0; i--){
            console.log(matrix[i]);
        }
    }

    generateMaze(){
        let m = this.m; let n = this.n;
        let k = ceil(this.pc*(m*n-m-n+1));
        let wa = m*n-m-n-k+1;
        let thw = ceil(this.ph*wa);
        let tvw = wa-thw;
        let the = (n-1)*m - tvw;
        let tve = (m-1)*n - thw;

        this.ch = 0;
        this.cv = 0;

        //Edge = [i, j, index]
        this.sets = []
        this.setIndex = 0;
        for(let i = 0; i < this.m; i++){
            this.sets.push([])
            for(let j = 0; j < this.n; j++){
                this.sets[i].push(-1);
            }
        }


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

        this.addRequiredEdges(the, tve)
        
        this.Edges = this.Edges.sort(() => {
            const randomTrueOrFalse = Math.random() > 0.5;
            return randomTrueOrFalse ? 1 : -1
          })


        let EdgeCopy = this.Edges.slice();
        EdgeCopy.forEach(edge => {
            let dir = NonPerfectMazeGenerator.imageDir[edge.index];

            let k = edge.i + dir[0];
            let l = edge.j + dir[1];

            let u = this.sets[edge.i][edge.j];
            let v = this.sets[k][l];

            if(u != v || (u == -1)){
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


    }

    union(i, j, k, l){
        if(this.sets[i][j] == -1){
            this.sets[i][j] = this.setIndex;
            this.setIndex ++;
        }
        if(this.sets[k][l] != -1){
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

    checkEdge(edge, k, l, the, tve){
        if(edge.index % 2 && this.ch < the){
            this.graph[edge.i][edge.j][edge.index] = 0;
            this.union(edge.i, edge.j, k, l);
            this.ch ++;
            this.Edges = this.Edges.filter(e => e.i != edge.i || e.j != edge.j || e.index != edge.index);
        }
        if(!(edge.index % 2) && this.cv < tve){
            this.graph[edge.i][edge.j][edge.index] = 0;
            this.union(edge.i, edge.j, k, l);
            this.cv ++;
            this.Edges = this.Edges.filter(e => e.i != edge.i || e.j != edge.j || e.index != edge.index);

        }
    }

    addRequiredEdges(the, tve){
        for(let m = 0; m < this.m - 1; m++){
            let n = floor(Math.random() * this.n);
            let edge = {};
            edge.i = m; edge.j = n; edge.index = 0;
            let dir = NonPerfectMazeGenerator.imageDir[edge.index];
            let k = edge.i + dir[0];
            let l = edge.j + dir[1];
            this.checkEdge(edge, k, l, the, tve);
        }

        for(let n = 0; n < this.n - 1; n++){
            let m = floor(Math.random() * this.m);
            let edge = {};
            edge.i = m; edge.j = n; edge.index = 1;
            let dir = NonPerfectMazeGenerator.imageDir[edge.index];
            let k = edge.i + dir[0];
            let l = edge.j + dir[1];
            this.checkEdge(edge, k, l, the, tve);
        }
    }
}