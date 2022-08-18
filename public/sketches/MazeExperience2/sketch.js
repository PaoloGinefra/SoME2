let mazeGenerator, automabot, graphVisualizer, gvAutomabot
const size = 5
let state
let tool = 2
let UiPressed = false

let Colors = ['red', 'blue', 'green', 'orange']

let font
function preload() {
  font = loadFont('../Art/Fonts/PressStart2P.ttf')

  NonPerfectMazeGenerator.preload()
  GraphVisualizer.preload()
  Automabot.preload()
}

function setup() {
  World.targetZoom = 5
  World.setup(windowWidth, windowHeight)

  UIsetup()
  textFont(font)

  //Maze Generation
  mazeGenerator = new NonPerfectMazeGenerator(6, 6, 3, 0.7, 0.1, size)
  mazeGenerator.generateMaze()
  mazeGenerator.buildAutomata()

  //GraphVisualizer
  graphVisualizer = new GraphVisualizer()
  graphVisualizer.center = createVector(size + 0.5, 0)
  graphVisualizer.tLength = 0.0001
  graphVisualizer.colors = Colors
  graphVisualizer.cRep = 0.05
  graphVisualizer.size = size * 0.9
  graphVisualizer.graph = mazeGenerator.Automaton
  graphVisualizer.gridLen = sqrt(mazeGenerator.Automaton.length)
  graphVisualizer.setup()

  //Automabot
  automabot = new Automabot()
  automabot.speed = 5
  automabot.Interpolation = Automabot.DoubleSigmoid
  let startState = floor(Math.random() * mazeGenerator.Automaton.length)
  state = mazeGenerator.state2mapState[startState]
  UpdateAutomabot()
  automabot.computeAnimation(state, '', true, 1)

  //GvAutomabot
  gvAutomabot = new Automabot()
  gvAutomabot.speed = 3
  gvAutomabot.Interpolation = Automabot.DoubleSigmoid
  UpdateGvAutomabot()
  gvAutomabot.computeAnimation(startState, '', true, 1)

  ComputeWord()

  window.loadingManager.loaded()
}

function draw() {
  if (window.loadingManager.shouldPause) {
    return
  }

  background(255)
  World.draw()

  mazeGenerator.draw()
  automabot.drawSprite()

  let wMouse = World.s2w(World.mouseVec)
  mazeGenerator.drawBrush(wMouse, tool)

  drawWord()

  graphVisualizer.drawGraph()
  gvAutomabot.drawSprite()

  automabot.animationStep()
  gvAutomabot.animationStep()
}

const keyComands = [
  ['w', 'd', 's', 'a'],
  ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'],
]

function keyPressed() {
  let i, j
  for (
    j = 0;
    j < keyComands.length && (j == 0 || key != keyComands[j - 1][i]);
    j++
  )
    for (i = 0; i < keyComands[j].length && key != keyComands[j][i]; i++);

  if (i < keyComands[0].length) {
    automabot.computeAnimation(state, i.toString(), true)
    gvAutomabot.computeAnimation(state, i.toString(), false)
  }

  // prevent default behaviour
  // stops the page from scrolling when the user uses the arrow keys to move the character
  return false
}

function mouseClicked() {
  if (UiPressed) {
    UiPressed = false
    return
  }

  let wMouse = World.s2w(World.mouseVec)
  if (tool != 2 && mouseButton == LEFT) {
    if (mazeGenerator.brush(wMouse, tool)) {
      mazeGenerator.buildAutomata()

      UpdateAutomabot()
      state = automabot.nearestState(mazeGenerator.mapNodes)
      automabot.computeAnimation(state, '', true, 1)

      UpdateVisualizer()
      gvAutomabot.computeAnimation(
        automabot.nearestState(mazeGenerator.Nodes),
        '',
        false,
        1
      )

      ComputeWord()
    } else {
      tool = 2
      ButtonReset()
    }
  }
}

function UpdateAutomabot() {
  automabot.Automaton = mazeGenerator.MapAutomaton
  automabot.Nodes = mazeGenerator.mapNodes
  automabot.size = mazeGenerator.cellSize
}

function UpdateGvAutomabot() {
  gvAutomabot.Automaton = mazeGenerator.Automaton
  gvAutomabot.Nodes = graphVisualizer.Nodes
  gvAutomabot.size = mazeGenerator.cellSize
}

function UpdateVisualizer() {
  graphVisualizer.graph = mazeGenerator.Automaton
  graphVisualizer.gridLen = sqrt(mazeGenerator.Automaton.length)
  graphVisualizer.setup()
  UpdateGvAutomabot()
}

function ComputeWord() {
  syncWord = '...'
  syncWorker.postMessage([mazeGenerator.Automaton, undefined])
}

function drawWord() {
  let p = World.w2s(createVector(0, size / 2))
  textAlign(CENTER, BOTTOM)
  textSize(World.w2s(mazeGenerator.cellSize))
  fill(0)
  drawtext('$!' + convertWord(syncWord) + '$->' + syncDestination, p.x, p.y)
}

let dirs = 'URDL'
function convertWord(word) {
  let out = ''
  for (let c of word) out += dirs.charAt(Number(c))
  return out
}

function drawtext(str, x, y) {
  let array = str.split('$')

  let offset = 0
  array.forEach((subStr) => {
    offset += textWidth(subStr)
    offset -= subStr.includes('!') * textWidth('!')
  })
  offset /= 2

  let pos_x = x
  textAlign(LEFT)
  array.forEach((subStr) => {
    if (subStr.charAt(0) == '!') {
      for (let char of subStr.slice(1)) {
        let c = Colors[dirs.indexOf(char)]
        let w = textWidth(char)
        fill(color(c))
        text(char, pos_x - offset, y)
        pos_x += w
      }
    } else {
      let c = 'black'
      let w = textWidth(subStr)
      fill(c)
      text(subStr, pos_x - offset, y)
      pos_x += w
    }
  })
}

let brickButton, shovelButton

function UIsetup() {
  brickButton = select('#brick')
  brickButton.mousePressed(() => {
    UiPressed = true
    tool = 0
    brickButton.style('transform: scale(1.2);')
    brickButton.style('background-color: white; opacity: 100%;')
    shovelButton.style('transform: scale(1);')
    shovelButton.style('background-color: rgba(0,0,0,0); opacity: 50%;')
  })

  shovelButton = select('#shovel')
  shovelButton.mousePressed(() => {
    UiPressed = true
    tool = 1
    brickButton.style('transform: scale(1);')
    brickButton.style('background-color: rgba(0,0,0,0); opacity: 50%;')
    shovelButton.style('transform: scale(1.2);')
    shovelButton.style('background-color: white;opacity: 100%;')
  })

  ButtonReset()
}

function ButtonReset() {
  brickButton.style('transform: scale(1);')
  brickButton.style('background-color: rgba(0,0,0,0); opacity: 50%;')
  shovelButton.style('transform: scale(1);')
  shovelButton.style('background-color: rgba(0,0,0,0); opacity: 50%;')
}
