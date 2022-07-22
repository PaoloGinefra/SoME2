const Automaton = [
  [3, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]

let gv
let automabots, mazeGenerator

let wordInput, scenarioButton
let go = false

let divHeight = 30
let ShowMine = false

let brickColors
let mineColors

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

  buildBots()

  wordInput = select('#wordInput')

  scenarioButton = select('#switch')
  scenarioButton.mousePressed(handleScenario)
}

function draw() {
  background(255)
  World.draw()

  gv.drawGraph()
  automabots.forEach((bot) => bot.drawSprite())

  automabots.forEach((bot) => bot.animationStep())


  // if (go) automabot.animationStep()

  // if (automabot.finished) {
  //   go = false
  // }
}

function buildBots() {
  automabots = []
  gv.graph.forEach((_, i) => {
    let automabot = new Automabot(Automaton, gv.Nodes)
    automabot.speed = 1
    automabot.size = 0.1
    automabot.Interpolation = Automabot.DoubleSigmoid
    automabot.Sprite = (pos, size) => {
      fill('black')
      stroke(0)
      strokeWeight(World.w2s(0.005))
      ellipse(pos.x, pos.y, size)
    }
    automabot.computeAnimation(i, '', false, true)
    automabots.push(automabot)
  })
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
}

function handleSubmit() {
  if (!go) {
    let word = wordInput.value()
    automabots.forEach((bot, i) =>
      bot.computeAnimation(i, parceWord(word), false, true)
    )
    go = true
  } else {
    go = false
  }
}
