const Automaton = [
  [3, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]

let gv
let automabots, beltbots, minebots, mazeGenerator

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

  buildBots()

  wordInput = select('#wordInput')

  scenarioButton = select('#switch')
  scenarioButton.mousePressed(handleScenario)
}

function draw() {
  background(255)
  World.draw()

  gv.drawGraph()

  automabots.forEach((bot) => bot.animationStep())

  automabots.forEach((bot) => bot.drawSprite())
}

function buildBots() {
  beltbots = []
  minebots = []

  gv.graph = mazeGenerator.Automaton
  gv.size = 5
  gv.setup()

  mazeGenerator.Automaton.forEach((_, i) => {
    let automabot = new Automabot(mazeGenerator.Automaton, gv.Nodes)
    automabot.speed = 1
    automabot.size = 0.26
    automabot.Interpolation = Automabot.DoubleSigmoid
    automabot.Sprite = (pos, size) => {
      fill(0,0,0,0)
      stroke(0,0,0)
      strokeWeight(World.w2s(0.025))
      ellipse(pos.x, pos.y, size)
    }
    automabot.computeAnimation(i, '', false, true)
    minebots.push(automabot)
  })

  gv.graph = Automaton
  gv.size = 1
  gv.setup()

  gv.graph.forEach((_, i) => {
    let automabot = new Automabot(Automaton, gv.Nodes)
    automabot.speed = 1
    automabot.size = 0.3
    automabot.Interpolation = Automabot.DoubleSigmoid
    automabot.Sprite = (pos, size) => {
      fill(0,0,0,0)
      stroke(0,0,0)
      strokeWeight(World.w2s(0.025))
      ellipse(pos.x, pos.y, size)
    }
    automabot.computeAnimation(i, '', false, true)
    beltbots.push(automabot)
  })
  automabots = beltbots
}

function parceWord(word) {
  word = word.toLowerCase()
  let output = ''

  for (let c of word) {
    if (!ShowMine) output += c == 'r' || c == '0' ? '0' : '1' 
    else {
      switch (c) {
        case 'u':
        case '0':
          output += '0'
          break

        case 'r':
        case '1':
          output += '1'
          break

        case 'd':
        case '2':
          output += '2'
          break

        case 'l':
        case '3':
          output += '3'
          break
      }
    }
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

    automabots = minebots
    scenarioButton.html('Mine')
  } else {
    gv.graph = Automaton
    gv.size = 1
    gv.colors = brickColors
    gv.setup()

    wordInput.attribute('pattern', '[rgRG01]+')

    automabots = beltbots
    scenarioButton.html('Conveyor belt')
  }
}

function handleSubmit() {
  let word = wordInput.value()
  console.log(parceWord(word))
  automabots.forEach((bot, i) =>
    bot.computeAnimation(i, parceWord(word), false, true)
  )
}
