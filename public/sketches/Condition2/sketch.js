let Automaton = [
  [0, 1],
  [0, 1],
  [2, 3],
  [2, 3],
]

let graphVisualizer

function setup() {
  World.setup(windowWidth, windowHeight)
  graphVisualizer = new GraphVisualizer(Automaton)
  graphVisualizer.colors = ['red', 'green', 'blue']
  graphVisualizer.setup()
  graphVisualizer.scale = 1
  graphVisualizer.sprites = null

  window.loadingManager.loaded()
}

function draw() {
  background(255)
  World.draw()
  graphVisualizer.drawGraph()
}
