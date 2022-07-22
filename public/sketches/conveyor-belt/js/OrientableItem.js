class OrientableItem {
  mainWidth = 150
  mainHeight = 200
  nubWidth = 50
  nubHeight = 50

  triggerOffset = [
    // action 1
    [
      this.nubWidth / 2,
      // these should never happen
      0,
      0,
      0,
    ],
    // action 2
    [
      this.mainWidth / 2,
      this.mainHeight / 2,
      this.mainWidth / 2,
      this.mainHeight / 2,
    ],
  ]

  // TODO: make easing proportional to section width
  easing = 0.004

  constructor(x, y, initialState, sections) {
    this.x = x
    this.y = y
    this.state = initialState
    this.sections = sections
    this.lastSection = this.section
    this.angle = this.targetAngle
  }

  // we consider the center of the main rectangle to be the center of the whole
  get center() {
    return rectangleCenter(this.x, this.y, this.mainWidth, this.mainHeight)
  }

  get targetAngle() {
    return orientations[this.state]
  }

  // NOTE: this returnsundefined if the item is off screen
  get section() {
    const [x, _] = this.center
    return this.sections.find((section) => section.isInside(x))
  }

  transition(action) {
    this.state = automaton[this.state][action]
  }

  update() {
    // update position
    this.x += deltaTime * CONVEYOR_SPEED

    // update angle
    // https://stackoverflow.com/questions/2708476/rotation-interpolation
    // https://stackoverflow.com/a/2708740

    let target = this.targetAngle
    const diff =
      Math.abs(Math.round((this.targetAngle - this.angle) / (Math.PI / 2))) *
      (Math.PI / 2)
    if (diff > Math.PI / 2) {
      if (this.targetAngle > this.angle) {
        target -= 2 * Math.PI
      } else {
        target += 2 * Math.PI
      }
    }

    const dTheta = target - this.angle
    this.angle += dTheta * this.easing * deltaTime

    // update state
    const currentSection = this.section
    const hasSectionChanged =
      currentSection && currentSection.index !== this.lastSection?.index

    if (hasSectionChanged) {
      const [centerX, _] = this.center
      const currentAction = currentSection.action
      const triggerOffset = this.triggerOffset[currentAction][this.state]

      // wait for when we pass the pin to update the state
      if (
        centerX + triggerOffset >=
        currentSection.pinPosition - currentSection.pinWidth / 2
      ) {
        this.lastSection = currentSection
        this.transition(currentAction)
      }
    }
  }

  draw() {
    const [rx, ry] = this.center

    fill(255)
    noStroke()

    push()
    translate(rx, ry)
    rotate(this.angle)
    translate(-rx, -ry)

    rect(this.x, this.y, this.mainWidth, this.mainHeight)
    rect(
      this.x + this.mainWidth / 2 - this.nubWidth / 2,
      this.y - this.nubHeight,
      this.nubWidth,
      this.nubHeight
    )

    pop()

    if (DEBUG) {
      strokeWeight(10)

      stroke('green')
      const [x, y] = this.center
      point(x, y)

      stroke('red')
      point(this.x, this.y)
    }
  }
}
