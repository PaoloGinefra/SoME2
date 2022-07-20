let canvas

let sections = []
let items = []

let lastSpawnTimestamp = 0

function resize(isSetup = false) {
  if (!canvas) return

  const canvasElement = canvas.elt
  const container = canvasElement.parentElement

  // if we are calling this from setup() do not readraw the canvas
  // this is because the draw() method was implementd assuming that the  setup() would have been exectued completely before being called
  resizeCanvas(container.clientWidth, 400, isSetup)
}

function spawnItem() {
  let newItem = new OrientableItem(-150, 0, pick(states), sections)

  // center item verically
  let [_, centerY] = newItem.center
  newItem.y = height / 2 + (newItem.y - centerY)

  items.push(newItem)
}

function conveyorSetup(isSetup = false) {
  resize(isSetup)

  sections = []

  const sectionWidth = Math.floor(width / SECTIONS_NUMBER)
  for (let i = 0; i < SECTIONS_NUMBER; i++) {
    const action = i % 2 == 0 ? 0 : 1
    const newSection = new Section(i, action, sectionWidth)
    sections.push(newSection)
  }
}

function setup() {
  canvas = createCanvas(500, 400)
  conveyorSetup(true)
}

function draw() {
  // update
  items = items.filter((item) => item.x < width) // remove out of screen items
  items.forEach((item) => item.update())

  const now = millis()
  const itemSpawnInterval = width / CONVEYOR_SPEED

  if (lastSpawnTimestamp + itemSpawnInterval < now) {
    lastSpawnTimestamp = now
    spawnItem()
  }

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

function windowResized() {
  conveyorSetup()
}
