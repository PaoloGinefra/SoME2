class FinalSection {
  carWidth = 445 // px
  carVertOffs = 100 // px

  // offset starting from the drawing point of the image
  triggerOffset = 160 // px

  constructor(x, width, carImage1, carImage2) {
    this.x = x
    this.width = width
    this.carImage1 = carImage1
    this.carImage2 = carImage2
  }

  get imagePositioningData() {
    const img = this.carImage1

    const w = this.carWidth
    const h = (this.carWidth / img.width) * img.height

    // draw image centered
    const y = this.carVertOffs
    const x = this.x + this.width / 2 - w / 2

    return { x, y, w, h }
  }

  update(items = []) {
    const { x: imageX } = this.imagePositioningData

    let i = 0
    while (i < items.length) {
      const item = items[i]

      if (item.x > imageX + this.triggerOffset) {
        // TODO: check if correct state
        const state = items.state

        // delete item
        items.splice(i, 1)
      } else {
        i++
      }
    }
  }

  draw() {
    const img = this.carImage1

    const { x, y, w, h } = this.imagePositioningData
    image(img, x, y, w, h)

    if (DEBUG) {
      stroke(255, 255, 0)
      strokeWeight(5)
      noFill()
      rect(this.x, 0, this.width, height)
    }
  }
}
