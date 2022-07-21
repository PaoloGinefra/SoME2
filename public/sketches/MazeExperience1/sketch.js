let mazeGenerator, imageWaller, env, rayCaster, automabot
let mapButton
let state,
  showMap = false
const size = 10

let font
function preload() {
  font = loadFont('../Art/Fonts/PressStart2P.ttf')
}

function setup() {
  World.setup(windowWidth, windowHeight)
  textFont(font)

  //Maze generation
  mazeGenerator = new NonPerfectMazeGenerator(10, 10, 2, 0.7, 0.1)
  mazeGenerator.size = size
  mazeGenerator.generateMaze()
  mazeGenerator.buildAutomata()
  if (mazeGenerator.seed == 0) console.log(mazeGenerator.rng.state)

  //Image walling
  imageWaller = new ImageWaller(size)
  imageWaller.createWalls(mazeGenerator.getImage())

  //Enviroment building
  env = new Env()
  env.walls = imageWaller.walls

  //Raycaster setup
  rayCaster = new RayCaster(createVector(0, 1), env)
  rayCaster.viewRadius = 1
  rayCaster.lightColor = color(255, 157, 69, 200)
  rayCaster.bodyColor = color(0, 0)

  //Automabot
  automabot = new Automabot(mazeGenerator.MapAutomaton, mazeGenerator.mapNodes)
  automabot.size = mazeGenerator.cellSize
  automabot.speed = 1.5
  automabot.Interpolation = Automabot.Linear
  state =
    mazeGenerator.state2mapState[
      floor(Math.random() * mazeGenerator.Automaton.length)
    ]
  automabot.computeAnimation(state, '', true, true)

  mapButton = createButton('')
  mapButton.position(0, 0)
  mapButton.mousePressed(ToggleMap)
  mapButton.style('background: none')
  mapButton.style('border: none')
  mapButton.style('outline: none')

  ComputeWord()
}

function ComputeWord() {
  syncWord = '...'
  syncWorker.postMessage([
    mazeGenerator.Automaton,
    mazeGenerator.Automaton.length - 1,
  ])
}

function draw() {
  console.log(syncWord)

  background(0)
  World.cameraPos = automabot.position
  World.draw()

  mapButton.size(
    World.w2s(mazeGenerator.cellSize),
    World.w2s(mazeGenerator.cellSize)
  )

  mapButton.position(
    (World.width - mapButton.width) / 2,
    (World.height - mapButton.height) / 2
  )

  mazeGenerator.draw(false)

  automabot.drawSprite()

  rayCaster.updateOrigin(automabot.position)
  rayCaster.cast(env.getWalls())
  rayCaster.draw()

  if (showMap)
    mazeGenerator.draw(
      true,
      p5.Vector.add(automabot.position, createVector(0, 0)),
      0.1
    )

  automabot.animationStep()
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
  }
}

function ToggleMap() {
  showMap = !showMap
}