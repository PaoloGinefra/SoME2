const Automaton = [
  [3, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]

let gv
let automabot, mazeGenerator

let startingStateInput, wordInput, scenarioButton
let go = false

let divHeight = 30
let ShowMine = false

let brickColors
let mineColors

function preload() {
  NonPerfectMazeGenerator.preload()
  GraphVisualizer.preload()
  Automabot.preload()
}

function setup() {
  brickColors = [color('red'), color('green')]
  mineColors = [color('red'), color('blue'), color('green'), color('orange')]

  World.setup(windowWidth, windowHeight)

  mazeGenerator = new NonPerfectMazeGenerator(7, 7, 178079500, 0.7, 0.1)
  mazeGenerator.generateMaze()
  mazeGenerator.buildAutomata()

  gv = new GraphVisualizer(Automaton)
  gv.colors = brickColors
  gv.gridLen = 3
  gv.setup()

  automabot = new Automabot(Automaton, gv.Nodes)
  automabot.speed = 2
  automabot.size = 0.3
  automabot.Interpolation = Automabot.DoubleSigmoid
  automabot.Sprite = (pos, size) => {
    fill(0, 0, 0, 0)
    stroke(0, 0, 0)
    strokeWeight(World.w2s(0.03))
    ellipse(pos.x, pos.y, size)
  }

  startingStateInput = select('#startingState')

  updateOptions()

  startingStateInput.changed(handleSelect)

  wordInput = select('#wordInput')

  scenarioButton = select('#switch')
  scenarioButton.mousePressed(handleScenario)

  automabot.computeAnimation(
    Number(startingStateInput.value()),
    wordInput.value(),
    false,
    true
  )

  window.loadingManager.loaded()
}

function draw() {
  if (window.loadingManager.shouldPause) {
    return
  }

  background(255)
  World.draw()

  gv.drawGraph()
  automabot.drawSprite()

  if (go) automabot.animationStep()

  if (automabot.finished) {
    go = false
  }
}

function handleSubmit() {
  if (!go) {
    let word = wordInput.value()
    let state = Number(startingStateInput.value())

    automabot.computeAnimation(state, parceWord(word), false, true)
    go = true
  } else {
    go = false
  }
}

function handleSelect() {
  let state = Number(startingStateInput.value())

  go = false
  automabot.computeAnimation(state, parceWord(wordInput.value()), false, true)
}

function parceWord(word) {
  word = word.toLowerCase()
  let output = ''

  for (let c of word) {
    output += c == 'r' || c == '0' ? '0' : '1'
  }

  return output
}

function updateOptions() {
  let len = gv.graph.length
  startingStateInput.html('')
  for (let i = 0; i < len; i++) {
    startingStateInput.option(i.toString())
  }
  startingStateInput.value()
}

function handleScenario() {
  ShowMine = !ShowMine

  if (ShowMine) {
    gv.graph = mazeGenerator.Automaton
    gv.size = 5
    gv.colors = mineColors
    gv.setup()

    wordInput.attribute('pattern', '[udlrUDLR0123]+')

    automabot.Automaton = mazeGenerator.Automaton
    automabot.Nodes = gv.Nodes
    scenarioButton.html('Mine')
  } else {
    gv.graph = Automaton
    gv.size = 1
    gv.colors = brickColors
    gv.setup()

    wordInput.attribute('pattern', '[rgRG01]+')
    automabot.Automabot = Automaton
    automabot.Nodes = gv.Nodes
    scenarioButton.html('Conveyor belt')
  }
  handleSelect()
  updateOptions()
}
