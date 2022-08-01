let Automaton = [
  [1],
  [2],
  [0],
]

let graphVisualizer

function setup() {
  World.setup(windowWidth, windowHeight)
  graphVisualizer = new GraphVisualizer(Automaton)
  graphVisualizer.colors = ['red', 'green', 'blue']
  graphVisualizer.setup()
}

function draw() {
  background(255)
  World.draw()
  graphVisualizer.drawGraph()
}
