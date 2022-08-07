class Section {
  constructor(index, action, width, greenPinImage, redPinImage) {
    this.index = index
    this.action = action
    this.width = width
    this.greenPinImage = greenPinImage
    this.redPinImage = redPinImage

    // x position of start and end of this section
    this.start = this.width * index
    this.end = this.width * (index + 1)

    // x position where the pin will be drawn
    this.pinPosition = this.width * this.index + this.width / 2
    this.pinWidth = 20
  }

  isInside(x) {
    // NOTE: start is inclusive and end is exclusive, this is to avoid having some x coords that are in two sections simultaneously
    return x >= this.start && x < this.end
  }

  drawRed() {
    const h = 70
    const y = 0

    noStroke()
    image(
      this.redPinImage,
      this.pinPosition - this.pinWidth / 2,
      y,
      this.pinWidth,
      h
    )
  }

  drawGreen() {
    const h = 150
    const y = height - h

    noStroke()
    image(
      this.greenPinImage,
      this.pinPosition - this.pinWidth / 2,
      y,
      this.pinWidth,
      h
    )
  }

  draw() {
    if (this.action === 0) {
      this.drawRed()
    } else {
      this.drawGreen()
    }
  }

  mouseClicked() {
    if (mouseY <= height && this.isInside(mouseX)) {
      this.action = this.action === 0 ? 1 : 0
    }
  }
}
