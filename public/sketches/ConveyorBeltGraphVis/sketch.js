let graphVisualizer, mazeGenerator
let ShowMine = false
let scenarioButton

const automaton = [
  [3, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]

function preload() {
  NonPerfectMazeGenerator.preload()
  GraphVisualizer.preload()
}

let brickColors
let mineColors
function setup() {
  brickColors = [color('red'), color('green')]
  mineColors = [color('red'), color('blue'), color('green'), color('orange')]

  World.setup(windowWidth, 400)

  mazeGenerator = new NonPerfectMazeGenerator(7, 7, 178079500, 0.7, 0.1)
  mazeGenerator.generateMaze()
  mazeGenerator.buildAutomata()

  graphVisualizer = new GraphVisualizer(automaton)
  graphVisualizer.colors = brickColors
  graphVisualizer.gridLen = 3
  graphVisualizer.setup()

  scenarioButton = select('#switch')
  scenarioButton.mousePressed(handleScenario)

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

function handleScenario() {
  ShowMine = !ShowMine

  if (ShowMine) {
    graphVisualizer.graph = mazeGenerator.Automaton
    graphVisualizer.size = 5
    graphVisualizer.colors = mineColors
    scenarioButton.html('Mine')
  } else {
    graphVisualizer.graph = automaton
    graphVisualizer.size = 1
    graphVisualizer.colors = brickColors
    scenarioButton.html('Conveyor belt')
  }
  graphVisualizer.setup()
}
