let mazeGenerator, imageWaller, env, rayCaster, automabot
let mapButton
let state,
  showMap = false,
  autoMovment = false
const size = 10
let dirsButtons = []

let font
function preload() {
  font = loadFont('../Art/Fonts/PressStart2P.ttf')

  let params = getURLParams()
  autoMovment = params.auto == 'true'
}

function setup() {
  World.setup(windowWidth, windowHeight)
  textFont(font)

  //Maze generation
  /**
   * SEED-Size   WORD
   * 33694208-8 -> 12113030101
   * 883911424-8 -> 1101301010 - RRURLURURU
   */
  mazeGenerator = new NonPerfectMazeGenerator(8, 8, 883911424, 0.7, 0.1)
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
  if (autoMovment)
    automabot = new Automabot(
      mazeGenerator.MapAutomaton,
      mazeGenerator.mapNodes
    )
  else
    automabot = new Automabot(
      mazeGenerator.RoomAutomaton,
      mazeGenerator.roomNodes
    )
  automabot.size = mazeGenerator.cellSize
  automabot.speed = 1.5
  automabot.Interpolation = Automabot.Linear
  state =
    mazeGenerator.state2mapState[
      floor(Math.random() * mazeGenerator.Automaton.length)
    ]
  automabot.computeAnimation(state, '', autoMovment, true)

  mapButton = createButton('')
  mapButton.position(0, 0)
  mapButton.mousePressed(ToggleMap)
  mapButton.style('background: none')
  mapButton.style('border: none')
  mapButton.style('outline: none')

  findButtons()
  //ComputeWord()
}

function ComputeWord() {
  syncWord = '...'
  syncWorker.postMessage([
    mazeGenerator.Automaton,
    mazeGenerator.Automaton.length - 1,
  ])
}

function draw() {
  //console.log(syncWord)
  background(0)
  World.cameraPos = automabot.position
  World.draw()

  transformDirButtons()

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
    automabot.computeAnimation(state, i.toString(), autoMovment)
  }
}

function ToggleMap() {
  showMap = !showMap
}

const ids = ['#up', '#right', '#down', '#left']
function findButtons() {
  for (let i = 0; i < 4; i++) {
    dirsButtons.push(select(ids[i]))
    dirsButtons[i].mousePressed(() =>
      automabot.computeAnimation(state, i.toString(), autoMovment)
    )
  }
}

function transformDirButtons(
  size = mazeGenerator.cellSize * 0.8,
  dist = mazeGenerator.cellSize * 1.2
) {
  let offset = createVector(0, -1).mult(World.w2s(dist))
  let wSize = World.w2s(size)
  for (let i = 0; i < 4; i++) {
    dirsButtons[i].size(wSize, wSize)
    let p = p5.Vector.add(
      createVector(
        (World.width - dirsButtons[i].width) / 2,
        (World.height - dirsButtons[i].height) / 2
      ),
      offset
    )
    dirsButtons[i].position(p.x, p.y)
    offset.rotate(PI / 2)
  }
}
