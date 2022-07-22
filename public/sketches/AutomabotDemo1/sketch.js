const Automaton = [
  [3, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]

let gv
let automabot, mazeGenerator

let startingStateInput, wordInput
let go = false

let divHeight = 30

function setup() {
  console.log('setup')
  World.setup(windowWidth, windowHeight)

  gv = new GraphVisualizer(Automaton)
  gv.colors = [color('red'), color('green')]
  gv.gridLen = 3
  gv.setup()

  automabot = new Automabot(Automaton, gv.Nodes)
  automabot.speed = 2
  automabot.size = 0.1
  automabot.Interpolation = Automabot.Linear
  automabot.Sprite = (pos, size) => {
    fill('black')
    stroke(0)
    strokeWeight(World.w2s(0.005))
    ellipse(pos.x, pos.y, size)
  }

  startingStateInput = select('#startingState')

  let len = Automaton.length
  for (let i = 0; i < len; i++) {
    startingStateInput.option(i.toString())
  }

  startingStateInput.changed(handleSelect)

  wordInput = select('#wordInput')

  automabot.computeAnimation(
    Number(startingStateInput.value()),
    wordInput.value(),
    false,
    true
  )
}

function draw() {
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
