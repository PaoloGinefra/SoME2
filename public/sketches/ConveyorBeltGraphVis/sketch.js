let graphVisualizer

const automaton = [
  [3, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]

function setup() {
  World.setup(windowWidth, windowHeight)

  graphVisualizer = new GraphVisualizer(automaton)
  graphVisualizer.colors = [color('red'), color('green')]
  graphVisualizer.gridLen = 3
  graphVisualizer.setup()
}

function draw() {
  background(255)
  World.draw()

  graphVisualizer.drawGraph()
}
