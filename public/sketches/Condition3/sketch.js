let Automaton = [[1], [2], [0]]

let graphVisualizer

function preload() {
  GraphVisualizer.preload()
}

function setup() {
  World.setup(windowWidth, windowHeight)
  graphVisualizer = new GraphVisualizer(Automaton)
  graphVisualizer.colors = ['red', 'green', 'blue']
  graphVisualizer.setup()

  window.loadingManager.loaded()
}

function draw() {
  if (window.loadingManager.shouldPause) {
    return
  }

  background(255)
  World.draw()
  graphVisualizer.drawGraph()
}
