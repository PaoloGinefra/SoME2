class GraphVisualizer {
  static preload() {
    GraphVisualizer.preloadedSprites = []
    for (let i = 0; i < 4; i++)
      GraphVisualizer.preloadedSprites.push(
        loadImage('../Art/BrickOrientations/' + i.toString() + '.png')
      )
  }

  /** This Graph visualizer uses an Eades Spring Embedder to beautifully
    visualize a given graph. All you need to do is feeding the graph to
    the obj, tweek the parameters and call the setup function.
    Finally to draw the graph simply call the drawGraph function. Enjoy :)

    * @param graph The graph to visualize
    * @param center a p5vector containing the center of the graph in wu
    * @param size The size of the rappresentation in wu
    * @param nodeSize The size of the nodes in wu
    * @param colors An array containing the colors for each link in alphabetical order
    * @param tLength The target length of the links in wu
    * @param cRep The repulsion constant. default 0.2
    * @param cSpring The spring constant. default 0.1
    * @param sigma A damping factor for the forces apllied, it's a scalar multiplied by the forces. default 0.1
    * @param epsilon The biggest Force considered to be irrelevant
    * @param gridLen The length of the initial disposition grid
    * @param sprites A list of sprites as p5 loaded images to be drawn instead of numbers
    */

  constructor(
    graph = undefined,
    center,
    colors = [color(255, 204, 0), color(65)],
    size = 1,
    nodeSize = 0.3,
    tLength = 0.02,
    sigma = 0.1,
    cRep = 0.2,
    cSpr = 0.1,
    epsilon = 0.01,
    gridLen = 2,
    sprites = null
  ) {
    this.graph = graph
    this.nodeSize = nodeSize
    this.tLength = tLength
    this.cRep = cRep
    this.cSpr = cSpr
    this.sigma = sigma
    this.epsilon = epsilon
    this.gridLen = gridLen
    this.size = size

    this.center = typeof center == 'undefined' ? createVector(0, 0) : center

    //The colors of the links by alphabet
    this.colors = colors

    this.sprites = sprites

    this.done = false
    this.t = 0
  }

  loadConveyerSprites() {
    this.sprites = GraphVisualizer.preloadedSprites
  }

  //This is a setup function for the initial disposition of the nodes
  //This will greatly influence the outcome
  buildNodes() {
    this.n = this.graph.length
    this.Nodes = []
    for (let i = 0; i < this.n; i++) {
      this.Nodes.push(createVector(i % this.gridLen, floor(i / this.gridLen)))
    }
  }

  //A function to draw a link to oneself
  drawSelfArc(pos, id = 0, color = 'black', myStroke = 0.01) {
    let dif = p5.Vector.sub(pos, this.massCenter)
      .setMag(this.nodeSize / this.scale / 2)
      .rotate(id * 2)
    let center = p5.Vector.add(pos, dif)
    let p = World.w2s(center)
    strokeWeight(World.w2s(myStroke))
    stroke(color)
    fill(0, 0)
    ellipse(
      p.x,
      p.y,
      World.w2s(this.nodeSize / this.scale),
      World.w2s(this.nodeSize / this.scale)
    )

    let intersectionOffset = p5.Vector.div(dif, -2)
      .rotate(-PI / 3)
      .setMag(this.nodeSize / this.scale / 2 + 0.01)
    let intersection = p5.Vector.add(center, intersectionOffset)
    drawArrow(
      intersection,
      p5.Vector.mult(intersectionOffset, -1)
        .rotate(-PI / 1.8)
        .setMag(0.001),
      color
    )
    intersection = World.w2s(intersection)
  }

  //This draws nodes [I know, mindblowing]
  drawGraph() {
    let thereSprite =
      this.sprites != null && this.sprites.length == this.Nodes.length
    //World.offset = this.center;
    this.Nodes.forEach((node, i) => {
      let p = World.w2s(node)
      let id = 0

      //[[targte, numOf ]]
      let targets = {}

      //Populate targets
      this.graph[i].forEach((nei, j) => {
        if (!(nei in targets)) targets[nei] = [[], 0]

        targets[nei][0].push(j)
        targets[nei][1]++
      })

      Object.entries(targets).forEach(([nei, arr]) => {
        let [indices, count] = arr
        let j = indices[0]

        if (i == nei) {
          indices.forEach((j, k) => {
            this.drawSelfArc(node, id, this.colors[j])
            id++
          })
        } else if (count != 1) {
          let neighbour = this.Nodes[nei]

          let diff = p5.Vector.sub(neighbour, node)
          let len = diff.mag() - this.nodeSize / this.scale / 2

          let localNode = node.copy()

          diff.setMag(len - 0.015)

          indices.forEach((j, k) => {
            drawArrowCurve(localNode, diff, this.colors[j], k)
          })
        } else {
          let neighbour = this.Nodes[nei]

          let diff = p5.Vector.sub(neighbour, node)
          let len = diff.mag() - this.nodeSize / this.scale / 2

          let localNode = node.copy()

          //Checks if it's a double sided link
          if (this.graph[nei].includes(i)) {
            len -= this.nodeSize / this.scale / 2
            len /= 2
            localNode = p5.Vector.lerp(node, this.Nodes[nei], 0.5)
          }

          diff.setMag(len - 0.015)
          drawArrow(localNode, diff, this.colors[j])
        }
      })

      //Draw Node
      let diam = World.w2s(this.nodeSize / this.scale)
      stroke('black')
      fill(255)
      strokeWeight(World.w2s(0.01))
      ellipse(p.x, p.y, diam)

      blendMode(BLEND)
      if (thereSprite) {
        imageMode(CENTER)
        // translating the sprites  
        let dr = (diam*0.08)
        let dy = (i%2) ? 0 : dr
        let dx = (i%2) ? dr: 0
        dy = (i==0) ? -dy : dy
        dx = (i==3) ? -dx : dx
        translate(dx, dy)
        
        //drawing the sprites
        image(this.sprites[i], p.x, p.y, diam * 0.7, diam * 0.7)
        
        //translating back
        translate(-dx,-dy)
        
        blendMode(SOFT_LIGHT)
        // fill(255, 120)
        // strokeWeight(World.w2s(0.005))
        // ellipse(p.x, p.y, diam * 0.25)
      }

      fill(thereSprite ? 255 : 0)
      noStroke()
      textAlign(CENTER, CENTER)
      textStyle(thereSprite ? BOLD : NORMAL)
      textSize(diam * 0.6 * (thereSprite ? 0.7 : 1))
      text(i.toString(), p.x, p.y - (thereSprite ? 0 : 0))
      blendMode(BLEND)
    })
    //World.offset = createVector(0, 0);
  }

  //Compute the repulsive force between two nodes
  fRep(u, v) {
    let sub = p5.Vector.sub(u, v)
    sub.mult(this.cRep / sub.magSq())
    return sub
  }

  //Compute the atttractive force between two nodes
  fSpring(u, v) {
    let sub = p5.Vector.sub(v, u)
    sub.mult(this.cSpr * Math.log(sub.mag() / this.tLength))
    return sub
  }

  //This is the main function
  orderGraph() {
    while (!this.done) {
      let Forces = []
      this.Nodes.forEach((node, i) => {
        Forces[i] = createVector(0, 0)
      })

      this.Nodes.forEach((node, i) => {
        this.Nodes.forEach((otherNode) => {
          if (node != otherNode) Forces[i].add(this.fRep(node, otherNode))
        })

        this.graph[i].forEach((nei) => {
          if (i != nei) {
            let f = this.fSpring(node, this.Nodes[nei])
            Forces[i].add(f)
            Forces[nei].add(p5.Vector.mult(f, -1))
          }
        })
      })

      this.done = Forces.every((f) => f.mag() < this.epsilon)

      //Computes the mass center and translate everything to keep it centered
      this.massCenter = createVector(0, 0)
      this.Nodes.forEach((node, i) => {
        this.Nodes[i].add(Forces[i].mult(this.sigma))
        this.massCenter.add(this.Nodes[i])
      })
      this.massCenter.div(this.Nodes.length)

      this.Nodes.forEach((node, i) => {
        this.Nodes[i].sub(this.massCenter)
      })
    }

    //Rescale the graph to fit the size
    let scale = createVector(-Infinity, -Infinity)

    this.Nodes.forEach((node) => {
      scale.x = max(scale.x, abs(node.x))
      scale.y = max(scale.y, abs(node.y))
    })

    scale.div(this.size / 2)
    this.Nodes.forEach((node) => {
      node.x /= scale.x
      node.y /= scale.y
    })

    this.Nodes.forEach((node) => {
      node.add(this.center)
    })

    this.scale = max(scale.x, scale.y)
    //The scale is also used for the node size, so it's necesary only if smaller than one
    this.scale = this.scale > 1 ? this.scale : 1
  }

  //This functions setu the visualization
  setup() {
    this.done = false
    this.t = 0
    this.buildNodes()
    this.orderGraph()
    this.loadConveyerSprites()
  }
}

