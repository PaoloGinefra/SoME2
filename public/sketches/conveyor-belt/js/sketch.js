// DOM elements
const sectionsNumberSpan = document.getElementById('section-number')
let canvas

// state
let sections = []
let finalSection = null
let items = []

let lastSpawnTimestamp = 0

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

function updateSections(sectionsNumber) {
  // remove sections if there are too many
  while (sections.length > sectionsNumber) {
    sections.pop()
  }

  // add sections if there are too few
  while (sections.length < sectionsNumber) {
    const i = sections.length

    const action = i % 2 == 0 ? 0 : 1
    const newSection = new Section(
      i,
      action,
      SECTION_WIDTH,
      greenPinImage,
      redPinImage
    )
    sections.push(newSection)
  }

  finalSection = new FinalSection(
    sectionsNumber * SECTION_WIDTH,
    FINAL_SECTION_WIDTH,
    carImage1,
    carImage2
  )
}

function setupConveyor(sectionsNumber) {
  // if we already have the desired number of sections, do nothing
  if (sectionsNumber == sections.length) {
    return
  }

  sectionsNumberSpan.innerText = sectionsNumber

  // setup canvas
  const width = sectionsNumber * SECTION_WIDTH + FINAL_SECTION_WIDTH
  if (!canvas) {
    canvas = createCanvas(width, 400)
  } else {
    resizeCanvas(width, 400)
  }
  canvas.parent('canvas-container')

  // remove all items to avoid funky behaviours
  items = []

  updateSections(sectionsNumber)

  spawnItem(true)
}

let legoImage
let greenPinImage
let redPinImage
let carImage1
let carImage2

function preload() {
  legoImage = loadImage('../Art/lego.png')
  greenPinImage = loadImage('../Art/Pins/greenPin.png')
  redPinImage = loadImage('../Art/Pins/redPin.png')

  carImage1 = loadImage('../Art/legoCar1.png')
  carImage2 = loadImage('../Art/legoCar2.png')
}

function setup() {
  setupConveyor(INITIAL_SECTIONS)
  window.loadingManager.loaded()
}

function draw() {
  // update
  finalSection.update(items) // handle items that are in the last section
  items.forEach((item) => item.update())
  spawnItem()

  // draw
  background('#333')
  sections.forEach((section) => section.draw())
  finalSection.draw()
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
