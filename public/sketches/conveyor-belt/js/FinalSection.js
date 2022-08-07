class FinalSection {
  constructor(x, width, padding, carImage1, carImage2) {
    this.x = x
    this.width = width
    this.padding = padding
    this.carImage1 = carImage1
    this.carImage2 = carImage2
  }

  fitToRectangle(imgWidth, imgHeight, containerWidth, containerHeight) {
    const ratio = Math.min(
      containerWidth / imgWidth,
      containerHeight / imgHeight
    )

    const newImgWidth = Math.floor(imgWidth * ratio)
    const newImgHeight = Math.floor(imgHeight * ratio)

    return [newImgWidth, newImgHeight]
  }

  draw() {
    const img = this.carImage1

    // scale image to fit the section size
    const [w, h] = this.fitToRectangle(
      img.width,
      img.height,
      this.width - 2 * this.padding,
      height - 2 * this.padding
    )

    // draw image centered
    // NOTE: no need to factor in the margin in these calculations because the car will be in the center of the section anyway
    const y = height / 2 - h / 2
    const x = this.x + this.width / 2 - w / 2

    image(img, x, y, w, h)

    if (DEBUG) {
      // section
      stroke(255, 255, 0)
      strokeWeight(5)
      noFill()
      rect(this.x, 0, this.width, height)

      // padding
      stroke(0, 255, 255)
      strokeWeight(5)
      noFill()
      rect(
        this.x + this.padding,
        this.padding,
        this.width - 2 * this.padding,
        height - 2 * this.padding
      )
    }
  }
}