//Simple arrow drawing function
function drawArrow(
  base,
  vec,
  myColor = 'black',
  myStroke = 0.01,
  arrowSize = 0.05
) {
  base = World.w2s(base)
  vec = vec.copy()
  vec.mult(World.w2sk)
  vec.y *= -1
  push()
  stroke(myColor)
  strokeWeight(World.w2s(myStroke))
  fill(myColor)
  translate(base.x, base.y)
  line(0, 0, vec.x, vec.y)
  rotate(vec.heading())
  arrowSize *= World.w2sk
  translate(vec.mag() - arrowSize, 0)
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0)
  pop()
}

function drawArrowCurve(
  base,
  vec,
  myColor = 'black',
  index = 0,
  displace = 0.2,
  myStroke = 0.01,
  arrowSize = 0.05
) {
  displace *= floor(index / 2) + 1
  base = World.w2s(base)
  vec = vec.copy()
  vec.mult(World.w2sk)
  vec.y *= -1

  let controlOffset = vec.copy().rotate(radians(90)).setMag(World.w2s(displace))
  controlOffset.mult(index % 2 ? -1 : 1)
  let control = p5.Vector.add(p5.Vector.div(vec, 2), controlOffset)

  push()
  stroke(myColor)
  strokeWeight(World.w2s(myStroke))
  translate(base.x, base.y)

  noFill()
  beginShape()
  vertex(0, 0)
  quadraticVertex(control.x, control.y, vec.x, vec.y)
  endShape()

  fill(myColor)
  rotate(vec.heading())
  arrowSize *= World.w2sk
  translate(vec.mag() - arrowSize / 2, 0)
  rotate(-vec.angleBetween(control))
  triangle(
    arrowSize / 2,
    arrowSize / 2,
    arrowSize / 2,
    -arrowSize / 2,
    arrowSize + arrowSize / 2,
    0
  )
  pop()
}
