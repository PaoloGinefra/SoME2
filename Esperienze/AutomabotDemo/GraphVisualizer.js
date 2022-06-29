  class GraphVisualizer{
    /** This Graph visualizer uses an Eades Spring Embedder to beautifully
    visualize a given graph. All you need to do is feeding the graph to
    the obj, tweek the parameters and call the setup function.
    Finally to draw the graph simply call the drawGraph function. Enjoy :)

    * @param graph The graph to visualize
    * @param size The size of the nodes in wu
    * @param colors An array containing the colors for each link in alphabetical order
    * @param tLength The target length of the links in wu
    * @param cRep The repulsion constant. default 0.2
    * @param cSpring The spring constant. default 0.1
    * @param sigma A damping factor for the forces apllied, it's a scalar multiplied by the forces. default 0.1
    * @param epsilon The biggest Force considered to be irrelevant
    * @param gridLen The length of the initial disposition grid
    */

    constructor(graph = undefined, size = 0.3, tLength = 0.02, sigma = 0.1, cRep = 0.2, cSpr = 0.1, epsilon = 0.01, gridLen= 2){
        this.graph = graph;
        this.size = size;
        this.tLength = tLength;
        this.cRep = cRep;
        this.cSpr = cSpr;
        this.sigma = sigma;
        this.epsilon = epsilon;
        this.gridLen = gridLen;

        //The colors of the links by alphabet
        this.colors = [color(255, 204, 0), color(65)]

        this.done = false;
        this.t = 0;
    }

    //This is a setup function for the initial disposition of the nodes
    //This will greatly influence the outcome
    buildNodes(){
        this.n = this.graph.length
        this.Nodes = []
        for(let i = 0; i < this.n; i++){
            this.Nodes.push(createVector(i % this.gridLen, floor(i / this.gridLen)));
        }
    }

    //A function to draw a link to oneself
    drawSelfArc(pos, id = 0, color = 'black', myStroke = 0.01){
        let dif = p5.Vector.sub(pos, this.massCenter).setMag(this.size / 2).rotate(id * 2);
        let center = p5.Vector.add(pos, dif)
        let p = World.w2s(center);
        strokeWeight(myStroke * World.w2s());
        stroke(color)
        fill(0, 0);
        ellipse(p.x, p.y, this.size * World.w2s(), this.size * World.w2s());

        let intersectionOffset = p5.Vector.div(dif, -2).rotate(-PI / 3).setMag(this.size / 2 + 0.01);
        let intersection = p5.Vector.add(center, intersectionOffset);
        drawArrow(intersection, p5.Vector.mult(intersectionOffset, -1).rotate(-PI/1.8).setMag(0.001), color);
        intersection = World.w2s(intersection);
    }

    //This draw nodes [I know, mindblowing]
    drawGraph(){
        this.Nodes.forEach((node, i) => {
            let p = World.w2s(node);
            let id = 0;
            //Draw links
            this.graph[i].forEach((nei, j) => {
                if(i != nei){
                    let neighbour = this.Nodes[nei];

                    let diff = p5.Vector.sub(neighbour, node);
                    let len = diff.mag() - this.size / 2;
                    
                    let localNode = node.copy();
                    if(this.graph[nei].includes(i)){
                        len -= this.size/2;
                        len /= 2;
                        localNode = p5.Vector.lerp(node, this.Nodes[nei], 0.5);
                    }

                    diff.setMag(len - 0.015);
                    drawArrow(localNode, diff, this.colors[j])
                }
                else{
                    this.drawSelfArc(node, id, this.colors[j]);
                    id ++;
                }
            });

            //Draw Node
            stroke('black');
            fill(255);
            strokeWeight(0.01 * World.w2s());
            ellipse(p.x, p.y, this.size * World.w2s())

            fill(0)
            textAlign(CENTER, CENTER);
            textSize(this.size * 0.6 * World.w2s());
            text(i.toString(), p.x, p.y);
        })
    }

    //Compute the repulsive force between two nodes
    fRep(u, v){
        let sub = p5.Vector.sub(u, v);
        sub.mult(this.cRep/(sub.magSq()));
        return sub
    }

    //Compute the atttractive force between two nodes
    fSpring(u, v){
        let sub = p5.Vector.sub(v, u);
        sub.mult(this.cSpr * Math.log(sub.mag()/this.tLength))
        return sub;
    }

    //This is the main function
    orderGraph(){
        while(!this.done){
            let Forces = []
            this.Nodes.forEach((node, i) => {
                Forces[i] = createVector(0, 0);
            });


            this.Nodes.forEach((node, i) => {
                this.Nodes.forEach(otherNode => {
                    if(node != otherNode)
                        Forces[i].add(this.fRep(node, otherNode));
                });

                this.graph[i].forEach(nei => {
                    if(i != nei){
                        let f = this.fSpring(node, this.Nodes[nei]);
                        Forces[i].add(f);
                        Forces[nei].add(p5.Vector.mult(f, -1));
                    }
                })
            })

            this.done = Forces.every(f => f.mag() < this.epsilon)

            //Computes the mass center and translate everything to keep it centered
            this.massCenter = createVector(0, 0);
            this.Nodes.forEach((node, i) => {
                this.Nodes[i].add(Forces[i].mult(this.sigma))
                this.massCenter.add(this.Nodes[i]);
            });
            this.massCenter.div(this.Nodes.length);

            this.Nodes.forEach((node, i) => {
                this.Nodes[i].sub(this.massCenter)
            });
        }
    }

    //This functions setu the visualization
    setup(){
        this.buildNodes();
        this.orderGraph();
    }
}

//Simple arrow drawing function
function drawArrow(base, vec, myColor = 'black', myStroke = 0.01, arrowSize = 0.05) {
    base = World.w2s(base);
    vec.mult(World.w2s());
    vec.y *= -1;
    push();
    stroke(myColor);
    strokeWeight(myStroke * World.w2s());
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    arrowSize *= World.w2s();
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  } 