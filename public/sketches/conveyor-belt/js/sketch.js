const secitonsNumberSpan = document.getElementById('section-number')

let canvas

let sections = []
let items = []

let lastSpawnTimestamp = 0

let legoImage

function spawnItem(force = false) {
  const now = millis()
  const itemSpawnInterval = width / CONVEYOR_SPEED

  if (now - lastSpawnTimestamp < itemSpawnInterval) {
    if (!force) return
  }
  lastSpawnTimestamp = now

  let newItem = new OrientableItem(-150, 0, pick(states), sections, legoImage)

  // center item verically
  let [_, centerY] = newItem.center
  newItem.y = height / 2 + (newItem.y - centerY)

  items.push(newItem)
}

function setupConveyor(sectionsNumber) {
  secitonsNumberSpan.innerText = sectionsNumber

  // setup canvas
  const width = sectionsNumber * SECTION_WIDTH
  if (!canvas) {
    canvas = createCanvas(width, 400)
  } else {
    resizeCanvas(width, 400)
  }
  canvas.parent('canvas-container')

  // reset state
  sections = []
  items = []

  // put stuff in canvas
  for (let i = 0; i < sectionsNumber; i++) {
    const action = i % 2 == 0 ? 0 : 1
    const newSection = new Section(i, action, SECTION_WIDTH)
    sections.push(newSection)
  }

  spawnItem(true)
}

function preload() {
  legoImage = loadImage('../Art/lego.png')
}

function setup() {
  setupConveyor(INITIAL_SECTIONS)
}

function draw() {
  // update
  items = items.filter((item) => item.x < width) // remove out of screen items
  items.forEach((item) => item.update())
  spawnItem()

  // draw
  background('#333')
  sections.forEach((section) => section.draw())
  items.forEach((item) => item.draw())

  if (DEBUG) {
    strokeWeight(1)
    stroke(127)
    line(0, height / 2, width, height / 2)
  }
}

function mouseClicked() {
  sections.forEach((section) => section.mouseClicked())
}

document.getElementById('btn-add').addEventListener('click', () => {
  let n = Math.min(MAX_SECTIONS, sections.length + 1)
  setupConveyor(n)
})

document.getElementById('btn-remove').addEventListener('click', () => {
  let n = Math.max(MIN_SECTIONS, sections.length - 1)
  setupConveyor(n)
})
