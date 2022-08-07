class FinalSection {
  carWidth = 445 // px
  carVertOffs = 100 // px

  constructor(x, width, carImage1, carImage2) {
    this.x = x
    this.width = width
    this.carImage1 = carImage1
    this.carImage2 = carImage2
  }

  draw() {
    const img = this.carImage1

    const w = this.carWidth
    const h = (this.carWidth / img.width) * img.height

    // draw image centered
    const y = this.carVertOffs
    const x = this.x + this.width / 2 - w / 2

    image(img, x, y, w, h)

    if (DEBUG) {
      stroke(255, 255, 0)
      strokeWeight(5)
      noFill()
      rect(this.x, 0, this.width, height)
    }
  }
}
